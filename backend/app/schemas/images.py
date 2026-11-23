from typing import Literal

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str
    openai_configured: bool
    realesrgan_configured: bool
    max_upload_mb: int
    openai_image_model: str


class UploadResponse(BaseModel):
    file_id: str
    filename: str
    content_type: str
    size_bytes: int
    width: int | None = None
    height: int | None = None
    url: str


class EnhanceRequest(BaseModel):
    file_id: str
    prompt: str = Field(min_length=1, max_length=4000)


class UpscaleRequest(BaseModel):
    file_id: str
    scale: Literal[2, 4] = 2


class ProcessResponse(BaseModel):
    file_id: str
    original_file_id: str
    mode: str
    url: str
    width: int | None = None
    height: int | None = None
    message: str | None = None
