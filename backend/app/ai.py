import itertools
import logging
import uuid

import PyPDF2
from assemblyai import SpeechModel, TranscriptionConfig
from langchain_community.document_loaders import AssemblyAIAudioTranscriptLoader
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import GoogleGenerativeAI
from langchain_text_splitters import (
    HTMLHeaderTextSplitter,
    RecursiveCharacterTextSplitter,
)
from sqlmodel import select

from app.core.db import (
    DOCUMENT_COLLECTION_NAME,
    NOTES_COLLECTION_NAME,
    VOICE_COLLECTION_NAME,
    SessionDep,
    get_chroma_collection,
)
from app.core.models import (
    DocumentSchema,
    NoteSchema,
    SummarySchema,
    VoiceRecordingSchema,
    WordSchema,
)
from app.utils import debounced


def generate_quick_recap(note_context: list[str]) -> str:
    """Stream a structured markdown recap from a list of notes."""

    prompt_template = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "Write a quick structured markdown recap of the following notes in the same language. Highlight important parts or dates you will find. Do not leave your comments:\n\n{note_context}",
            )
        ]
    )

    prompt = prompt_template.invoke({"note_context": "\n\n".join(note_context)})

    model = GoogleGenerativeAI(model="gemini-exp-1206")

    result = model.invoke(prompt)

    return result


def generate_note_summary(note_context: str, audio_context: str) -> str:
    messages = [
        (
            "system",
            "Write a concise and structured summary in same language of the following notes and following audio transcription, if no transcription is given ignore that part. Also do not leave your comments:\\n\\n{note_context}\\n\\n{audio_context}",
        ),
    ]

    prompt_template = ChatPromptTemplate(messages)
    prompt = prompt_template.invoke(
        {"note_context": note_context, "audio_context": audio_context}
    )

    model = GoogleGenerativeAI(
        model="gemini-exp-1206",
    )
    result = model.invoke(prompt)

    return result


def create_note_summary(note: NoteSchema, session: SessionDep) -> SummarySchema:
    recordings = session.exec(
        select(VoiceRecordingSchema).where(VoiceRecordingSchema.note_id == note.id)
    ).all()

    transcriptions = [
        f"Recording title: {recording.title}\\nTranscription: {recording.transcription}"
        for recording in recordings
    ]
    transcription_context = "\\n\\n".join(transcriptions)

    summary = generate_note_summary(note.content, transcription_context)

    db_summary = SummarySchema(note_id=note.id, summary_text=summary)

    session.add(db_summary)
    session.commit()
    session.refresh(db_summary)

    return db_summary


def generate_document_summary(document: DocumentSchema) -> str:
    messages = [
        (
            "system",
            "Write a concise and structured summary in same language of the following document:\\n\\n{document}",
        ),
    ]

    prompt_template = ChatPromptTemplate(messages)
    prompt = prompt_template.invoke({"document": document})

    model = GoogleGenerativeAI(
        model="gemini-exp-1206",
    )
    result = model.invoke(prompt)

    return result


def process_audio_file(
    file_path: str,
    session: SessionDep,
    voice_id: uuid.UUID,
    user_id: uuid.UUID,
) -> None:
    db_voice = session.get(VoiceRecordingSchema, voice_id)

    if not db_voice:
        raise ValueError("Voice recording not found")

    db_voice.sqlmodel_update({"status": "processing"})
    session.add(db_voice)
    session.commit()
    session.refresh(db_voice)

    try:
        config = TranscriptionConfig(
            speech_model=SpeechModel.nano,
            language_detection=True,
        )
        loader = AssemblyAIAudioTranscriptLoader(
            file_path=file_path,
            config=config,
        )
        docs = loader.load()

        logging.info(f"Transcription: {docs}")

        # Not optimal for large files cuz its in memory
        transcriptions = []
        words = []

        for doc in docs:
            transcription = doc.page_content
            words_map = map(
                lambda x: WordSchema(
                    word=x["text"], start=x["start"], end=x["end"]
                ).model_dump(),
                doc.metadata["words"],
            )
            transcriptions.append(transcription)
            words.append(list(words_map))

        transcription = " ".join(transcriptions)
        merged_words = list(itertools.chain.from_iterable(words))

        title = " ".join(list(map(lambda x: x["word"], merged_words[:4])))

        db_voice.sqlmodel_update(
            {
                "transcription": transcription,
                "words": merged_words,
                "status": "done",
                "title": title,
            }
        )

        session.add(db_voice)
        session.commit()
        session.refresh(db_voice)

        create_voice_embedding(merged_words, voice_id, user_id)

    except Exception as e:
        logging.error(f"Failed to create transcript {e}")
        db_voice.sqlmodel_update({"status": "failed"})
        session.add(db_voice)
        session.commit()
        session.refresh(db_voice)


def transcript_to_chunks(words: list[dict], time_window: int = 5000):
    chunk_number = 1
    current_chunk = []
    chunks = []
    for idx, word in enumerate(words):
        if word["start"] <= time_window * chunk_number:
            current_chunk.append(word["word"])
        else:
            if idx != len(words) - 1:
                # Interlace with previous word
                current_chunk.append(words[idx - 1]["word"])
                chunks.append(
                    {
                        "content": " ".join(current_chunk),
                        "start": time_window * (chunk_number - 1),
                        "end": time_window * chunk_number,
                    }
                )
                chunk_number += 1
            current_chunk = [word["word"]]

        if idx == len(words) - 1:
            chunks.append(
                {
                    "content": " ".join(current_chunk),
                    "start": time_window * (chunk_number - 1),
                    "end": time_window * chunk_number,
                }
            )

    return chunks


def create_voice_embedding(words: list[dict], voice_id: uuid.UUID, user_id: uuid.UUID):
    chunks = transcript_to_chunks(words, 5000)
    if len(chunks) == 0:
        return

    documents = list(
        map(
            lambda chunk: Document(
                page_content=chunk["content"],
                metadata={
                    "user_id": str(user_id),
                    "voice_id": str(voice_id),
                    "start": chunk["start"],
                    "end": chunk["end"],
                },
            ),
            chunks,
        )
    )

    uuids = [str(uuid.uuid4()) for _ in range(len(documents))]

    vector_store = get_chroma_collection(collection_name=VOICE_COLLECTION_NAME)
    vector_store.add_documents(documents=documents, ids=uuids)


@debounced(delay=5.0, key_args=["id", "user_id"])
async def create_note_embedding(id: uuid.UUID, user_id: uuid.UUID, content: str):
    print("Creating note embeddings")
    headers_to_split_on = [
        ("h1", "H1"),
        ("h2", "H2"),
        ("h3", "H3"),
    ]
    html_splitter = HTMLHeaderTextSplitter(headers_to_split_on)
    html_header_splits = html_splitter.split_text(content)

    if len(html_header_splits) > 0:
        documents = list(
            map(
                lambda doc: Document(
                    page_content=doc.page_content,
                    metadata={
                        **doc.metadata,
                        "note_id": str(id),
                        "user_id": str(user_id),
                    },
                ),
                html_header_splits,
            )
        )

        uuids = [str(uuid.uuid4()) for _ in range(len(documents))]

        vector_store = get_chroma_collection(collection_name=NOTES_COLLECTION_NAME)

        vector_store.delete(where={"note_id": str(id)})

        vector_store.add_documents(documents=documents, ids=uuids)


def process_pdf_file(
    file_path: str,
    session: SessionDep,
    document_id: uuid.UUID,
    user_id: uuid.UUID,
) -> None:
    """
    Process a PDF file, extract text content with page numbers, and create embeddings.

    Args:
        file_path: Path to the PDF file
        session: Database session
        document_id: UUID of the document in the database
        user_id: UUID of the user who uploaded the document
    """
    db_document = session.get(DocumentSchema, document_id)

    if not db_document:
        raise ValueError("Document not found")

    try:
        # Open the PDF file
        with open(file_path, "rb") as file:
            pdf_reader = PyPDF2.PdfReader(file)
            num_pages = len(pdf_reader.pages)

            # Extract text from each page
            documents = []
            content = ""

            # Create a text splitter for chunking large pages
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=100,
                length_function=len,
            )

            for page_num in range(num_pages):
                page = pdf_reader.pages[page_num]
                page_text = page.extract_text()

                if not page_text.strip():
                    continue  # Skip empty pages

                content += page_text
                # Split page into chunks if it's too large
                chunks = text_splitter.split_text(page_text)

                for i, chunk in enumerate(chunks):
                    # Create a document with page number in metadata
                    doc = Document(
                        page_content=chunk,
                        metadata={
                            "user_id": str(user_id),
                            "document_id": str(document_id),
                            "page_number": page_num + 1,  # 1-indexed page numbers
                            "chunk_number": i + 1,
                            "total_pages": num_pages,
                            "source": db_document.file_name,
                        },
                    )
                    documents.append(doc)

        if documents:
            # Generate UUIDs for each document chunk
            uuids = [str(uuid.uuid4()) for _ in range(len(documents))]

            # Store embeddings in the vector database
            vector_store = get_chroma_collection(
                collection_name=DOCUMENT_COLLECTION_NAME
            )
            vector_store.add_documents(documents=documents, ids=uuids)

            db_document.sqlmodel_update({"content": content})

            session.add(db_document)
            session.commit()

            logging.info(
                f"Successfully processed PDF with {num_pages} pages and created {len(documents)} embeddings"
            )
        else:
            logging.warning("No text content found in the PDF")
            session.add(db_document)
            session.commit()

    except Exception as e:
        logging.error(f"Failed to process PDF file: {e}")
        db_document.sqlmodel_update({"summary": f"Processing failed: {str(e)}"})
        session.add(db_document)
        session.commit()
