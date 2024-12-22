import re

from fastapi import APIRouter, HTTPException
from sqlmodel import desc, select

from app.ai import generate_summary
from app.core.db import SessionDep
from app.core.models import NoteCreate, NoteSchema, NoteSummary, NoteUpdate
from app.core.security import CurrentUserDep

router = APIRouter(prefix="/notes", tags=["notes"])


@router.get("/")
def read_notes(user: CurrentUserDep, session: SessionDep) -> list[NoteSchema]:
    statement = (
        select(NoteSchema)
        .where(NoteSchema.user_id == user.id)
        .order_by(desc(NoteSchema.edited_at))
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
    db_note = NoteSchema(title=note.title, rich_text="", description="")
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

    if note.rich_text:
        note.title = parse_title(note.rich_text)
        note.description = parse_description(note.rich_text)
        print(parse_description(note.rich_text))

    note_data = note.model_dump(exclude_unset=True)
    db_note.sqlmodel_update(note_data)

    session.add(db_note)
    session.commit()
    session.refresh(db_note)

    return db_note


@router.get("/summary/{note_id}")
def get_summary(note_id: str, session: SessionDep) -> NoteSummary:
    db_note = session.get(NoteSchema, note_id)
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")
    if db_note.rich_text is None:
        raise HTTPException(status_code=400, detail="Note content is empty")
    summary = generate_summary(db_note.rich_text)

    return NoteSummary(note_id=db_note.id, note_title=db_note.title, summary=summary)


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

    # Find next tag content after h1
    end_pos = h1_match.end()
    remaining_text = text[end_pos:]
    content_pattern = r"<(\w+)[^>]*>(.*?)</\1>"
    content_match = re.search(content_pattern, remaining_text)

    description = content_match.group(2) if content_match else ""

    return description[:30]
