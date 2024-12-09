from fastapi import APIRouter, HTTPException

from app.core.db import SessionDep
from app.core.models import NoteCreate, NoteSchema, NoteUpdate
from app.core.security import CurrentUserDep

router = APIRouter(prefix="/notes", tags=["notes"])


@router.get("/")
def read_notes(user: CurrentUserDep) -> list[NoteSchema]:
    return user.notes


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
    db_note = NoteSchema(title=note.title, rich_text="")
    user.notes.append(db_note)
    session.add(user)
    session.commit()
    session.refresh(user)
    session.refresh(db_note)

    return db_note


@router.patch("/{note_id}")
def update_note(note_id: str, note: NoteUpdate, session: SessionDep) -> NoteSchema:
    db_note = session.get(NoteSchema, note_id)
    if not db_note:
        raise HTTPException(status_code=404, detail="Hero not found")
    note_data = note.model_dump(exclude_unset=True)
    db_note.sqlmodel_update(note_data)

    session.add(db_note)
    session.commit()
    session.refresh(db_note)

    return db_note
