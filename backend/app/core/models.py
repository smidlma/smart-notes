import datetime
import uuid
from typing import List, Literal, Optional

from pydantic import BaseModel
from sqlmodel import JSON, Column, Field, Relationship, SQLModel, String


# REUSABLE
class UUIDModel(SQLModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)


class TimestampModel(SQLModel):
    created_at: datetime.datetime = Field(
        default_factory=lambda: datetime.datetime.now(datetime.timezone.utc)
    )
    updated_at: datetime.datetime = Field(
        default_factory=lambda: datetime.datetime.now(datetime.timezone.utc),
        nullable=False,
        sa_column_kwargs={
            "onupdate": lambda: datetime.datetime.now(datetime.timezone.utc),
        },
    )


# USER
class UserSchema(UUIDModel, TimestampModel, table=True):
    __tablename__ = "users"  # type: ignore
    email: str = Field(unique=True)
    given_name: str
    family_name: str

    notes: list["NoteSchema"] = Relationship(back_populates="user")


# NOTE
class NoteSchema(UUIDModel, TimestampModel, table=True):
    __tablename__ = "notes"  # type: ignore
    user_id: uuid.UUID | None = Field(default=None, foreign_key="users.id")
    title: str
    content: str
    description: str | None

    user: UserSchema | None = Relationship(back_populates="notes")
    attachments: List["AttachmentSchema"] = Relationship(back_populates="note")
    voice_recordings: List["VoiceRecordingSchema"] = Relationship(back_populates="note")
    summaries: List["SummarySchema"] = Relationship(back_populates="note")


class NoteCreate(SQLModel):
    title: str


class NoteUpdate(SQLModel):
    title: str | None = None
    content: str | None = None
    description: str | None = None


# Attachment
class AttachmentSchema(UUIDModel, TimestampModel, table=True):
    __tablename__ = "attachments"  # type: ignore
    note_id: uuid.UUID = Field(foreign_key="notes.id")
    file_name: str
    type: Literal["image", "document"] = Field(sa_type=String)
    summary: str | None = None

    note: NoteSchema = Relationship(back_populates="attachments")


# Voice
class WordSchema(SQLModel):
    word: str
    start: float
    end: float


class VoiceRecordingSchema(UUIDModel, TimestampModel, table=True):
    __tablename__ = "voicerecordings"  # type: ignore

    note_id: uuid.UUID = Field(foreign_key="notes.id")
    title: str | None = None
    file_name: str
    transcription: Optional[str] = None
    words: Optional[list[WordSchema]] = Field(sa_column=Column(JSON), default=[])
    status: Literal["new", "processing", "done", "failed"] = Field(
        sa_type=String, default="new"
    )

    note: NoteSchema = Relationship(back_populates="voice_recordings")


class VoiceRecordingUpdate(SQLModel):
    title: str


class VoiceTranscriptionResponse(SQLModel):
    transcription: str | None = None
    words: list[WordSchema] | None = None
    status: Literal["new", "processing", "done", "failed"]


# SUMMARY
class SummarySchema(UUIDModel, TimestampModel, table=True):
    __tablename__ = "summaries"  # type: ignore
    note_id: uuid.UUID = Field(foreign_key="notes.id")
    summary_text: str | None = None

    note: NoteSchema = Relationship(back_populates="summaries")


# AUTH
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str
    user_uuid: uuid.UUID | None = None


class TokenRequest(BaseModel):
    id_token: str
