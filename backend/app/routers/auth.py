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


# ── OAuth Authentication (Google & GitHub) ─────────────────────────────────

from fastapi.responses import RedirectResponse
import secrets
import urllib.parse
import httpx
from app.config import settings
from app.models.user import UserRole


@router.get("/oauth/{provider}/authorize")
async def oauth_authorize(provider: str, role: str = "student"):
    """
    Initiate OAuth authorization for 'google' or 'github'.
    If provider credentials are configured, redirects to the provider consent page.
    Otherwise, redirects seamlessly via local dev simulation mode.
    """
    callback_url = f"{settings.BACKEND_URL}/api/auth/oauth/{provider}/callback"
    state = urllib.parse.quote(role)

    if provider == "google":
        if settings.GOOGLE_CLIENT_ID and settings.GOOGLE_CLIENT_SECRET:
            params = {
                "client_id": settings.GOOGLE_CLIENT_ID,
                "redirect_uri": callback_url,
                "response_type": "code",
                "scope": "openid email profile",
                "access_type": "offline",
                "prompt": "consent",
                "state": state,
            }
            url = f"https://accounts.google.com/o/oauth2/v2/auth?{urllib.parse.urlencode(params)}"
            return RedirectResponse(url)
        else:
            # Dev-mode fallback
            return RedirectResponse(f"{callback_url}?code=dev_mock_google&state={state}")

    elif provider == "github":
        if settings.GITHUB_CLIENT_ID and settings.GITHUB_CLIENT_SECRET:
            params = {
                "client_id": settings.GITHUB_CLIENT_ID,
                "redirect_uri": callback_url,
                "scope": "user:email read:user",
                "state": state,
            }
            url = f"https://github.com/login/oauth/authorize?{urllib.parse.urlencode(params)}"
            return RedirectResponse(url)
        else:
            # Dev-mode fallback
            return RedirectResponse(f"{callback_url}?code=dev_mock_github&state={state}")

    return RedirectResponse(f"{settings.FRONTEND_URL}/login?error=unsupported_oauth_provider")


@router.get("/oauth/{provider}/callback")
async def oauth_callback(
    provider: str,
    code: str | None = None,
    state: str = "student",
    db: AsyncSession = Depends(get_db),
):
    """
    Handle OAuth callback from provider or dev mock.
    Creates or looks up the user, generates JWT tokens, and redirects back to frontend.
    """
    if not code:
        return RedirectResponse(f"{settings.FRONTEND_URL}/login?error=missing_code")

    email: str | None = None
    first_name: str = "Student"
    last_name: str = "User"

    # 1. Dev Mode handling
    if code.startswith("dev_mock_"):
        if provider == "google":
            email = "demo.google.user@gradpath.edu"
            first_name = "Alex"
            last_name = "Google"
        else:
            email = "demo.github.user@gradpath.edu"
            first_name = "Jordan"
            last_name = "GitHub"

    # 2. Real Google OAuth exchange
    elif provider == "google":
        try:
            callback_url = f"{settings.BACKEND_URL}/api/auth/oauth/google/callback"
            async with httpx.AsyncClient() as client:
                token_resp = await client.post(
                    "https://oauth2.googleapis.com/token",
                    data={
                        "code": code,
                        "client_id": settings.GOOGLE_CLIENT_ID,
                        "client_secret": settings.GOOGLE_CLIENT_SECRET,
                        "redirect_uri": callback_url,
                        "grant_type": "authorization_code",
                    },
                )
                if token_resp.status_code != 200:
                    return RedirectResponse(f"{settings.FRONTEND_URL}/login?error=google_token_exchange_failed")
                tokens = token_resp.json()
                access_token_google = tokens.get("access_token")

                userinfo_resp = await client.get(
                    "https://openidconnect.googleapis.com/v1/userinfo",
                    headers={"Authorization": f"Bearer {access_token_google}"},
                )
                if userinfo_resp.status_code != 200:
                    return RedirectResponse(f"{settings.FRONTEND_URL}/login?error=google_userinfo_failed")
                info = userinfo_resp.json()
                email = info.get("email")
                first_name = info.get("given_name", "Google")
                last_name = info.get("family_name", "User")
        except Exception:
            return RedirectResponse(f"{settings.FRONTEND_URL}/login?error=oauth_network_error")

    # 3. Real GitHub OAuth exchange
    elif provider == "github":
        try:
            async with httpx.AsyncClient() as client:
                token_resp = await client.post(
                    "https://github.com/login/oauth/access_token",
                    headers={"Accept": "application/json"},
                    data={
                        "client_id": settings.GITHUB_CLIENT_ID,
                        "client_secret": settings.GITHUB_CLIENT_SECRET,
                        "code": code,
                    },
                )
                if token_resp.status_code != 200:
                    return RedirectResponse(f"{settings.FRONTEND_URL}/login?error=github_token_exchange_failed")
                tokens = token_resp.json()
                access_token_github = tokens.get("access_token")

                # Get user profile
                user_resp = await client.get(
                    "https://api.github.com/user",
                    headers={
                        "Authorization": f"Bearer {access_token_github}",
                        "Accept": "application/json",
                    },
                )
                if user_resp.status_code != 200:
                    return RedirectResponse(f"{settings.FRONTEND_URL}/login?error=github_userinfo_failed")
                gh_user = user_resp.json()

                # Get primary verified email if not public in profile
                email = gh_user.get("email")
                if not email:
                    emails_resp = await client.get(
                        "https://api.github.com/user/emails",
                        headers={
                            "Authorization": f"Bearer {access_token_github}",
                            "Accept": "application/json",
                        },
                    )
                    if emails_resp.status_code == 200:
                        emails = emails_resp.json()
                        primary_email = next((e["email"] for e in emails if e.get("primary")), None)
                        email = primary_email or (emails[0]["email"] if emails else None)

                full_name = gh_user.get("name") or gh_user.get("login", "GitHub User")
                parts = full_name.split(" ", 1)
                first_name = parts[0]
                last_name = parts[1] if len(parts) > 1 else "User"
        except Exception:
            return RedirectResponse(f"{settings.FRONTEND_URL}/login?error=oauth_network_error")

    if not email:
        return RedirectResponse(f"{settings.FRONTEND_URL}/login?error=no_email_provided")

    # Look up or create user
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if not user:
        target_role = UserRole.STUDENT
        if state == "employer":
            target_role = UserRole.EMPLOYER
        elif state == "admin":
            target_role = UserRole.ADMIN

        user = User(
            email=email,
            hashed_password=hash_password(secrets.token_urlsafe(32)),
            first_name=first_name,
            last_name=last_name,
            role=target_role,
            is_active=True,
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    # Issue JWT tokens
    token_data = {"sub": str(user.id), "role": user.role}
    access_token = create_access_token(data=token_data)
    refresh_token = create_refresh_token(data=token_data)

    redirect_target = (
        f"{settings.FRONTEND_URL}/auth/callback"
        f"?token={access_token}&refresh_token={refresh_token}&provider={provider}"
    )
    return RedirectResponse(redirect_target)

