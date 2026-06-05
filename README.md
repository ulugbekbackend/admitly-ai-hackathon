# Admitly — AI Grant Assistant

> O'zbek talabalari uchun xalqaro grant va universitetlarga ariza topshirishni osonlashtiradigan AI yordamchi platforma.

## Texnologiyalar

| Qatlam | Stack |
|---|---|
| Frontend | React 19, Vite 6, TailwindCSS v4, TanStack Query v5, Zustand, shadcn/ui |
| Backend | Django 5.2, Django REST Framework, SimpleJWT |
| AI | Google Gemini 2.0 Flash |
| Database | PostgreSQL |

## Asosiy imkoniyatlar

- **Dasturlar katalogi** — grant va universitetlar ro'yxati (filtr, qidiruv, deadline hisoblagich)
- **Ariza va hujjatlar** — dasturga ariza, hujjat checklisti, fayl yuklash (PDF/DOCX)
- **Mos kelish bali** — 5 mezon: GPA, Til bilimi, Tajriba, Esse, Tavsiya xati
- **AI esse tahlili** — Gemini AI orqali 🔴🟡🟢 rangli inline izohlar, kuchli/zaif tomonlar tahlili (o'zbek tilida)
- **Kredit tizimi** — Free (5 kredit) va Premium (100 kredit/oy) tariflar
- **Esse tarixi** — barcha tahlil natijalari saqlanadi va ko'rib chiqiladi
- **JWT autentifikatsiya** — access/refresh token, avtomatik yangilash

## Ishga tushirish

### Talablar

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+

### 1. Reponi klonlash

```bash
git clone https://github.com/ulugbekbackend/admitly-ai-hackathon.git
cd admitly-ai-hackathon
```

### 2. Backend sozlash

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

`.env` faylini yaratish:

```bash
cp .env.example .env
# .env faylini oching va DB ma'lumotlari hamda GEMINI_API_KEY ni kiriting
```

Ma'lumotlar bazasini yaratish va migratsiyalarni ishga tushirish:

```bash
psql -U postgres -c "CREATE DATABASE admitly_db;"
python manage.py migrate
python manage.py loaddata apps/programs/fixtures/programs.json
```

### 3. Frontend sozlash

```bash
cd ../frontend
npm install
cp .env.example .env
```

### 4. Ishga tushirish

```bash
# Frontend va backend bir vaqtda (frontend papkasidan)
npm run dev:all
```

Yoki alohida:

```bash
# Backend
cd backend && python manage.py runserver

# Frontend (yangi terminal)
cd frontend && npm run dev
```

| Xizmat | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000/api |
| Admin panel | http://localhost:8000/admin |

## Muhit o'zgaruvchilari

### `backend/.env`

| O'zgaruvchi | Tavsif |
|---|---|
| `SECRET_KEY` | Django maxfiy kalit (`python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`) |
| `DEBUG` | `True` (development uchun) |
| `DB_NAME` | PostgreSQL ma'lumotlar bazasi nomi |
| `DB_USER` | PostgreSQL foydalanuvchi nomi |
| `DB_PASSWORD` | PostgreSQL paroli |
| `DB_HOST` | Baza manzili (standart: `localhost`) |
| `DB_PORT` | Baza porti (standart: `5432`) |
| `ALLOWED_ORIGINS` | Frontend manzili (CORS) |
| `GEMINI_API_KEY` | Google Gemini API kaliti — [aistudio.google.com](https://aistudio.google.com/app/apikey) |
| `GEMINI_MODEL` | Gemini modeli (standart: `gemini-2.0-flash`) |
| `DJANGO_SETTINGS_MODULE` | `config.settings.development` |

### `frontend/.env`

| O'zgaruvchi | Tavsif |
|---|---|
| `VITE_API_URL` | Backend API manzili (`http://localhost:8000/api`) |
| `VITE_APP_NAME` | Ilova nomi |

## API endpointlari

```
POST   /api/auth/register/          — Ro'yxatdan o'tish
POST   /api/auth/login/             — Kirish (JWT)
POST   /api/auth/token/refresh/     — Tokenni yangilash
GET    /api/auth/me/                — Joriy foydalanuvchi
PATCH  /api/auth/me/update/         — Profilni yangilash
POST   /api/auth/upgrade/           — Premium tarifga o'tish
POST   /api/auth/buy-credits/       — Kredit sotib olish

GET    /api/programs/               — Dasturlar ro'yxati
GET    /api/programs/:id/           — Dastur tafsilotlari

GET    /api/applications/           — Arizalar ro'yxati
POST   /api/applications/           — Yangi ariza
PATCH  /api/applications/documents/:id/  — Hujjat yangilash / fayl yuklash

POST   /api/ai/analyze/             — Esse tahlili (1 kredit)
GET    /api/ai/my-essays/           — Esse tarixi
POST   /api/ai/score/               — Ariza ballini hisoblash
```

## Loyiha tuzilmasi

```
admitly/
├── backend/
│   ├── apps/
│   │   ├── accounts/     # Foydalanuvchi modeli, JWT, kredit tizimi
│   │   ├── programs/     # Grant/universitet modeli va fixture
│   │   ├── applications/ # Ariza va hujjat modeli
│   │   └── ai/           # Gemini integratsiyasi, esse tahlili
│   ├── config/           # Django sozlamalari
│   └── core/             # Permissions, pagination, exception handler
└── frontend/
    └── src/
        ├── api/          # Axios client, API funksiyalari
        ├── components/   # UI komponentlari
        ├── hooks/        # TanStack Query hooks
        ├── pages/        # Sahifalar
        └── store/        # Zustand state (auth, application)
```
