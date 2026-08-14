from fastapi import HTTPException, status


class NotFoundException(HTTPException):
    """Raised when a requested resource doesn't exist."""

    def __init__(self, resource: str = "Resource", detail: str = None):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=detail or f"{resource} not found",
        )


class BadRequestException(HTTPException):
    """Raised when the request data is invalid."""

    def __init__(self, detail: str = "Bad request"):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail,
        )


class UnauthorizedException(HTTPException):
    """Raised when authentication fails."""

    def __init__(self, detail: str = "Could not validate credentials"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )


class ForbiddenException(HTTPException):
    """Raised when user lacks permission for an action."""

    def __init__(self, detail: str = "Not enough permissions"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail,
        )


class ConflictException(HTTPException):
    """Raised when there's a resource conflict (e.g., duplicate email)."""

    def __init__(self, detail: str = "Resource already exists"):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=detail,
        )
