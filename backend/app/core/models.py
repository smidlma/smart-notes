from datetime import datetime
from typing import Optional
import uuid
from sqlmodel import Field, SQLModel


class UUIDModel(SQLModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)


class TimestampModel(SQLModel):
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: Optional[datetime]


class UserSchema(UUIDModel, TimestampModel, table=True):
    __tablename__ = "users"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: str = Field(unique=True)


class NoteSchema(UUIDModel, TimestampModel, table=True):
    __tablename__ = "notes"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str
    rich_text: str | None
    edited_at: datetime | None = None
