import logging
from functools import reduce
from typing import Tuple

from fastapi import APIRouter
from langchain_core.documents import Document

from app.core.db import (
    DOCUMENT_COLLECTION_NAME,
    NOTES_COLLECTION_NAME,
    VOICE_COLLECTION_NAME,
    SessionDep,
    get_chroma_collection,
)
from app.core.models import (
    DocumentSchema,
    DocumentSearchResponse,
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
    results_notes = vector_store.similarity_search_with_relevance_scores(
        query=query,
        k=4,
        filter={"user_id": str(user.id)},
    )

    vector_store = get_chroma_collection(collection_name=VOICE_COLLECTION_NAME)
    results_voice = vector_store.similarity_search_with_relevance_scores(
        query=query,
        filter={"user_id": str(user.id)},
    )

    vector_store = get_chroma_collection(collection_name=DOCUMENT_COLLECTION_NAME)
    results_documents = vector_store.similarity_search_with_relevance_scores(
        query=query,
        filter={"user_id": str(user.id)},
    )

    search_results = [
        *map(lambda doc: doc_to_note_resp(doc, session), results_notes),
        *map(lambda doc: doc_to_voice_resp(doc, session), results_voice),
        *map(lambda doc: doc_to_document_resp(doc, session), results_documents),
    ]

    search_results = list(filter(lambda x: x is not None, search_results))
    dynamic_threshold = reduce(
        lambda x, y: x + y, map(lambda x: x.score, search_results)
    ) / len(search_results)
    search_results = list(
        filter(lambda x: x.score >= dynamic_threshold, search_results)
    )
    search_results = sorted(search_results, key=lambda x: x.score, reverse=True)
    logging.info(f"Dynamic threshold: {dynamic_threshold}")
    logging.info(
        f"Search results: {list(map(lambda x: {'title': x.title, 'score': x.score, 'type': x.type}, search_results))}"
    )

    return GlobalSearchResponse(results=list(search_results), total=len(search_results))


def doc_to_note_resp(doc_with_score: Tuple[Document, float], session: SessionDep):
    doc, score = doc_with_score
    metadata = doc.metadata
    db_note = session.get(NoteSchema, metadata["note_id"])

    if db_note is None or doc.id is None:
        return None

    return NoteSearchResponse(
        id=doc.id,
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

    if db_voice is None or doc.id is None:
        return None

    return VoiceSearchResponse(
        id=doc.id,
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


def doc_to_document_resp(doc_with_score: Tuple[Document, float], session: SessionDep):
    doc, score = doc_with_score
    metadata = doc.metadata
    db_document = session.get(DocumentSchema, metadata["document_id"])

    if db_document is None or doc.id is None:
        return None

    return DocumentSearchResponse(
        id=doc.id,
        type="document",
        document_id=db_document.id,
        score=score,
        file_name=db_document.file_name,
        page_number=metadata["page_number"],
        title=db_document.file_name,
        search_match_text=doc.page_content[:50],
        created_at=db_document.created_at,
        updated_at=db_document.updated_at,
    )
