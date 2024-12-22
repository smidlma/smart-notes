import datetime
import uuid

from pydantic import BaseModel
from sqlmodel import Field, Relationship, SQLModel


class UUIDModel(SQLModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)


class TimestampModel(SQLModel):
    created_at: datetime.datetime = Field(
        default_factory=lambda: datetime.datetime.now(datetime.timezone.utc)
    )
    updated_at: datetime.datetime = Field(
        default_factory=lambda: datetime.datetime.now(datetime.timezone.utc)
    )


class UserSchema(UUIDModel, TimestampModel, table=True):
    __tablename__ = "users"  # type: ignore

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: str = Field(unique=True)
    given_name: str
    family_name: str

    notes: list["NoteSchema"] = Relationship(back_populates="user")


class NoteBase(UUIDModel, TimestampModel):
    title: str
    rich_text: str
    edited_at: datetime.datetime = Field(
        default_factory=lambda: datetime.datetime.now(datetime.timezone.utc)
    )


class NoteSchema(NoteBase, table=True):
    __tablename__ = "notes"  # type: ignore
    user_id: uuid.UUID | None = Field(default=None, foreign_key="users.id")
    user: UserSchema | None = Relationship(back_populates="notes")


class NoteCreate(SQLModel):
    title: str


class NoteUpdate(SQLModel):
    title: str | None = None
    rich_text: str | None = None


class NoteSummary(BaseModel):
    note_id: uuid.UUID
    note_title: str
    summary: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str
    user_uuid: uuid.UUID | None = None


class TokenRequest(BaseModel):
    id_token: str
