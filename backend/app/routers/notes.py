import re
import uuid

from fastapi import APIRouter, HTTPException
from sqlmodel import desc, select

from app.ai import generate_summary
from app.core.db import SessionDep
from app.core.models import NoteCreate, NoteSchema, NoteUpdate, SummarySchema
from app.core.security import CurrentUserDep

router = APIRouter(prefix="/notes", tags=["notes"])


@router.get("/")
def read_notes(user: CurrentUserDep, session: SessionDep) -> list[NoteSchema]:
    statement = (
        select(NoteSchema)
        .where(NoteSchema.user_id == user.id)
        .order_by(desc(NoteSchema.updated_at))
    )
    results = session.exec(statement).all()

    return list(results)


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
def update_note(note_id: str, note: NoteUpdate, session: SessionDep) -> NoteSchema:
    db_note = session.get(NoteSchema, note_id)
    if not db_note:
        raise HTTPException(status_code=404, detail="Hero not found")

    if note.content:
        note.title = parse_title(note.content)
        note.description = parse_description(note.content)

    note_data = note.model_dump(exclude_unset=True)

    db_note.sqlmodel_update(note_data)

    session.add(db_note)
    session.commit()
    session.refresh(db_note)

    return db_note


@router.delete("/{note_id}")
def delete_note(note_id: str, session: SessionDep) -> dict[str, str]:
    db_note = session.get(NoteSchema, note_id)
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")

    session.delete(db_note)
    session.commit()

    return {"message": "Note deleted"}


@router.post("/summary/{note_id}")
def create_summary(note_id: uuid.UUID, session: SessionDep) -> SummarySchema:
    db_note = session.get(NoteSchema, note_id)
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")

    summary = generate_summary(db_note.content)

    db_summary = SummarySchema(note_id=note_id, summary_text=summary)

    session.add(db_summary)
    session.commit()
    session.refresh(db_summary)

    return db_summary


@router.get("/summary/{note_id}")
def get_summaries(note_id: uuid.UUID, session: SessionDep) -> list[SummarySchema]:
    statement = select(SummarySchema).where(SummarySchema.note_id == note_id)
    results = session.exec(statement).all()

    return list(results)


def parse_title(text: str) -> str:
    pattern = r"<h1>(.*?)</h1>"
    match = re.search(pattern, text)

    title = match.group(1) if match else ""

    return title or "New note"


def parse_description(text: str) -> str:
    # Find end of h1 tag
    h1_pattern = r"</h1>"
    h1_match = re.search(h1_pattern, text)
    if not h1_match:
        return ""

    # Get all text after h1
    end_pos = h1_match.end()
    remaining_text = text[end_pos:]

    # Remove all HTML tags
    clean_text = re.sub(r"<[^>]+>", " ", remaining_text)

    # Normalize spaces - replace multiple spaces with single space
    normalized_text = re.sub(r"\s+", " ", clean_text)

    # Clean up whitespace and truncate
    return normalized_text.strip()[:30]
