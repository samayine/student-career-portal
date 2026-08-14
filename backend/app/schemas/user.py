import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.user import UserRole


class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str


class UserCreate(UserBase):
    password: str
    role: UserRole = UserRole.STUDENT


class UserUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None


class UserRead(UserBase):
    id: uuid.UUID
    role: UserRole
    is_active: bool
    created_at: datetime
    
    # Allows Pydantic to read data from SQLAlchemy model objects
    model_config = ConfigDict(from_attributes=True)

class StudentProfileBase(BaseModel):
    bio: str | None = None
    education: str | None = None
    skills: str | None = None
    default_resume_url: str | None = None

class StudentProfileCreate(StudentProfileBase):
    pass

class StudentProfileUpdate(StudentProfileBase):
    pass

class StudentProfileRead(StudentProfileBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class UserReadWithProfile(UserRead):
    profile: StudentProfileRead | None = None
