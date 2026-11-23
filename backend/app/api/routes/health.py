from fastapi import APIRouter

from app.core.config import get_settings
from app.schemas.images import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/api/health", response_model=HealthResponse)
def health() -> HealthResponse:
    settings = get_settings()
    return HealthResponse(
        status="ok",
        openai_configured=settings.openai_configured,
        realesrgan_configured=settings.realesrgan_configured,
        max_upload_mb=settings.max_upload_mb,
        openai_image_model=settings.openai_image_model,
    )
