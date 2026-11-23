from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import health, images
from app.core.config import get_settings

settings = get_settings()

app = FastAPI(
    title="AI Visual Studio API",
    description="API interna para ferramentas de comunicação visual com IA.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(images.router)
