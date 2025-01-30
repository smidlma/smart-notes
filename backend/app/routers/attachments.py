import logging
import uuid

import aiofiles
from fastapi import APIRouter, BackgroundTasks, HTTPException, UploadFile
from sqlmodel import select

from app.ai import process_audio_file
from app.config import VOICE_STORAGE_PATH
from app.core.db import SessionDep
from app.core.models import (
    VoiceRecordingSchema,
    VoiceRecordingUpdate,
    VoiceTranscriptionResponse,
    WordSchema,
)
from app.core.security import CurrentUserDep

router = APIRouter(prefix="/attachments", tags=["attachments"])


@router.get("/{note_id}/voice")
def get_voice_recordings(
    note_id: uuid.UUID, session: SessionDep
) -> list[VoiceRecordingSchema]:
    statement = select(VoiceRecordingSchema).where(
        VoiceRecordingSchema.note_id == note_id
    )
    result = session.exec(statement).all()

    return list(result)


@router.get("/voice/{voice_id}")
async def get_voice_recording(
    voice_id: uuid.UUID, session: SessionDep
) -> VoiceRecordingSchema:
    voice_db = session.get(VoiceRecordingSchema, voice_id)
    if not voice_db:
        raise HTTPException(status_code=404, detail="Note not found")
    return voice_db


@router.put("/voice/{voice_id}")
def update_voice_recording(
    voice_id: uuid.UUID, voice_update: VoiceRecordingUpdate, session: SessionDep
) -> VoiceRecordingSchema:
    voice_db = session.get(VoiceRecordingSchema, voice_id)
    if not voice_db:
        raise HTTPException(status_code=404, detail="Note not found")

    logging.info(voice_update)
    voice_data = voice_update.model_dump(exclude_unset=True)
    voice_db.sqlmodel_update(voice_data)
    session.add(voice_db)
    session.commit()
    session.refresh(voice_db)

    return voice_db


@router.post("/upload/voice/{note_id}")
async def upload_voice(
    note_id: uuid.UUID,
    file: UploadFile,
    session: SessionDep,
    user: CurrentUserDep,
    background_tasks: BackgroundTasks,
) -> VoiceRecordingSchema:
    file_name = file.filename

    out_file_path = f"{VOICE_STORAGE_PATH}/{file_name}"

    async with aiofiles.open(out_file_path, "wb") as out_file:
        while content := await file.read(1024):  # async read chunk
            await out_file.write(content)  # async write chunk

    db_voice = VoiceRecordingSchema(note_id=note_id, file_name=file_name or "unknown")
    session.add(db_voice)
    session.commit()
    session.refresh(db_voice)

    background_tasks.add_task(
        process_audio_file, out_file_path, session, db_voice.id, user.id
    )

    return db_voice


@router.get("/voice/{voice_id}/transcription")
def get_voice_transcription(
    voice_id: uuid.UUID,
    session: SessionDep,
    background_tasks: BackgroundTasks,
    user: CurrentUserDep,
) -> VoiceTranscriptionResponse:
    voice_db = session.get(VoiceRecordingSchema, voice_id)
    if not voice_db:
        raise HTTPException(status_code=404, detail="Note not found")

    if voice_db.status == "failed":
        out_file_path = f"{VOICE_STORAGE_PATH}/{voice_db.file_name}"
        background_tasks.add_task(
            process_audio_file, out_file_path, session, voice_db.id, user.id
        )

    return VoiceTranscriptionResponse(
        transcription=voice_db.transcription,
        words=[WordSchema(**word) for word in voice_db.words]
        if voice_db.words
        else None,
        status=voice_db.status,
    )
