# Muhammad Sultan Khalid - Personal AI Interview Assistant

A resume-grounded AI interview console for recruiters, hiring managers, and prospective clients.
The React frontend connects to a FastAPI backend and a Groq-hosted language model.

The assistant uses Muhammad Sultan Khalid's resume as its source of truth and answers in the
third person. It provides resume details, project summaries, role-fit analysis, and concise
professional guidance. Unsupported requests and resume details not in the source context are
handled through explicit guardrails.

## Features

- Dark and light themes
- Recruiter, Tech Lead, and Founder / Client interview lenses
- Lens-aware suggested questions
- Optional context framing for submitted questions
- Conversation history persisted in `sessionStorage`
- Resume-grounded Markdown responses
- Sequential response loading ticker and measured latency
- Copy response, clear interview, and retry controls
- Mobile dossier drawer
- Guardrail cards for answers outside the resume scope
- Backend health polling

## Stack

- React 19
- Vite
- Tailwind CSS 4
- `lucide-react`
- `react-markdown`
- FastAPI
- Groq API
- PyPDF

## Project Structure

```text
.
|-- main.py                         # FastAPI application
|-- Muhammad_Sultan_Khalid_AI_Engineer_Resume.pdf
|-- src/
|   |-- App.jsx                    # Main application state and layout
|   |-- main.jsx                   # React entry point
|   |-- styles.css                 # Tailwind and global styles
|   |-- config/candidate.js        # Candidate identity and starter prompts
|   |-- services/api.js            # Health and chat API wrapper
|   `-- components/
|       |-- SidebarDossier.jsx
|       |-- ChatMessage.jsx
|       |-- PromptComposer.jsx
|       `-- ThinkingTicker.jsx
|-- package.json
|-- vite.config.js
`-- pyproject.toml
```

## Prerequisites

- Python 3.13 or later
- Node.js 20 or later
- A Groq API key

## Environment Configuration

Create a `.env` file in the project root:

```dotenv
GROQ_API_KEY=your_groq_api_key
```

Optional frontend configuration:

```dotenv
VITE_API_BASE_URL=http://localhost:8000
```

The frontend defaults to `http://localhost:8000`.

Do not commit `.env`. It is already excluded by `.gitignore`.

## Installation

Install Python dependencies:

```powershell
uv sync
```

Install frontend dependencies:

```powershell
npm install
```

Required frontend packages:

```powershell
npm install lucide-react react-markdown
npm install -D tailwindcss @tailwindcss/vite
```

## Run the Project

Start the FastAPI backend:

```powershell
.\\.venv\\Scripts\\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

Start the Vite frontend in another terminal:

```powershell
npm run dev -- --host 127.0.0.1
```

Open:

- Frontend: `http://127.0.0.1:5173`
- Backend documentation: `http://127.0.0.1:8000/docs`

## Backend API

### Health

```text
GET /
```

Response:

```json
{
  "message": "Ye home page hai"
}
```

### Chat

```text
POST /chat
Content-Type: application/json
```

Request:

```json
{
  "question": "What AI skills does Muhammad Sultan Khalid have?"
}
```

Response:

```json
{
  "answer": "Muhammad Sultan Khalid has experience with..."
}
```

Inference may take several seconds because the resume is parsed and the Groq model processes
the grounded prompt synchronously.

## CORS

The backend allows:

- `http://localhost:5173`
- `http://127.0.0.1:5173`

Add the deployed frontend URL to the `allow_origins` list before production deployment.

## Vercel Deployment

The repository includes `vercel.json` and `.nvmrc` so Vercel can use:

- Node.js 20
- `npm run build`
- `dist` as the output directory

Add this environment variable in Vercel Project Settings:

```text
VITE_API_BASE_URL=https://your-deployed-backend-url
```

Redeploy after changing frontend environment variables. The FastAPI backend and Groq key must
be deployed separately and the backend CORS configuration must include the Vercel frontend URL.

## Build

Create a production frontend build:

```powershell
npm run build
```

Preview the production build:

```powershell
npm run preview
```