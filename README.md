# Admitly

AI-powered document preparation platform for Uzbek students applying to international universities and grants.

## Requirements

- Node.js 18+
- Python 3.10+
- PostgreSQL 14+

## Quick Start

### 1. Clone and install root dependencies

```bash
npm install
```

### 2. Backend setup

```bash
cd backend
pip install -r requirements.txt
```

Copy and configure the backend env file:

```bash
cp .env.example .env
# Edit .env — set DB credentials and your ANTHROPIC_API_KEY
```

Create the database:

```bash
psql -U postgres -c "CREATE DATABASE admitly_db;"
```

Run migrations and load seed data:

```bash
python manage.py migrate
python manage.py loaddata apps/programs/fixtures/programs.json
```

Create an admin user (optional):

```bash
python manage.py createsuperuser
```

### 3. Frontend setup

```bash
cd frontend
cp .env.example .env
```

### 4. Run everything

From the project root:

```bash
npm run dev
```

This starts both servers concurrently:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Admin panel: http://localhost:8000/admin

## Environment Variables

### backend/.env

| Variable | Description |
|---|---|
| `SECRET_KEY` | Django secret key |
| `DEBUG` | `True` for development |
| `DB_NAME` | PostgreSQL database name |
| `DB_USER` | PostgreSQL username |
| `DB_PASSWORD` | PostgreSQL password |
| `DB_HOST` | Database host (default: localhost) |
| `DB_PORT` | Database port (default: 5432) |
| `ALLOWED_ORIGINS` | Frontend origin for CORS |
| `ANTHROPIC_API_KEY` | Your Anthropic API key (from console.anthropic.com) |

### frontend/.env

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |
| `VITE_APP_NAME` | App display name |

## Features

- **Program selection** — 7 international scholarships and universities
- **Document checklist** — track required documents with one-click status toggle
- **Match score** — 5-criteria scoring: GPA, Language, Experience, Essay, Recommendation
- **Essay analyzer** — AI-powered analysis with 🔴🟡🟢 inline annotations in Uzbek
