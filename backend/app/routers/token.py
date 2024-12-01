from datetime import timedelta

from fastapi import APIRouter, HTTPException, status
from google.auth.transport import requests
from google.oauth2 import id_token

from app.core.models import Token, TokenRequest, UserSchema
from app.core.security import ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token
from app.dependencies import SessionDep
from app.repositories.users import create_user, find_user_by_email

router = APIRouter(prefix="/token", tags=["token"])


@router.post("/")
def open_id_login(
    data: TokenRequest,
    session: SessionDep,
) -> Token | None:
    try:
        id_info = id_token.verify_oauth2_token(data.id_token, requests.Request(), None)
        email = id_info["email"]

        user = find_user_by_email(email=email, session=session)
        if not user:
            given_name = id_info["given_name"]
            family_name = id_info["family_name"]
            schema = UserSchema(
                email=email, given_name=given_name, family_name=family_name
            )
            user = create_user(user=schema, session=session)

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": email}, expires_delta=access_token_expires
        )
        return Token(access_token=access_token, token_type="bearer")

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid token: {e}"
        )
