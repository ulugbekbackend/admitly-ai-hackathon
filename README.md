# Admitly — AI Grant Assistant

> An AI-powered platform that simplifies applying to international scholarships and universities for students from Uzbekistan.

## Problem & Solution

Every year, thousands of students in Uzbekistan try to apply for international scholarships and universities. However, the process is very complicated:

- They don't know which program they are eligible for
- They cannot determine which documents are required
- They don't understand where they are making mistakes in their essays
- Every program has different requirements

**Admitly** solves this problem by calculating a student's eligibility based on their profile (GPA, IELTS, experience), automatically generating a required document checklist, and analyzing essays with AI to highlight strengths and weaknesses.

## Technologies

| Layer | Stack |
|---|---|
| Frontend | React 19, Vite 6, TailwindCSS v4, TanStack Query v5, Zustand, shadcn/ui |
| Backend | Django 5.2, Django REST Framework, SimpleJWT |
| AI | Google Gemini 2.0 Flash |
| Database | PostgreSQL |

## Key Features

### For Users

- **Programs Catalog** — A list of 7 international scholarships and universities including DAAD, Chevening, Fulbright, Erasmus+, and more. Includes filtering (scholarship/university), search, and deadline countdown.
- **Profile & Score** — Users enter their GPA, IELTS score, and work experience; the system automatically calculates their eligibility percentage.
- **Application & Document Checklist** — Create applications, automatically generate the required document checklist, and upload files (PDF/DOCX).
- **AI Essay Analysis** — Paste your essay and Gemini AI analyzes it in Uzbek, providing an overall score (0–100), inline color-coded comments (🔴 critical, 🟡 recommendation, 🟢 strength), missing elements, and an overall conclusion.
- **Essay History** — All analyses are saved and can be reviewed anytime.
- **Credit System** — New users receive 5 free credits. Premium users get 100 credits/month, with additional credit packages available for purchase.

### Technical

- Fully separated REST API architecture (Django + React)
- JWT authentication: access token (1 hour) + refresh token (7 days) with automatic refresh
- Credit deduction for parallel Gemini API requests is protected against race conditions using atomic `F()` updates
- File uploads via `multipart/form-data`, 10 MB limit, PDF/DOC/DOCX validation
- Rate limiting: Essay analysis is limited to 30 requests per user per day
- Fully responsive design across all pages

## Getting Started

### Requirements

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+

### 1. Clone the Repository

```bash
git clone https://github.com/ulugbekbackend/admitly-ai-hackathon.git
cd admitly-ai-hackathon
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file:

```bash
cp .env.example .env
# Open the .env file and configure your database credentials and GEMINI_API_KEY
```

Create the database and run migrations:

```bash
psql -U postgres -c "CREATE DATABASE admitly_db;"
python manage.py migrate
python manage.py loaddata apps/programs/fixtures/programs.json
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
cp .env.example .env
```

### 4. Run the Project

```bash
# Run frontend and backend together (from the frontend directory)
npm run dev:all
```

Or run them separately:

```bash
# Backend
cd backend && python manage.py runserver

# Frontend (new terminal)
cd frontend && npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000/api |
| Admin Panel | http://localhost:8000/admin |

## Environment Variables

### `backend/.env`

| Variable | Description |
|---|---|
| `SECRET_KEY` | Django secret key (`python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`) |
| `DEBUG` | `True` (for development) |
| `DB_NAME` | PostgreSQL database name |
| `DB_USER` | PostgreSQL username |
| `DB_PASSWORD` | PostgreSQL password |
| `DB_HOST` | Database host (default: `localhost`) |
| `DB_PORT` | Database port (default: `5432`) |
| `ALLOWED_ORIGINS` | Frontend URL (CORS) |
| `GEMINI_API_KEY` | Google Gemini API key — https://aistudio.google.com/app/apikey |
| `GEMINI_MODEL` | Gemini model (default: `gemini-2.0-flash`) |
| `DJANGO_SETTINGS_MODULE` | `config.settings.development` |

### `frontend/.env`

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API URL (`http://localhost:8000/api`) |
| `VITE_APP_NAME` | Application name |

## API Endpoints

```text
POST   /api/auth/register/               — Register
POST   /api/auth/login/                  — Login (JWT)
POST   /api/auth/token/refresh/          — Refresh token
GET    /api/auth/me/                     — Current user
PATCH  /api/auth/me/update/              — Update profile
POST   /api/auth/upgrade/                — Upgrade to Premium
POST   /api/auth/buy-credits/            — Purchase credits

GET    /api/programs/                    — List programs
GET    /api/programs/:id/                — Program details

GET    /api/applications/                — List applications
POST   /api/applications/                — Create application
PATCH  /api/applications/documents/:id/  — Update document / upload file

POST   /api/ai/analyze/                  — Analyze essay (1 credit)
GET    /api/ai/my-essays/                — Essay history
POST   /api/ai/score/                    — Calculate application score
```

## Project Structure

```text
admitly/
├── backend/
│   ├── apps/
│   │   ├── accounts/     # User model, JWT, credit system
│   │   ├── programs/     # Scholarship/university models and fixtures
│   │   ├── applications/ # Applications, document models, file uploads
│   │   └── ai/           # Gemini integration and essay analysis service
│   ├── config/           # Django settings (split: base/dev/prod)
│   └── core/             # IsOwner permission, pagination, exception handler
└── frontend/
    └── src/
        ├── api/          # Axios client (JWT interceptor), API functions
        ├── components/   # UI: layout, checklist, essay, dashboard, pricing
        ├── hooks/        # TanStack Query hooks (server state)
        ├── pages/        # Pages: Landing, Dashboard, Programs, Essay...
        └── store/        # Zustand: auth token, active application
```

## Included Programs (Fixture)

| Program | Country | Type |
|---|---|---|
| DAAD Research Grant | Germany | Scholarship |
| Chevening Scholarship | United Kingdom | Scholarship |
| Fulbright Program | United States | Scholarship |
| Erasmus+ | Europe | Scholarship |
| Bologna University | Italy | University |
| University of Warsaw | Poland | University |
| Nazarbayev University | Kazakhstan | University |

## Screenshots

| Page | Description |
|---|---|
| Landing | Project introduction with Login/Register buttons |
| Dashboard | Eligibility score, document progress, and tasks |
| Programs | Catalog, filtering, search, and deadlines |
| Documents | Checklist, file upload, and status management |
| Essay Analysis | Essay input, AI analysis, and color-coded feedback |
| My Essays | Analysis history and detailed results |
| Pricing | Free/Premium plans and credit packages |
| Profile | GPA, IELTS, experience, and personal information |