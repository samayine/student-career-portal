from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.dependencies import get_current_user
from app.models.job import Job, JobApplication, JobStatus
from app.models.user import User, UserRole
from app.schemas.job import (
    ApplicationCreate,
    ApplicationRead,
    ApplicationReadWithJob,
    ApplicationStatusUpdate,
)
from app.utils.exceptions import BadRequestException, ForbiddenException, NotFoundException

router = APIRouter(tags=["Applications"])


@router.post(
    "/jobs/{job_id}/apply",
    response_model=ApplicationRead,
    status_code=status.HTTP_201_CREATED,
)
async def apply_to_job(
    job_id: UUID,
    application_in: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Apply to a job. Students only.
    Prevents duplicate applications to the same job.
    """
    if current_user.role != UserRole.STUDENT:
        raise ForbiddenException(detail="Only students can apply to jobs")

    # Check job exists and is active
    result = await db.execute(select(Job).where(Job.id == job_id))
    job = result.scalar_one_or_none()
    if not job:
        raise NotFoundException(detail="Job not found")
    if job.status != JobStatus.ACTIVE:
        raise BadRequestException(detail="This job is no longer accepting applications")

    # Check for duplicate application
    result = await db.execute(
        select(JobApplication).where(
            JobApplication.job_id == job_id,
            JobApplication.student_id == current_user.id,
        )
    )
    if result.scalar_one_or_none():
        raise BadRequestException(detail="You have already applied to this job")

    application = JobApplication(
        **application_in.model_dump(),
        job_id=job_id,
        student_id=current_user.id,
    )
    db.add(application)
    await db.commit()
    await db.refresh(application)
    return application


@router.get("/jobs/{job_id}/applications", response_model=List[ApplicationRead])
async def list_job_applications(
    job_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    List all applications for a job. Employer (job poster) or admin only.
    """
    result = await db.execute(select(Job).where(Job.id == job_id))
    job = result.scalar_one_or_none()
    if not job:
        raise NotFoundException(detail="Job not found")

    if job.posted_by != current_user.id and current_user.role != UserRole.ADMIN:
        raise ForbiddenException(detail="Access denied")

    result = await db.execute(
        select(JobApplication)
        .where(JobApplication.job_id == job_id)
        .order_by(JobApplication.applied_at.desc())
    )
    return result.scalars().all()


@router.patch("/applications/{application_id}/status", response_model=ApplicationRead)
async def update_application_status(
    application_id: UUID,
    status_update: ApplicationStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Update application status (reviewed/shortlisted/rejected/accepted).
    Employer only.
    """
    result = await db.execute(
        select(JobApplication)
        .options(selectinload(JobApplication.job))
        .where(JobApplication.id == application_id)
    )
    application = result.scalar_one_or_none()
    if not application:
        raise NotFoundException(detail="Application not found")

    if application.job.posted_by != current_user.id and current_user.role != UserRole.ADMIN:
        raise ForbiddenException(detail="Access denied")

    application.status = status_update.status
    await db.commit()
    await db.refresh(application)
    return application


@router.get("/me/applications", response_model=List[ApplicationReadWithJob])
async def get_my_applications(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get the current student's job applications (with job details).
    """
    if current_user.role != UserRole.STUDENT:
        raise ForbiddenException(detail="Only students have applications")

    result = await db.execute(
        select(JobApplication)
        .options(
            selectinload(JobApplication.job).options(
                selectinload(Job.company),
                selectinload(Job.applications),
            )
        )
        .where(JobApplication.student_id == current_user.id)
        .order_by(JobApplication.applied_at.desc())
    )
    applications = result.scalars().all()

    # Populate application counts
    for app in applications:
        app.job.application_count = len(app.job.applications)

    return applications
