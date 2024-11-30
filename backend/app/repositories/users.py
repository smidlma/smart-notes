from sqlmodel import select

from app.core.models import UserSchema
from app.dependencies import SessionDep


def create_user(user: UserSchema, session: SessionDep) -> UserSchema:
    session.add(user)
    session.commit()
    session.refresh(user)

    return user


def find_user_by_email(email: str, session: SessionDep) -> UserSchema | None:
    statement = select(UserSchema).where(UserSchema.email == email)

    return session.exec(statement).first()
