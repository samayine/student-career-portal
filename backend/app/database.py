from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.config import settings


engine = create_async_engine(
    settings.DATABASE_URL,
    echo=True,  # Set to False in production
    pool_pre_ping=True,
)


async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models."""
    pass


async def get_db() -> AsyncSession:
    """Provide a database session dependency."""
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()
