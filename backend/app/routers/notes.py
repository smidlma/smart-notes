import os
import uuid
from typing import List

from fastapi import APIRouter, BackgroundTasks, HTTPException
from sqlmodel import col, desc, select

from app.ai import create_note_embedding, create_note_summary, generate_quick_recap
from app.config import DOCUMENT_STORAGE_PATH, IMAGE_STORAGE_PATH, VOICE_STORAGE_PATH
from app.core.db import SessionDep
from app.core.models import NoteCreate, NoteSchema, NoteUpdate, SummarySchema
from app.core.security import CurrentUserDep
from app.utils import get_logger, parse_description, parse_title

# Get a module-specific logger
logger = get_logger(__name__)

router = APIRouter(prefix="/notes", tags=["notes"])


@router.get("/")
def read_notes(user: CurrentUserDep, session: SessionDep) -> List[NoteSchema]:
    logger.info(f"Fetching notes for user: {user.id}")
    statement = (
        select(NoteSchema)
        .where(NoteSchema.user_id == user.id)
        .order_by(desc(col(NoteSchema.created_at)))
    )
    notes = session.exec(statement).all()
    logger.debug(f"Found {len(notes)} notes for user: {user.id}")
    return list(notes)


@router.get("/{note_id}")
def read_note(note_id: str, session: SessionDep) -> NoteSchema:
    db_note = session.get(NoteSchema, note_id)
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")
    return db_note


@router.post("/")
def create_note(
    note: NoteCreate, user: CurrentUserDep, session: SessionDep
) -> NoteSchema:
    db_note = NoteSchema(title=note.title, content="", description="")
    user.notes.append(db_note)
    session.add(user)
    session.commit()
    session.refresh(user)
    session.refresh(db_note)

    return db_note


@router.patch("/{note_id}")
def update_note(
    note_id: str,
    note: NoteUpdate,
    session: SessionDep,
    background_tasks: BackgroundTasks,
) -> NoteSchema:
    db_note = session.get(NoteSchema, note_id)
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")

    if note.content and note.content != db_note.content:
        note.title = parse_title(note.content)
        note.description = parse_description(note.content)

        note_data = note.model_dump(exclude_unset=True)

        db_note.sqlmodel_update(note_data)

        session.add(db_note)
        session.commit()
        session.refresh(db_note)

        background_tasks.add_task(
            create_note_embedding, db_note.id, db_note.user_id, db_note.content
        )

    return db_note


@router.delete("/{note_id}")
def delete_note(note_id: str, session: SessionDep) -> dict[str, str]:
    db_note = session.get(NoteSchema, note_id)
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")

    recordings = [
        f"{VOICE_STORAGE_PATH}/{voice_file.file_name}"
        for voice_file in db_note.voice_recordings
    ]

    documents = [
        f"{DOCUMENT_STORAGE_PATH}/{document.file_name}"
        for document in db_note.documents
    ]

    images = [f"{IMAGE_STORAGE_PATH}/{image.file_name}" for image in db_note.images]

    file_paths = [*recordings, *documents, *images]

    session.delete(db_note)
    session.commit()

    for file_path in file_paths:
        try:
            os.remove(file_path)
        except FileNotFoundError:
            pass

    return {"message": "Note deleted"}


@router.get("/summary/{note_id}")
def get_summary(note_id: uuid.UUID, session: SessionDep) -> SummarySchema:
    db_note = session.get(NoteSchema, note_id)
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")

    last_summary = session.exec(
        select(SummarySchema)
        .where(SummarySchema.note_id == note_id)
        .order_by(desc(SummarySchema.created_at))
    ).first()

    if last_summary:
        return last_summary

    return create_note_summary(db_note, session)


@router.post("/summary/{note_id}")
def generate_new_summary(note_id: uuid.UUID, session: SessionDep) -> SummarySchema:
    db_note = session.get(NoteSchema, note_id)
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")

    return create_note_summary(db_note, session)


@router.post("/quick-recap")
async def stream_quick_recap(notes_ids: list[uuid.UUID], session: SessionDep) -> str:
    db_notes = session.exec(
        select(NoteSchema).where(col(NoteSchema.id).in_(notes_ids))
    ).all()

    notes_content = [note.content for note in db_notes]

    return generate_quick_recap(notes_content)
