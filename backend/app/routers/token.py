from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from google.auth.transport import requests
from google.oauth2 import id_token

from app.config import settings
from app.core.models import Token, TokenRequest, UserSchema
from app.repositories.users import create_user, find_user_by_email
from app.utils import ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token

router = APIRouter(prefix="/token", tags=["token"])


@router.post("/")
def login_or_register(
    data: Annotated[TokenRequest, Depends()],
) -> Token | None:
    try:
        # 1. Check the token against the google API
        id_info = id_token.verify_oauth2_token(
            data.id_token, requests.Request(), settings.CLIENT_ID
        )

        email = id_info["email"]

        # # 2. If the token is valid, check if the user exists in the database
        user = find_user_by_email(email=email)
        if not user:
            #     # 3. If the user does not exist, create the user and return a token
            given_name = id_info["given_name"]
            family_name = id_info["family_name"]
            schema = UserSchema(
                email=email, given_name=given_name, family_name=family_name
            )
            user = create_user(user=schema)

        # # 4. return a token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": email}, expires_delta=access_token_expires
        )
        return Token(access_token=access_token, token_type="bearer")

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid token: {e}"
        )
