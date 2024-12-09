from datetime import datetime, timedelta, timezone
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import APIKeyHeader

from app.config import SECRET_KEY
from app.core.db import SessionDep
from app.core.models import TokenData, UserSchema
from app.repositories.users import find_user_by_email

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24
global_security = APIKeyHeader(
    name="Authorization", description="JWT token", scheme_name="Bearer"
)


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY if SECRET_KEY is not None else "",
        algorithm=ALGORITHM,
    )
    return encoded_jwt


async def get_current_user(
    token: Annotated[str, Depends(global_security)],
    session: SessionDep,
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = token.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except jwt.InvalidTokenError:
        raise credentials_exception
    user = find_user_by_email(token_data.email, session)
    if user is None:
        raise credentials_exception
    return user


CurrentUserDep = Annotated[UserSchema, Depends(get_current_user)]
