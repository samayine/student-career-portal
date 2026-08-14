from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.job import ApplicationStatus, JobStatus, JobType


# ─── Company Schemas ──────────────────────────────────────────────────────────

class CompanyBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    description: Optional[str] = None
    website: Optional[str] = None
    logo_url: Optional[str] = None
    location: Optional[str] = None
    industry: Optional[str] = None


class CompanyCreate(CompanyBase):
    pass


class CompanyRead(CompanyBase):
    id: UUID
    owner_id: UUID
    created_at: datetime

    model_config = {"from_attributes": True}


# ─── Job Schemas ──────────────────────────────────────────────────────────────

class JobBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    description: str = Field(..., min_length=10)
    requirements: Optional[str] = None
    location: Optional[str] = None
    is_remote: bool = False
    job_type: JobType = JobType.FULL_TIME
    salary_min: Optional[int] = Field(None, ge=0)
    salary_max: Optional[int] = Field(None, ge=0)
    deadline: Optional[datetime] = None


class JobCreate(JobBase):
    company_id: UUID


class JobUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=255)
    description: Optional[str] = None
    requirements: Optional[str] = None
    location: Optional[str] = None
    is_remote: Optional[bool] = None
    job_type: Optional[JobType] = None
    salary_min: Optional[int] = Field(None, ge=0)
    salary_max: Optional[int] = Field(None, ge=0)
    deadline: Optional[datetime] = None
    status: Optional[JobStatus] = None


class JobRead(JobBase):
    id: UUID
    status: JobStatus
    company_id: UUID
    posted_by: UUID
    company: CompanyRead
    application_count: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class JobListItem(BaseModel):
    """Lightweight schema for job listing pages."""
    id: UUID
    title: str
    location: Optional[str]
    is_remote: bool
    job_type: JobType
    salary_min: Optional[int]
    salary_max: Optional[int]
    status: JobStatus
    company: CompanyRead
    application_count: int = 0
    created_at: datetime

    model_config = {"from_attributes": True}


# ─── Application Schemas ──────────────────────────────────────────────────────

class ApplicationCreate(BaseModel):
    cover_letter: Optional[str] = None
    resume_url: Optional[str] = None


class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus


class ApplicationRead(BaseModel):
    id: UUID
    status: ApplicationStatus
    cover_letter: Optional[str]
    resume_url: Optional[str]
    job_id: UUID
    student_id: UUID
    applied_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ApplicationReadWithJob(ApplicationRead):
    """For student's 'my applications' view — includes job info."""
    job: JobListItem
