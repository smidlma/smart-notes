from fastapi import APIRouter


router = APIRouter(prefix="/notes", tags=["notes"])


@router.get("/")
def read_notes():
    return {"User": "User"}
