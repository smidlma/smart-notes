from typing import Annotated, Union

from fastapi import APIRouter, Depends, FastAPI
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session

from app.core.db import create_db_and_tables, get_session

from app.core.models import UserSchema, NoteSchema
from app.routers import notes, user


app = FastAPI()

SessionDep = Annotated[Session, Depends(get_session)]

router = APIRouter(prefix="/api")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


router.include_router(user.router)
router.include_router(notes.router)
app.include_router(router)
