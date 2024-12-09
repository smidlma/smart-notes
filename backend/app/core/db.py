from typing import Annotated

from fastapi import Depends
from sqlmodel import Session, SQLModel, create_engine

SQLALCHEMY_DATABASE_URL = "postgresql://smidlma:smidlma@localhost:5432/smartnotes"


engine = create_engine(SQLALCHEMY_DATABASE_URL)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
