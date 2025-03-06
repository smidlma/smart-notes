import uuid

import aiofiles
from fastapi import APIRouter, BackgroundTasks, HTTPException, UploadFile
from sqlmodel import select

from app.ai import generate_document_summary, process_audio_file, process_pdf_file
from app.config import DOCUMENT_STORAGE_PATH, IMAGE_STORAGE_PATH, VOICE_STORAGE_PATH
from app.core.db import SessionDep
from app.core.models import (
    DocumentSchema,
    ImageSchema,
    VoiceRecordingSchema,
    VoiceRecordingUpdate,
    VoiceTranscriptionResponse,
    WordSchema,
)
from app.core.security import CurrentUserDep
from app.utils import get_logger, save_uploaded_file

logger = get_logger(__name__)
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
    logger.info(f"Uploading voice recording for note: {note_id}")

    filename, out_file_path = await save_uploaded_file(file, VOICE_STORAGE_PATH)

    # Create database record
    db_voice = VoiceRecordingSchema(note_id=note_id, file_name=filename)
    session.add(db_voice)
    session.commit()
    session.refresh(db_voice)

    # Process the audio file in the background
    background_tasks.add_task(
        process_audio_file, out_file_path, session, db_voice.id, user.id
    )

    logger.debug(f"Voice recording uploaded successfully: {db_voice.id}")
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
        words=(
            [WordSchema(**word) for word in voice_db.words] if voice_db.words else None
        ),
        status=voice_db.status,
    )


@router.post("/upload/image/{note_id}")
async def upload_image(
    note_id: uuid.UUID,
    file: UploadFile,
    session: SessionDep,
    user: CurrentUserDep,
) -> ImageSchema:
    logger.info(f"Uploading image for note: {note_id}")

    # Save the uploaded file - this will raise an exception if filename is missing
    filename, out_file_path = await save_uploaded_file(file, IMAGE_STORAGE_PATH)

    # Create database record
    db_image = ImageSchema(note_id=note_id, file_name=filename)
    session.add(db_image)
    session.commit()
    session.refresh(db_image)

    logger.debug(f"Image uploaded successfully: {db_image.id}")
    return db_image


@router.post("/upload/document/{note_id}")
async def upload_document(
    note_id: uuid.UUID,
    file: UploadFile,
    name: str,
    session: SessionDep,
    user: CurrentUserDep,
    background_tasks: BackgroundTasks,
) -> DocumentSchema:
    logger.info(f"Uploading document for note: {note_id}")

    # Check if the file is a PDF
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        logger.warning(f"Unsupported file type: {file.filename}")
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    filename, out_file_path = await save_uploaded_file(
        file, DOCUMENT_STORAGE_PATH, name
    )

    db_document = DocumentSchema(
        note_id=note_id,
        file_name=filename,
        content="",  # Empty content initially, will be filled by the background task
        type="pdf",
    )
    session.add(db_document)
    session.commit()
    session.refresh(db_document)

    out_file_path = f"{DOCUMENT_STORAGE_PATH}/{filename}"

    background_tasks.add_task(
        process_pdf_file, out_file_path, session, db_document.id, user.id
    )

    logger.debug(f"Document uploaded successfully: {db_document.id}")
    return db_document


@router.get("/document/{document_id}/summary")
def get_document_summary(document_id: uuid.UUID, session: SessionDep) -> DocumentSchema:
    document_db = session.get(DocumentSchema, document_id)

    if not document_db:
        raise HTTPException(status_code=404, detail="Document not found")

    summary = generate_document_summary(document_db)
    document_db.sqlmodel_update({"summary": summary})
    session.add(document_db)
    session.commit()
    session.refresh(document_db)

    return document_db
