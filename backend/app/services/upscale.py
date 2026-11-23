from __future__ import annotations

import shutil
import subprocess
import tempfile
from pathlib import Path

from fastapi import HTTPException

from app.core.config import get_settings
from app.services.storage import save_processed_bytes


def upscale_image(image_path: Path, scale: int) -> dict:
    settings = get_settings()
    if scale not in (2, 4):
        raise HTTPException(status_code=400, detail="Escala inválida. Use 2 ou 4.")

    if not settings.realesrgan_configured:
        raise HTTPException(
            status_code=503,
            detail=(
                "Aumento de resolução aguardando configuração do Real-ESRGAN. "
                "Defina REALESRGAN_BIN no backend/.env apontando para o executável instalado "
                "e reinicie o servidor. Resultados não são simulados."
            ),
        )

    binary = Path(settings.realesrgan_bin)
    with tempfile.TemporaryDirectory(prefix="avs-upscale-") as tmp_dir:
        tmp_path = Path(tmp_dir)
        input_copy = tmp_path / f"input{image_path.suffix.lower()}"
        output_path = tmp_path / "output.png"
        shutil.copyfile(image_path, input_copy)

        command = [
            str(binary),
            "-i",
            str(input_copy),
            "-o",
            str(output_path),
            "-s",
            str(scale),
        ]

        try:
            completed = subprocess.run(
                command,
                check=False,
                capture_output=True,
                text=True,
                timeout=300,
            )
        except FileNotFoundError as exc:
            raise HTTPException(
                status_code=503,
                detail="Executável Real-ESRGAN não encontrado. Verifique REALESRGAN_BIN.",
            ) from exc
        except subprocess.TimeoutExpired as exc:
            raise HTTPException(status_code=504, detail="Tempo esgotado no Real-ESRGAN.") from exc

        if completed.returncode != 0 or not output_path.exists():
            stderr = (completed.stderr or completed.stdout or "").strip()
            detail = stderr or "Falha desconhecida no Real-ESRGAN."
            raise HTTPException(status_code=502, detail=f"Real-ESRGAN falhou: {detail}")

        saved = save_processed_bytes(output_path.read_bytes(), extension=".png")
        return {
            **saved,
            "mode": "upscale",
            "message": f"Imagem ampliada em {scale}x com Real-ESRGAN.",
        }
