import uuid

import aiofiles
from fastapi import APIRouter, BackgroundTasks, HTTPException, UploadFile
from sqlmodel import select

from app.ai import process_audio_file
from app.config import VOICE_STORAGE_PATH
from app.core.db import SessionDep
from app.core.models import VoiceRecordingSchema, VoiceTranscriptionResponse

router = APIRouter(prefix="/attachments", tags=["attachments"])


@router.get("/voice/{voice_id}/transcription")
def get_voice_transcription(
    voice_id: uuid.UUID, session: SessionDep
) -> VoiceTranscriptionResponse:
    voice_db = session.get(VoiceRecordingSchema, voice_id)
    if not voice_db:
        raise HTTPException(status_code=404, detail="Note not found")

    return VoiceTranscriptionResponse(
        transcription=voice_db.transcription,
        words=voice_db.words,
        status=voice_db.status,
    )


@router.post("/voice/{voice_id}/transcription")
async def create_voice_transcription(
    voice_id: uuid.UUID,
    session: SessionDep,
    background_tasks: BackgroundTasks,
) -> VoiceTranscriptionResponse:
    voice_db = session.get(VoiceRecordingSchema, voice_id)
    if not voice_db:
        raise HTTPException(status_code=404, detail="Note not found")

    out_file_path = f"{VOICE_STORAGE_PATH}/{voice_db.file_name}"
    background_tasks.add_task(process_audio_file, out_file_path, session, voice_db.id)

    return VoiceTranscriptionResponse(status="processing")


@router.get("/voice/{voice_id}")
async def get_voice_recording(
    voice_id: uuid.UUID, session: SessionDep
) -> VoiceRecordingSchema:
    voice_db = session.get(VoiceRecordingSchema, voice_id)
    if not voice_db:
        raise HTTPException(status_code=404, detail="Note not found")
    return voice_db


@router.get("/{note_id}/voice")
def get_voice_recordings(
    note_id: uuid.UUID, session: SessionDep
) -> list[VoiceRecordingSchema]:
    statement = select(VoiceRecordingSchema).where(
        VoiceRecordingSchema.note_id == note_id
    )
    result = session.exec(statement).all()

    return list(result)


@router.post("/upload/voice/{note_id}")
async def upload_voice(
    note_id: uuid.UUID,
    file: UploadFile,
    session: SessionDep,
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

    background_tasks.add_task(process_audio_file, out_file_path, session, db_voice.id)

    return db_voice


# @router.post("/upload/attachment/{note_id}")
# async def upload_attachment(
#     note_id: uuid.UUID,
#     type: Literal["image", "document"],
#     file: UploadFile,
#     session: SessionDep,
# ) -> AttachmentSchema:
#     file_name = file.filename
#     storage_path = Path().parent.parent.joinpath("storage").joinpath("voice")
#     out_file_path = f"{storage_path}/{file_name}"

#     async with aiofiles.open(out_file_path, "wb") as out_file:
#         while content := await file.read(1024):  # async read chunk
#             await out_file.write(content)  # async write chunk

#     db_attachment = AttachmentSchema(
#         note_id=note_id, type=type, file_name=file_name or "unknown"
#     )
#     session.add(db_attachment)
#     session.commit()
#     session.refresh(db_attachment)
#     return db_attachment
