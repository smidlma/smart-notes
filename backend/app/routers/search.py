import asyncio
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
async def search_notes(
    query: str, user: CurrentUserDep, session: SessionDep
) -> GlobalSearchResponse:
    async def search_collection(collection_name):
        """Helper function to asynchronously fetch search results from a collection"""
        vector_store = get_chroma_collection(collection_name=collection_name)
        return vector_store.similarity_search_with_relevance_scores(
            query=query, filter={"user_id": str(user.id)}
        )

    # Run all three searches in parallel
    results_notes, results_voice, results_documents = await asyncio.gather(
        search_collection(NOTES_COLLECTION_NAME),
        search_collection(VOICE_COLLECTION_NAME),
        search_collection(DOCUMENT_COLLECTION_NAME),
    )

    # Process results and map them to response format
    search_results = [
        *map(lambda doc: doc_to_note_resp(doc, session), results_notes),
        *map(lambda doc: doc_to_voice_resp(doc, session), results_voice),
        *map(lambda doc: doc_to_document_resp(doc, session), results_documents),
    ]

    # Remove None results (if any failed mapping)
    search_results = list(filter(lambda x: x is not None, search_results))

    # Apply dynamic threshold filtering
    if search_results:
        avg_score = sum(x.score for x in search_results) / len(search_results)
        search_results = [x for x in search_results if x.score >= avg_score]

    # Sort results by score (highest first)
    search_results = sorted(search_results, key=lambda x: x.score, reverse=True)

    # Logging for debugging purposes
    logging.info(f"Dynamic threshold: {avg_score if search_results else 'No results'}")
    logging.info(
        f"Search results: {[
            {'title': x.title, 'score': x.score, 'type': x.type} for x in search_results
        ]}"
    )

    # Return response
    return GlobalSearchResponse(results=search_results, total=len(search_results))


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
