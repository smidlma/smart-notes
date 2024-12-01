import uuid
from datetime import datetime

from pydantic import BaseModel
from sqlmodel import Field, SQLModel


class UUIDModel(SQLModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)


class TimestampModel(SQLModel):
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


class UserSchema(UUIDModel, TimestampModel, table=True):
    __tablename__ = "users"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: str = Field(unique=True)
    given_name: str
    family_name: str


class NoteSchema(UUIDModel, TimestampModel, table=True):
    __tablename__ = "notes"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str
    rich_text: str | None
    edited_at: datetime | None = None


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str | None = None
    user_uuid: uuid.UUID | None = None


class TokenRequest(BaseModel):
    id_token: str
