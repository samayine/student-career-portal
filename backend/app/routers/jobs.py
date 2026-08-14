from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import func, select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.dependencies import get_current_user, get_optional_current_user
from app.models.job import Company, Job, JobApplication, JobStatus, JobType, saved_jobs
from app.models.user import User, UserRole
from app.schemas.job import (
    CompanyCreate,
    CompanyRead,
    JobCreate,
    JobListItem,
    JobRead,
    JobUpdate,
)
from app.utils.exceptions import BadRequestException, ForbiddenException, NotFoundException

router = APIRouter(prefix="/jobs", tags=["Jobs"])
company_router = APIRouter(prefix="/companies", tags=["Companies"])


# ─── Helper ───────────────────────────────────────────────────────────────────

async def _get_job_or_404(job_id: UUID, db: AsyncSession) -> Job:
    result = await db.execute(
        select(Job)
        .options(selectinload(Job.company), selectinload(Job.applications))
        .where(Job.id == job_id)
    )
    job = result.scalar_one_or_none()
    if not job:
        raise NotFoundException(detail="Job not found")
    return job


# ─── Company Endpoints ────────────────────────────────────────────────────────

@company_router.post("", response_model=CompanyRead, status_code=status.HTTP_201_CREATED)
async def create_company(
    company_in: CompanyCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a company profile. Only employers can do this."""
    if current_user.role not in (UserRole.EMPLOYER, UserRole.ADMIN):
        raise ForbiddenException(detail="Only employers can create a company profile")

    # Check if employer already has a company
    stmt = select(Company).where(Company.owner_id == current_user.id)
    result = await db.execute(stmt)
    if result.scalar_one_or_none():
        raise BadRequestException(detail="You already have a company profile")

    company = Company(**company_in.model_dump(), owner_id=current_user.id)
    db.add(company)
    await db.commit()
    await db.refresh(company)
    return company


@company_router.get("", response_model=List[CompanyRead])
async def list_companies(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Company).order_by(Company.name))
    return result.scalars().all()


@company_router.get("/me", response_model=CompanyRead)
async def get_my_company(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get the current employer's company."""
    await db.refresh(current_user, ["company"])
    if not current_user.company:
        raise NotFoundException(detail="You don't have a company profile yet")
    return current_user.company


# ─── Job Listing & Detail ─────────────────────────────────────────────────────

@router.get("", response_model=List[JobListItem])
async def list_jobs(
    keyword: Optional[str] = Query(None, description="Search in title/description"),
    location: Optional[str] = Query(None),
    job_type: Optional[JobType] = Query(None),
    is_remote: Optional[bool] = Query(None),
    posted_by_me: Optional[bool] = Query(False),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List active jobs with optional filters."""
    q = (
        select(Job)
        .options(selectinload(Job.company), selectinload(Job.applications))
    )
    
    # Only filter by ACTIVE if we aren't specifically asking for our own jobs
    if not posted_by_me:
        q = q.where(Job.status == JobStatus.ACTIVE)

    if keyword:
        q = q.where(
            Job.title.ilike(f"%{keyword}%") | Job.description.ilike(f"%{keyword}%")
        )
    if location:
        q = q.where(Job.location.ilike(f"%{location}%"))
    if job_type:
        q = q.where(Job.job_type == job_type)
    if is_remote is not None:
        q = q.where(Job.is_remote == is_remote)
    if posted_by_me and current_user:
        q = q.where(Job.posted_by == current_user.id)

    q = q.order_by(Job.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(q)
    jobs = result.scalars().all()

    # Attach application count
    for job in jobs:
        job.application_count = len(job.applications)

    return jobs


@router.get("/{job_id}", response_model=JobRead)
async def get_job(job_id: UUID, db: AsyncSession = Depends(get_db)):
    """Get a single job by ID."""
    job = await _get_job_or_404(job_id, db)
    job.application_count = len(job.applications)
    return job


# ─── Job Management (Employers) ───────────────────────────────────────────────

@router.post("", response_model=JobRead, status_code=status.HTTP_201_CREATED)
async def create_job(
    job_in: JobCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Post a new job. Employer only."""
    if current_user.role not in (UserRole.EMPLOYER, UserRole.ADMIN):
        raise ForbiddenException(detail="Only employers can post jobs")

    # Verify employer owns the company
    result = await db.execute(select(Company).where(Company.id == job_in.company_id))
    company = result.scalar_one_or_none()
    if not company:
        raise NotFoundException(detail="Company not found")
    if company.owner_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise ForbiddenException(detail="You can only post jobs for your own company")

    job = Job(**job_in.model_dump(), posted_by=current_user.id)
    db.add(job)
    await db.commit()

    # Reload with relationships
    result = await db.execute(
        select(Job)
        .options(selectinload(Job.company), selectinload(Job.applications))
        .where(Job.id == job.id)
    )
    job = result.scalar_one()
    job.application_count = 0
    return job


@router.put("/{job_id}", response_model=JobRead)
async def update_job(
    job_id: UUID,
    job_update: JobUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update a job posting. Only the poster or admin can update."""
    job = await _get_job_or_404(job_id, db)

    if job.posted_by != current_user.id and current_user.role != UserRole.ADMIN:
        raise ForbiddenException(detail="You can only edit your own job postings")

    update_data = job_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(job, key, value)

    await db.commit()
    await db.refresh(job)
    job.application_count = len(job.applications)
    return job


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job(
    job_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Soft-delete (close) a job. Only poster or admin."""
    job = await _get_job_or_404(job_id, db)

    if job.posted_by != current_user.id and current_user.role != UserRole.ADMIN:
        raise ForbiddenException(detail="You can only delete your own job postings")

    job.status = JobStatus.CLOSED
    await db.commit()


# ─── Save / Bookmark Jobs (Students) ─────────────────────────────────────────

me_router = APIRouter(prefix="/me", tags=["Me"])


@router.post("/{job_id}/save", status_code=status.HTTP_204_NO_CONTENT)
async def save_job(
    job_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Bookmark a job. Students only."""
    if current_user.role != UserRole.STUDENT:
        raise ForbiddenException(detail="Only students can save jobs")
    job = await _get_job_or_404(job_id, db)

    # Check if already saved
    result = await db.execute(
        select(saved_jobs).where(
            saved_jobs.c.user_id == current_user.id,
            saved_jobs.c.job_id == job.id,
        )
    )
    if result.first():
        return  # already saved, idempotent

    await db.execute(saved_jobs.insert().values(user_id=current_user.id, job_id=job.id))
    await db.commit()


@router.delete("/{job_id}/save", status_code=status.HTTP_204_NO_CONTENT)
async def unsave_job(
    job_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Remove a job bookmark."""
    await db.execute(
        delete(saved_jobs).where(
            saved_jobs.c.user_id == current_user.id,
            saved_jobs.c.job_id == job_id,
        )
    )
    await db.commit()


@me_router.get("/saved-jobs", response_model=List[JobListItem])
async def list_saved_jobs(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get all jobs bookmarked by the current student."""
    result = await db.execute(
        select(Job)
        .join(saved_jobs, saved_jobs.c.job_id == Job.id)
        .options(selectinload(Job.company), selectinload(Job.applications))
        .where(saved_jobs.c.user_id == current_user.id)
        .order_by(saved_jobs.c.created_at.desc())
    )
    jobs = result.scalars().all()
    for job in jobs:
        job.application_count = len(job.applications)
    return jobs
