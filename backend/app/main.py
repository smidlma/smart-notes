from fastapi import APIRouter, FastAPI

from app.core.db import create_db_and_tables
from app.routers import notes, token, users

app = FastAPI()


router = APIRouter(prefix="/api")


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


router.include_router(token.router)
router.include_router(users.router)
router.include_router(notes.router)
app.include_router(router)
