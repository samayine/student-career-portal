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


class UserRead(UserBase):
    id: uuid.UUID
    role: UserRole
    is_active: bool
    created_at: datetime
    
    # Allows Pydantic to read data from SQLAlchemy model objects
    model_config = ConfigDict(from_attributes=True)
