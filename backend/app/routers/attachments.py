import uuid
from pathlib import Path
from typing import Literal

import aiofiles
from fastapi import APIRouter, BackgroundTasks, UploadFile

from app.ai import process_audio_file
from app.core.db import SessionDep
from app.core.models import AttachmentSchema, VoiceRecordingSchema

router = APIRouter(prefix="/attachments", tags=["attachments"])


@router.post("/upload/voice/{note_id}")
async def upload_voice(
    note_id: uuid.UUID,
    file: UploadFile,
    session: SessionDep,
    background_tasks: BackgroundTasks,
) -> VoiceRecordingSchema:
    file_name = file.filename
    storage_path = Path().parent.parent.joinpath("storage").joinpath("voice")
    out_file_path = f"{storage_path}/{file_name}"

    async with aiofiles.open(out_file_path, "wb") as out_file:
        while content := await file.read(1024):  # async read chunk
            await out_file.write(content)  # async write chunk

    db_voice = VoiceRecordingSchema(note_id=note_id, file_path=file_name or "unknown")
    session.add(db_voice)
    session.commit()
    session.refresh(db_voice)

    background_tasks.add_task(process_audio_file, out_file_path, session, db_voice.id)

    return db_voice


@router.post("/upload/attachment/{note_id}")
async def upload_attachment(
    note_id: uuid.UUID,
    type: Literal["image", "document"],
    file: UploadFile,
    session: SessionDep,
) -> AttachmentSchema:
    file_name = file.filename
    storage_path = Path().parent.parent.joinpath("storage").joinpath("voice")
    out_file_path = f"{storage_path}/{file_name}"

    async with aiofiles.open(out_file_path, "wb") as out_file:
        while content := await file.read(1024):  # async read chunk
            await out_file.write(content)  # async write chunk

    db_attachment = AttachmentSchema(
        note_id=note_id, type=type, file_path=file_name or "unknown"
    )
    session.add(db_attachment)
    session.commit()
    session.refresh(db_attachment)
    return db_attachment
