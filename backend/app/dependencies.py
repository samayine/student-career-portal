from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db  # noqa: F401


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
):
    """
    Dependency to get the current authenticated user from the JWT token.
    Raises 401 Unauthorized if token is invalid or user doesn't exist.
    """
    from app.utils.exceptions import UnauthorizedException
    from app.utils.security import decode_token
    from app.models.user import User
    from sqlalchemy import select
    
    payload = decode_token(token)
    if not payload:
        raise UnauthorizedException(detail="Could not validate credentials")
        
    user_id: str | None = payload.get("sub")
    if user_id is None:
        raise UnauthorizedException(detail="Could not validate credentials")
        
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if user is None:
        raise UnauthorizedException(detail="User not found")
        
    if not user.is_active:
        raise UnauthorizedException(detail="Inactive user")
        
    return user
