from fastapi import APIRouter

from app.core.security import CurrentUserDep

router = APIRouter(prefix="/notes", tags=["notes"])


@router.get("/")
def read_notes(user: CurrentUserDep):
    return {"User": user}
