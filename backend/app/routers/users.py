from fastapi import APIRouter

from app.core.models import UserSchema
from app.core.security import CurrentUserDep

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/")
def get_user_detail(user: CurrentUserDep) -> UserSchema:
    return user
