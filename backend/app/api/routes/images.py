from fastapi import APIRouter, File, UploadFile
from fastapi.responses import FileResponse

from app.schemas.images import EnhanceRequest, ProcessResponse, UploadResponse, UpscaleRequest
from app.services import openai_image, storage, upscale

router = APIRouter(tags=["images"])


@router.post("/api/images/upload", response_model=UploadResponse)
async def upload_image(file: UploadFile = File(...)) -> UploadResponse:
    saved = await storage.save_upload(file)
    return UploadResponse(
        file_id=saved["file_id"],
        filename=saved["filename"],
        content_type=saved["content_type"],
        size_bytes=saved["size_bytes"],
        width=saved["width"],
        height=saved["height"],
        url=saved["url"],
    )


@router.post("/api/images/enhance", response_model=ProcessResponse)
def enhance_image(payload: EnhanceRequest) -> ProcessResponse:
    image_path = storage.resolve_upload_path(payload.file_id)
    result = openai_image.enhance_image(image_path, payload.prompt)
    return ProcessResponse(
        file_id=result["file_id"],
        original_file_id=payload.file_id,
        mode=result["mode"],
        url=result["url"],
        width=result["width"],
        height=result["height"],
        message=result.get("message"),
    )


@router.post("/api/images/upscale", response_model=ProcessResponse)
def upscale_image(payload: UpscaleRequest) -> ProcessResponse:
    image_path = storage.resolve_upload_path(payload.file_id)
    result = upscale.upscale_image(image_path, payload.scale)
    return ProcessResponse(
        file_id=result["file_id"],
        original_file_id=payload.file_id,
        mode=result["mode"],
        url=result["url"],
        width=result["width"],
        height=result["height"],
        message=result.get("message"),
    )


@router.get("/api/files/{file_id}")
def get_file(file_id: str) -> FileResponse:
    path = storage.resolve_any_path(file_id)
    media_type = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp",
    }.get(path.suffix.lower(), "application/octet-stream")
    return FileResponse(path, media_type=media_type, filename=path.name)
