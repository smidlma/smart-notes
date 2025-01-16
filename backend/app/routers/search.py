from typing import Tuple

from fastapi import APIRouter
from langchain_core.documents import Document

from app.core.db import (
    NOTES_COLLECTION_NAME,
    VOICE_COLLECTION_NAME,
    SessionDep,
    get_chroma_collection,
)
from app.core.models import (
    GlobalSearchResponse,
    NoteSchema,
    NoteSearchResponse,
    VoiceRecordingSchema,
    VoiceSearchResponse,
)
from app.core.security import CurrentUserDep

router = APIRouter(prefix="/search", tags=["search"])


@router.get("/")
def search_notes(
    query: str, user: CurrentUserDep, session: SessionDep
) -> GlobalSearchResponse:
    vector_store = get_chroma_collection(collection_name=NOTES_COLLECTION_NAME)
    results_notes = vector_store.similarity_search_with_score(
        query=query,
        k=4,
        filter={"user_id": str(user.id)},
    )

    vector_store = get_chroma_collection(collection_name=VOICE_COLLECTION_NAME)
    results_voice = vector_store.similarity_search_with_score(
        query=query,
        filter={"user_id": str(user.id)},
    )

    search_results = [
        *map(lambda doc: doc_to_note_resp(doc, session), results_notes),
        *map(lambda doc: doc_to_voice_resp(doc, session), results_voice),
    ]
    search_results = filter(lambda x: x is not None, search_results)
    search_results = sorted(search_results, key=lambda x: x.score)

    return GlobalSearchResponse(results=list(search_results), total=len(search_results))


def doc_to_note_resp(doc_with_score: Tuple[Document, float], session: SessionDep):
    doc, score = doc_with_score
    metadata = doc.metadata
    db_note = session.get(NoteSchema, metadata["note_id"])

    if db_note is None:
        return None

    return NoteSearchResponse(
        type="note",
        note_id=db_note.id,
        score=score,
        title=db_note.title,
        description=db_note.description,
        search_match_text=doc.page_content[:50],
        created_at=db_note.created_at,
        updated_at=db_note.updated_at,
    )


def doc_to_voice_resp(doc_with_score: Tuple[Document, float], session: SessionDep):
    doc, score = doc_with_score
    metadata = doc.metadata
    db_voice = session.get(VoiceRecordingSchema, metadata["voice_id"])

    if db_voice is None:
        return None

    return VoiceSearchResponse(
        type="voice",
        note_id=db_voice.note_id,
        voice_id=db_voice.id,
        score=score,
        time_start=metadata["start"],
        time_end=metadata["end"],
        file_name=db_voice.file_name,
        title=db_voice.title or "Unnamed recording",
        search_match_text=doc.page_content,
        created_at=db_voice.created_at,
        updated_at=db_voice.updated_at,
    )
