import itertools
import logging
import uuid
from typing import Any

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

CHAT_MODELS = [
    "gemini-exp-1206",
    "gemini-2.0-pro-exp-02-05",
    "gemini-2.0-flash-lite-001",
]


def ask_ai(
    prompt_string: str, input: dict[str, str], chat_model: str = CHAT_MODELS[2]
) -> str:
    prompt_template = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                prompt_string,
            )
        ]
    )
    prompt = prompt_template.invoke(input)

    model = GoogleGenerativeAI(model=chat_model)

    result = model.invoke(prompt)

    return result


def generate_quick_recap(note_context: list[str]) -> str:

    prompt_string = """
Generate a concise, structured markdown recap, in the same language as the provided notes, that highlights key information.

**Instructions:**

*   **Purpose:**  Provide a brief overview of the core content of the notes.
*   **Format:**  Use markdown headings and bullet points for clear organization.
*   **Emphasis:**  Use bold text to highlight important details and any mentioned dates.
*   **Exclusion:**  Omit any conversational elements, personal commentary, or extraneous information. Stay strictly factual and focused on the subject matter of the notes.

**Notes:** {note_context}
    """

    return ask_ai(prompt_string, {"note_context": "\n\n".join(note_context)})


def generate_note_summary(
    note_context: str, audio_context: str, documents_context: str
) -> str:
    prompt_string = """
Synthesize a concise and structured markdown summary, in the same language as the input, integrating information from the following sources.  Prioritize consistency and avoid redundancy.

*   **Notes:** {note_context}
*   **Audio Transcription:** {audio_context}
*   **Documents:** {documents_context}

If a particular source (Notes, Audio Transcription, or Documents) is absent, disregard that section and proceed with the available information.

The summary should be well-organized, using headings and bullet points where appropriate, to facilitate quick understanding.  Focus on key themes, arguments, and data points.  Do not include conversational remarks or commentary.
    """

    logging.info(f"Audio context: {audio_context}")

    return ask_ai(
        prompt_string,
        {
            "note_context": note_context,
            "audio_context": audio_context,
            "documents_context": documents_context,
        },
    )


def create_note_summary(note: NoteSchema, session: SessionDep) -> SummarySchema:
    recordings = session.exec(
        select(VoiceRecordingSchema).where(VoiceRecordingSchema.note_id == note.id)
    ).all()

    transcriptions = [
        f"Recording title: {recording.title}\\nTranscription: {recording.transcription}"
        for recording in recordings
    ]
    transcription_context = "\\n\\n".join(transcriptions)

    documents = session.exec(
        select(DocumentSchema).where(DocumentSchema.note_id == note.id)
    ).all()

    documents_context = "\\n\\n".join(
        [
            f"Document title: {document.file_name}\\nContent: {generate_document_summary(document.content)}"
            for document in documents
        ]
    )

    summary = generate_note_summary(
        note.content, transcription_context, documents_context
    )

    db_summary = SummarySchema(note_id=note.id, summary_text=summary)

    session.add(db_summary)
    session.commit()
    session.refresh(db_summary)

    return db_summary


def generate_document_summary(content: str) -> str:
    chunk_size = 80000
    chunk_overlap = 200

    prompt_string = """
    Summarize the following document concisely and in the same language as the original, formatting the summary in Markdown. 
    Omit any commentary or self-reference from your response. Document: {document}
    """

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
        is_separator_regex=False,
    )
    chunks = text_splitter.split_text(content)
    logging.info(f"Splitted into {len(chunks)} chunks")
    summaries = []
    for i, chunk in enumerate(chunks):
        logging.info(f"Summarizing chunk {i+1}/{len(chunks)}")
        try:
            summary = ask_ai(prompt_string, {"document": chunk}, CHAT_MODELS[2])
            summaries.append(summary)
            logging.info(f"Summary {i+1}: {len(summary)} characters")
        except Exception as e:
            logging.error(f"Error summarizing chunk {i+1}: {e}")

    combined_summary = "\n".join(summaries)

    if len(chunks) > 1:
        logging.info("Creating final summary...")
        final_summary = ask_ai(
            prompt_string, {"document": combined_summary}, CHAT_MODELS[2]
        )
        logging.info("Final Summary created")

        return final_summary

    return combined_summary


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


def transcript_to_chunks(
    words: list[dict], time_window: int = 5000, overlap_percentage: float = 0.25
):
    """
    Split a transcript into time-based chunks with specified overlap between chunks.

    Args:
        words: List of word dictionaries, each containing at least 'word' and 'start' keys
        time_window: Size of each time window in milliseconds
        overlap_percentage: Amount of overlap between chunks (0.0-1.0)

    Returns:
        List of chunk dictionaries with 'content', 'start', and 'end' keys
    """
    if not words:
        return []

    chunk_number = 1
    current_chunk = []
    chunks = []
    overlap_words = []
    overlap_time = int(time_window * overlap_percentage)

    for idx, word in enumerate(words):
        # Add word to current chunk if it's within the current time window
        if word["start"] <= time_window * chunk_number:
            current_chunk.append(word["word"])

            # Track words that will be part of the overlap for the next chunk
            if word["start"] >= (time_window * chunk_number - overlap_time):
                overlap_words.append(word["word"])
        else:
            # We've exceeded the current time window
            chunks.append(
                {
                    "content": " ".join(current_chunk),
                    "start": time_window * (chunk_number - 1),
                    "end": time_window * chunk_number,
                }
            )

            # Start a new chunk with the overlap words
            chunk_number += 1
            current_chunk = overlap_words + [word["word"]]
            overlap_words = []

            # If this word is near the end of the new window, track it for the next overlap
            if word["start"] >= (time_window * chunk_number - overlap_time):
                overlap_words.append(word["word"])

    # Add the final chunk if there are any words left
    if current_chunk:
        chunks.append(
            {
                "content": " ".join(current_chunk),
                "start": time_window * (chunk_number - 1),
                "end": time_window * chunk_number,
            }
        )

    return chunks


def create_voice_embedding(words: list[dict], voice_id: uuid.UUID, user_id: uuid.UUID):
    logging.info("Creating voice embeddings")

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
    logging.info("Creating note embeddings")
    create_note_embedding_sync(id, user_id, content)


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
        session.add(db_document)
        session.commit()


def create_note_embedding_sync(id: uuid.UUID, user_id: uuid.UUID, content: str):
    """
    Synchronous version of create_note_embedding without the debounce decorator.
    Used for batch processing during startup.
    """
    logging.info("Creating note embeddings synchronously")
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
