import uuid
from datetime import datetime, timezone
from enum import Enum

from sqlalchemy import Boolean, Column, DateTime, Enum as SQLEnum, String, text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID

from app.database import Base
from sqlalchemy.orm import relationship


class UserRole(str, Enum):
    STUDENT = "student"
    EMPLOYER = "employer"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    
    role = Column(SQLEnum(UserRole), default=UserRole.STUDENT, nullable=False)
    
    is_active = Column(Boolean, default=True, nullable=False)
    
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        server_default=text("now()"),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        server_default=text("now()"),
        nullable=False,
    )

    # Relationships (defined here; back-populated from job.py)
    company = relationship("Company", back_populates="owner", uselist=False)
    posted_jobs = relationship("Job", foreign_keys="Job.posted_by", back_populates="poster")
    applications = relationship("JobApplication", foreign_keys="JobApplication.student_id", back_populates="student")
    saved_jobs = relationship("Job", secondary="saved_jobs", back_populates="saved_by")
    profile = relationship("StudentProfile", back_populates="user", uselist=False)

class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    bio = Column(String, nullable=True)
    education = Column(String, nullable=True)
    skills = Column(String, nullable=True)
    default_resume_url = Column(String, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        server_default=text("now()"),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        server_default=text("now()"),
        nullable=False,
    )

    user = relationship("User", back_populates="profile")
