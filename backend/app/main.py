from fastapi import APIRouter, FastAPI
from fastapi.security import OAuth2PasswordBearer

from app.core.db import create_db_and_tables
from app.dependencies import SessionDep
from app.repositories.users import find_user_by_email
from app.routers import notes, token, user

app = FastAPI()


router = APIRouter(prefix="/api")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


router.include_router(token.router)
router.include_router(user.router)
router.include_router(notes.router)
app.include_router(router)


@app.get("/")
def read_root(session: SessionDep):
    user = find_user_by_email("asdf", session)
    return {"Hello": "World"}
