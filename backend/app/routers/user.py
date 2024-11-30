from fastapi import APIRouter


router = APIRouter(prefix="/users", tags=["users"])


@router.get("/")
def read_users():
    return {"User": "User"}
