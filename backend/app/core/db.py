import os
from typing import Annotated

import chromadb
from fastapi import Depends
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from sqlmodel import Session, SQLModel, create_engine

from app.config import ENVIRONMENT, POSTGRES_CONNECTION_STRING, ROOT_DIR

SQLALCHEMY_DATABASE_URL = (
    "postgresql://smidlma:smidlma@localhost:5432/smartnotes"
    if POSTGRES_CONNECTION_STRING is None
    else POSTGRES_CONNECTION_STRING
)
NOTES_COLLECTION_NAME = "note_embeddings"
VOICE_COLLECTION_NAME = "voice_embeddings"
DOCUMENT_COLLECTION_NAME = "document_embeddings"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

client = chromadb.PersistentClient(path=f"{ROOT_DIR}/chroma")


def get_chroma_collection(collection_name: str) -> Chroma:
    embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")

    vector_store_from_client = Chroma(
        client=client,
        collection_name=collection_name,
        embedding_function=embeddings,
        create_collection_if_not_exists=True,
        collection_metadata={"hnsw:space": "cosine"},
    )

    return vector_store_from_client


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
