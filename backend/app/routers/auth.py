from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.token import Token
from app.schemas.user import UserCreate, UserRead
from app.utils.exceptions import BadRequestException, UnauthorizedException
from app.utils.security import (
    create_access_token,
    create_refresh_token,
    hash_password,
    verify_password,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    """
    Register a new user.
    """
    # Check if user already exists
    result = await db.execute(select(User).where(User.email == user_in.email))
    if result.scalar_one_or_none():
        raise BadRequestException(detail="Email already registered")
        
    # Create new user
    db_user = User(
        email=user_in.email,
        hashed_password=hash_password(user_in.password),
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        role=user_in.role,
    )
    
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    
    return db_user


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    """
    OAuth2 compatible token login, getting an access token for future requests.
    """
    # Find user by email
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise UnauthorizedException(detail="Incorrect email or password")
        
    if not user.is_active:
        raise BadRequestException(detail="Inactive user")
        
    # Create tokens
    # Note: 'sub' (subject) in JWT is conventionally the user identifier (UUID as string)
    token_data = {"sub": str(user.id), "role": user.role}
    
    access_token = create_access_token(data=token_data)
    refresh_token = create_refresh_token(data=token_data)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


@router.get("/me", response_model=UserRead)
async def get_me(current_user: User = Depends(get_current_user)):
    """
    Get current logged in user.
    """
    return current_user
