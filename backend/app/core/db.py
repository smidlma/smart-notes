from sqlmodel import create_engine, SQLModel, Session


SQLALCHEMY_DATABASE_URL = "postgresql://postgres:smidlma@localhost:5432/smartnotes"


engine = create_engine(SQLALCHEMY_DATABASE_URL)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)