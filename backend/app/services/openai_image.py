from __future__ import annotations

import base64
from pathlib import Path

from fastapi import HTTPException
from openai import OpenAI

from app.core.config import get_settings
from app.services.storage import save_processed_bytes

PRESERVATION_SYSTEM_HINT = (
    "You are assisting a professional visual communication studio. "
    "Edit and reconstruct the provided image according to the user instructions. "
    "Unless the user explicitly asks to change them, preserve all text, logos, brand marks, "
    "colors, proportions, layout, and overall composition with high fidelity. "
    "Do not invent unrelated elements. Prefer clean, print-ready visual quality."
)


def enhance_image(image_path: Path, user_prompt: str) -> dict:
    settings = get_settings()
    if not settings.openai_configured:
        raise HTTPException(
            status_code=503,
            detail=(
                "OpenAI API não configurada. Defina OPENAI_API_KEY no arquivo backend/.env "
                "e reinicie o servidor."
            ),
        )

    prompt = f"{PRESERVATION_SYSTEM_HINT}\n\nUser request:\n{user_prompt.strip()}"
    client = OpenAI(api_key=settings.openai_api_key)

    try:
        with image_path.open("rb") as image_file:
            result = client.images.edit(
                model=settings.openai_image_model,
                image=image_file,
                prompt=prompt,
                quality="high",
            )
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Falha ao processar imagem com OpenAI: {exc}",
        ) from exc

    if not result.data or not result.data[0].b64_json:
        raise HTTPException(status_code=502, detail="A OpenAI não retornou uma imagem válida.")

    image_bytes = base64.b64decode(result.data[0].b64_json)
    saved = save_processed_bytes(image_bytes, extension=".png")
    return {
        **saved,
        "mode": "enhance",
        "message": "Imagem redesenhada com IA.",
    }
