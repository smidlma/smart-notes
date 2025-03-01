import logging
import socket

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, FastAPI
from fastapi.staticfiles import StaticFiles

from app.config import setup_logging
from app.core.db import SessionDep, create_db_and_tables, get_chroma_collection
from app.core.security import global_security
from app.routers import attachments, notes, search, token, users

load_dotenv()
logger = setup_logging()

app = FastAPI()


router = APIRouter(prefix="/api")


@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    hostname = socket.gethostname()
    local_ip = socket.gethostbyname(hostname)
    logger.info(f"Server starting on host: {hostname}, IP: {local_ip}")


app.mount("/storage", StaticFiles(directory="storage"), name="storage")

router.include_router(token.router)
router.include_router(users.router)
router.include_router(notes.router, dependencies=[Depends(global_security)])
router.include_router(attachments.router)
router.include_router(search.router)
app.include_router(router)


@app.get("/")
def read_root(session: SessionDep):
    # voice = session.get(
    #     VoiceRecordingSchema, uuid.UUID("57cef2a2-4c18-4c73-bb69-c3b4f4370cde")
    # )

    # voice = session.exec(
    #     select(VoiceRecordingSchema).where(
    #         VoiceRecordingSchema.id == "0b774e0c-9284-4e86-8487-cdff2f3278e5"
    #     )
    # ).first()

    # # return voice.words
    # if voice:
    #     create_voice_embedding(
    #         voice.words or [], uuid.UUID("0b774e0c-9284-4e86-8487-cdff2f3278e5")
    #     )
    # vector_store = get_chroma_collection(collection_name="voice_embeddings")
    # results = vector_store.similarity_search(
    #     query="What space and time are",
    #     k=2,
    #     filter={"voice_id": "0b774e0c-9284-4e86-8487-cdff2f3278e5"},
    # )

    # for res in results:
    #     print(f"* {res.page_content} [{res.metadata}]")

    # note = session.get(NoteSchema, "2a336df2-96b3-425a-b1c6-f9ef9e8e3237")

    # if note:
    #     create_note_embedding(note)

    vector_store = get_chroma_collection(collection_name="note_embeddings")
    results = vector_store.similarity_search(
        query="How cooperate with others",
        k=1,
        filter={"user_id": "23576d71-c8ba-48fd-b2a9-b364e8606a4c"},
    )

    for res in results:
        print(f"* {res.page_content} [{res.metadata}]")
    pass
    pass
