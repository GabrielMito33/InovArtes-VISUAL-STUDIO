# AI Visual Studio

Aplicativo interno para empresas de comunicação visual, com ferramentas de inteligência artificial.

**Primeira entrega:** Dashboard + módulo **Melhorar imagens** (redesenho com OpenAI e estrutura de upscale via Real-ESRGAN).

## Stack

| Camada | Tecnologias |
|--------|-------------|
| Frontend | Next.js, React, TypeScript, Tailwind CSS, Lucide Icons |
| Backend | Python, FastAPI, OpenAI API, Pillow |
| Upscale | Real-ESRGAN (integração preparada; não simulada) |

## Estrutura

```text
/
├── frontend/     # Interface Next.js
├── backend/      # API FastAPI
├── .env.example
└── README.md
```

## Funcionalidades implementadas

- Dashboard com visão geral e roadmap
- Menu lateral com módulos futuros marcados como **Em breve** (sem botões mortos)
- Melhorar imagens:
  - Upload por arrastar e soltar (PNG, JPG, WEBP)
  - Pré-visualização
  - **Redesenhar com IA** via OpenAI (`gpt-image-2.6-sunburst`)
  - **Aumentar resolução** (2x / 4x) — retorna erro claro se Real-ESRGAN não estiver configurado
  - Loading, comparação antes/depois e download

## Pré-requisitos (Windows)

- Python 3.11 ou superior
- Node.js 20 ou superior
- Conta OpenAI com acesso à Images API (para redesenhar com IA)

## Configuração

### 1. Variáveis de ambiente

Na pasta `backend`, copie o exemplo:

```bat
cd backend
copy .env.example .env
```

Edite `backend\.env`:

```env
OPENAI_API_KEY=sua_chave_aqui
OPENAI_IMAGE_MODEL=gpt-image-2.6-sunburst
REALESRGAN_BIN=
MAX_UPLOAD_MB=20
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

A chave **nunca** deve ser colocada no frontend.

Para Real-ESRGAN (opcional nesta entrega), instale o binário e defina, por exemplo:

```env
REALESRGAN_BIN=C:\Tools\realesrgan-ncnn-vulkan\realesrgan-ncnn-vulkan.exe
```

### 2. Backend

No Prompt de Comando ou PowerShell:

```bat
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

API: `http://127.0.0.1:8000`  
Docs: `http://127.0.0.1:8000/docs`

### 3. Frontend

Em outro terminal:

```bat
cd frontend
npm install
npm run dev
```

Interface: `http://localhost:3000`

O Next.js faz proxy de `/api/*` para o backend (`BACKEND_URL`, padrão `http://127.0.0.1:8000`).

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/health` | Saúde e flags de configuração |
| `POST` | `/api/images/upload` | Upload de imagem |
| `POST` | `/api/images/enhance` | Redesenho com OpenAI |
| `POST` | `/api/images/upscale` | Upscale Real-ESRGAN (2x/4x) |
| `GET` | `/api/files/{file_id}` | Servir imagem original/processada |

## Teste rápido da API (PowerShell)

```powershell
# Health
Invoke-RestMethod http://127.0.0.1:8000/api/health

# Upload
$form = @{ file = Get-Item "C:\caminho\imagem.png" }
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:8000/api/images/upload -Form $form
```

## Observações importantes

- Módulos como Vetorizar, CNC, Fachadas 3D, Orçamentos etc. aparecem no menu apenas como futuros.
- Sem Real-ESRGAN configurado, o upscale responde com HTTP 503 informativo — **não há resultado fictício**.
- Sem `OPENAI_API_KEY`, o enhance responde com HTTP 503 pedindo configuração.
- Uso interno: sem cadastro externo, pagamentos ou assinaturas nesta versão.
