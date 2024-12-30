import itertools
import uuid

from langchain_community.document_loaders import AssemblyAIAudioTranscriptLoader
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import GoogleGenerativeAI

from app.core.db import SessionDep
from app.core.models import VoiceRecordingSchema, WordSchema


def generate_summary(context: str) -> str:
    messages = [
        ("system", "Write a concise summary of the following notes:\\n\\n{context}"),
    ]

    prompt_template = ChatPromptTemplate(messages)
    prompt = prompt_template.invoke({"context": context})

    model = GoogleGenerativeAI(
        model="gemini-exp-1206",
    )
    result = model.invoke(prompt)

    return result


def process_audio_file(
    file_path: str, session: SessionDep, voice_id: uuid.UUID
) -> None:
    db_voice = session.get(VoiceRecordingSchema, voice_id)

    if not db_voice:
        raise ValueError("Voice recording not found")

    loader = AssemblyAIAudioTranscriptLoader(file_path=file_path)
    docs = loader.load()

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

    print(f"Transcription: {transcription}")
    print(f"Words: {words}")

    db_voice.sqlmodel_update({"transcription": transcription, "words": merged_words})

    session.add(db_voice)
    session.commit()
    session.refresh(db_voice)
