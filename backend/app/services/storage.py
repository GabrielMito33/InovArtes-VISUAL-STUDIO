from __future__ import annotations

import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile
from PIL import Image

from app.core.config import PROCESSED_DIR, UPLOADS_DIR, get_settings

ALLOWED_CONTENT_TYPES = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/webp": ".webp",
}

ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}


def _extension_for(filename: str | None, content_type: str | None) -> str:
    if filename:
        suffix = Path(filename).suffix.lower()
        if suffix == ".jpeg":
            return ".jpg"
        if suffix in ALLOWED_EXTENSIONS:
            return suffix
    if content_type and content_type.lower() in ALLOWED_CONTENT_TYPES:
        return ALLOWED_CONTENT_TYPES[content_type.lower()]
    raise HTTPException(status_code=400, detail="Formato inválido. Use PNG, JPG ou WEBP.")


def resolve_upload_path(file_id: str) -> Path:
    matches = list(UPLOADS_DIR.glob(f"{file_id}.*"))
    if not matches:
        raise HTTPException(status_code=404, detail="Imagem original não encontrada.")
    return matches[0]


def resolve_processed_path(file_id: str) -> Path:
    matches = list(PROCESSED_DIR.glob(f"{file_id}.*"))
    if not matches:
        raise HTTPException(status_code=404, detail="Imagem processada não encontrada.")
    return matches[0]


def resolve_any_path(file_id: str) -> Path:
    upload_matches = list(UPLOADS_DIR.glob(f"{file_id}.*"))
    if upload_matches:
        return upload_matches[0]
    processed_matches = list(PROCESSED_DIR.glob(f"{file_id}.*"))
    if processed_matches:
        return processed_matches[0]
    raise HTTPException(status_code=404, detail="Arquivo não encontrado.")


def image_dimensions(path: Path) -> tuple[int | None, int | None]:
    try:
        with Image.open(path) as img:
            return img.size
    except Exception:
        return None, None


async def save_upload(file: UploadFile) -> dict:
    settings = get_settings()
    content_type = (file.content_type or "").lower()
    extension = _extension_for(file.filename, content_type)

    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="Arquivo vazio.")
    if len(data) > settings.max_upload_bytes:
        raise HTTPException(
            status_code=400,
            detail=f"Arquivo excede o limite de {settings.max_upload_mb} MB.",
        )

    file_id = str(uuid.uuid4())
    destination = UPLOADS_DIR / f"{file_id}{extension}"
    destination.write_bytes(data)

    try:
        with Image.open(destination) as img:
            img.verify()
        width, height = image_dimensions(destination)
    except Exception as exc:
        destination.unlink(missing_ok=True)
        raise HTTPException(status_code=400, detail="Arquivo de imagem inválido ou corrompido.") from exc

    return {
        "file_id": file_id,
        "filename": file.filename or destination.name,
        "content_type": content_type or f"image/{extension.lstrip('.')}",
        "size_bytes": len(data),
        "width": width,
        "height": height,
        "url": f"/api/files/{file_id}",
        "path": destination,
    }


def save_processed_bytes(data: bytes, extension: str = ".png") -> dict:
    if extension == ".jpeg":
        extension = ".jpg"
    if not extension.startswith("."):
        extension = f".{extension}"

    file_id = str(uuid.uuid4())
    destination = PROCESSED_DIR / f"{file_id}{extension}"
    destination.write_bytes(data)
    width, height = image_dimensions(destination)

    return {
        "file_id": file_id,
        "url": f"/api/files/{file_id}",
        "width": width,
        "height": height,
        "path": destination,
    }
