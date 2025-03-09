import os
import socket

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, FastAPI
from fastapi.staticfiles import StaticFiles
from sqlmodel import Session, select

from app.ai import create_note_embedding_sync, create_voice_embedding, process_pdf_file
from app.config import (
    DOCUMENT_STORAGE_PATH,
    IMAGE_STORAGE_PATH,
    ROOT_DIR,
    VOICE_STORAGE_PATH,
    setup_logging,
)
from app.core.db import (
    DOCUMENT_COLLECTION_NAME,
    NOTES_COLLECTION_NAME,
    VOICE_COLLECTION_NAME,
    SessionDep,
    create_db_and_tables,
    engine,
    get_chroma_collection,
)
from app.core.models import NoteSchema, VoiceRecordingSchema
from app.core.security import global_security
from app.routers import attachments, notes, search, token, users

load_dotenv()
logger = setup_logging()

app = FastAPI()


router = APIRouter(prefix="/api")

SHOULD_RECREATE_EMBEDDINGS = False


def reset_and_recreate_embeddings(session: SessionDep):
    vector_store_notes = get_chroma_collection(collection_name=NOTES_COLLECTION_NAME)
    vector_store_notes.delete_collection()

    vector_store_voice = get_chroma_collection(collection_name=VOICE_COLLECTION_NAME)
    vector_store_voice.delete_collection()

    vector_store_documents = get_chroma_collection(
        collection_name=DOCUMENT_COLLECTION_NAME
    )
    vector_store_documents.delete_collection()

    notes = session.exec(select(NoteSchema)).all()

    for note in notes:
        if note.user_id:
            create_note_embedding_sync(note.id, note.user_id, note.content)
            for voice_recording in note.voice_recordings:
                if voice_recording.words:
                    create_voice_embedding(
                        voice_recording.words, voice_recording.id, note.user_id
                    )
            for document in note.documents:
                if document.content:
                    process_pdf_file(
                        f"{DOCUMENT_STORAGE_PATH}/{document.file_name}",
                        session,
                        document.id,
                        note.user_id,
                    )


@app.on_event("startup")
def on_startup():
    # Create storage directories if they don't exist
    logger.info(f"Creating storage directories: {ROOT_DIR}")
    os.makedirs(DOCUMENT_STORAGE_PATH, exist_ok=True)
    os.makedirs(VOICE_STORAGE_PATH, exist_ok=True)
    os.makedirs(IMAGE_STORAGE_PATH, exist_ok=True)
    app.mount("/storage", StaticFiles(directory="storage"), name="storage")

    # Init DB
    create_db_and_tables()

    hostname = socket.gethostname()
    local_ip = socket.gethostbyname(hostname)
    logger.info(f"Server starting on host: {hostname}, IP: {local_ip}")

    if SHOULD_RECREATE_EMBEDDINGS:
        with Session(engine) as session:
            logger.info("Resetting and recreating embeddings")
            reset_and_recreate_embeddings(session)
            logger.info("Embeddings recreated")


router.include_router(token.router)
router.include_router(users.router)
router.include_router(notes.router, dependencies=[Depends(global_security)])
router.include_router(attachments.router)
router.include_router(search.router)
app.include_router(router)


@app.get("/")
def read_root():
    pass
