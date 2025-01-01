from dotenv import load_dotenv
from fastapi import APIRouter, Depends, FastAPI
from fastapi.staticfiles import StaticFiles

from app.core.db import create_db_and_tables
from app.core.security import global_security
from app.routers import attachments, notes, token, users

load_dotenv()

app = FastAPI()


router = APIRouter(prefix="/api")


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


app.mount("/storage", StaticFiles(directory="storage"), name="storage")

router.include_router(token.router)
router.include_router(users.router)
router.include_router(notes.router, dependencies=[Depends(global_security)])
router.include_router(
    attachments.router,
)
app.include_router(router)
