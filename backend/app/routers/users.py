from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User, StudentProfile, UserRole
from app.schemas.user import UserReadWithProfile, StudentProfileUpdate, StudentProfileRead, UserUpdate, UserRead
from app.utils.exceptions import ForbiddenException, NotFoundException

router = APIRouter(prefix="/users", tags=["Users"])

@router.patch("/me/account", response_model=UserRead)
async def update_my_account(
    account_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update basic account details (first name, last name).
    """
    update_data = account_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(current_user, key, value)
        
    await db.commit()
    await db.refresh(current_user)
    return current_user

@router.get("/me/profile", response_model=UserReadWithProfile)
async def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get the current user's profile.
    """
    result = await db.execute(
        select(User)
        .options(selectinload(User.profile))
        .where(User.id == current_user.id)
    )
    user = result.scalar_one()
    return user

@router.patch("/me/profile", response_model=StudentProfileRead)
async def update_my_profile(
    profile_update: StudentProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update student profile.
    """
    if current_user.role != UserRole.STUDENT:
        raise ForbiddenException(detail="Only students have profiles")
        
    result = await db.execute(select(StudentProfile).where(StudentProfile.user_id == current_user.id))
    profile = result.scalar_one_or_none()
    
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)
        
    update_data = profile_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(profile, key, value)
        
    await db.commit()
    await db.refresh(profile)
    return profile
