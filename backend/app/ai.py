import itertools
import logging
import uuid

from assemblyai import SpeechModel, TranscriptionConfig
from langchain_community.document_loaders import AssemblyAIAudioTranscriptLoader
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import GoogleGenerativeAI
from langchain_text_splitters import HTMLHeaderTextSplitter
from sqlmodel import select

from app.core.db import SessionDep, get_chroma_collection
from app.core.models import NoteSchema, SummarySchema, VoiceRecordingSchema, WordSchema
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

    vector_store = get_chroma_collection(collection_name="voice_embeddings")
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

        vector_store = get_chroma_collection(collection_name="note_embeddings")

        vector_store.delete(where={"note_id": str(id)})

        vector_store.add_documents(documents=documents, ids=uuids)
