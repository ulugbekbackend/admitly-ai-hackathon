# Admitly — AI Grant Assistant

> O'zbek talabalari uchun xalqaro grant va universitetlarga ariza topshirishni osonlashtiradigan AI yordamchi platforma.

## Muammo va Yechim

O'zbekistonda har yili minglab talabalar xalqaro grant va universitetlarga ariza topshirishga harakat qiladi. Ammo bu jarayon juda murakkab:

- Qaysi dasturga mos ekanligini bilmaydilar
- Qanday hujjatlar kerakligini aniqlay olmaydilar
- Esse yozishda qayerda xato qilayotganini tushunmaydilar
- Har bir dastur uchun talablar boshqacha bo'ladi

**Admitly** shu muammoni hal qiladi — talabaning profili (GPA, IELTS, tajriba) asosida dasturlarga mos kelish darajasini hisoblaydi, hujjatlar ro'yxatini avtomatik tuzadi va esseni AI orqali tahlil qilib, aniq kamchilik va kuchli tomonlarni ko'rsatadi.

## Texnologiyalar

| Qatlam | Stack |
|---|---|
| Frontend | React 19, Vite 6, TailwindCSS v4, TanStack Query v5, Zustand, shadcn/ui |
| Backend | Django 5.2, Django REST Framework, SimpleJWT |
| AI | Google Gemini 2.0 Flash |
| Database | PostgreSQL |

## Asosiy imkoniyatlar

### Foydalanuvchi uchun
- **Dasturlar katalogi** — 7 ta xalqaro grant va universitetlar ro'yxati: DAAD, Chevening, Fulbright, Erasmus+ va boshqalar. Filtr (grant/universitet), qidiruv, deadline hisoblagich
- **Profil va ball** — GPA, IELTS, ish tajribasi kiritiladi; tizim avtomatik mos kelish foizini hisoblaydi
- **Ariza va hujjat checklisti** — dasturga ariza yaratiladi, kerakli hujjatlar ro'yxati avtomatik tuziladi, fayl yuklash (PDF/DOCX)
- **AI esse tahlili** — esse matnini kiritasiz, Gemini AI o'zbek tilida tahlil qiladi: umumiy ball (0–100), inline rangli izohlar (🔴 jiddiy, 🟡 tavsiya, 🟢 kuchli), yetishmayotgan elementlar, umumiy xulosa
- **Esse tarixi** — barcha tahlillar saqlanib, istalgan vaqt ko'rib chiqiladi
- **Kredit tizimi** — ro'yxatdan o'tishda 5 ta bepul kredit; Premium (100 kredit/oy) yoki kredit to'plamlari sotib olish imkoniyati

### Texnik
- REST API bilan to'liq ajratilgan arxitektura (Django + React)
- JWT autentifikatsiya: access token (1 soat) + refresh token (7 kun), avtomatik yangilash
- Gemini API ga parallel so'rovlarda kredit sarfi race condition dan himoyalangan (atomic F() update)
- Fayl yuklash: `multipart/form-data`, 10 MB chegara, PDF/DOC/DOCX validatsiya
- Rate limiting: esse tahlili 30 marta/kun (foydalanuvchi bo'yicha)
- Barcha sahifalar responsive dizayn

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
│   │   ├── applications/ # Ariza va hujjat modeli, fayl yuklash
│   │   └── ai/           # Gemini integratsiyasi, esse tahlili servisi
│   ├── config/           # Django sozlamalari (split: base/dev/prod)
│   └── core/             # IsOwner permission, pagination, exception handler
└── frontend/
    └── src/
        ├── api/          # Axios client (JWT interceptor), API funksiyalari
        ├── components/   # UI: layout, checklist, essay, dashboard, pricing
        ├── hooks/        # TanStack Query hooks (server state)
        ├── pages/        # Sahifalar: Landing, Dashboard, Programs, Essay...
        └── store/        # Zustand: auth token, active application

```

## Qo'llanilgan dasturlar (Fixture)

| Dastur | Mamlakat | Tur |
|---|---|---|
| DAAD Research Grant | Germaniya | Grant |
| Chevening Scholarship | Buyuk Britaniya | Grant |
| Fulbright Program | AQSh | Grant |
| Erasmus+ | Yevropa | Grant |
| Bologna University | Italiya | Universitet |
| University of Warsaw | Polsha | Universitet |
| Nazarbayev University | Qozog'iston | Universitet |

## Skrinshot

| Sahifa | Tavsif |
|---|---|
| Landing | Loyiha taqdimoti, kirish/ro'yxat tugmalari |
| Dashboard | Mos kelish bali, hujjat holati, vazifalar |
| Dasturlar | Katalog, filtr, qidiruv, deadline |
| Hujjatlar | Checklist, fayl yuklash, holat o'zgartirish |
| Esse tahlili | Matn kiritish, AI tahlil, rangli izohlar |
| Mening esseylarim | Tarix, batafsil natijalar |
| Tariflar | Free/Premium, kredit to'plamlari |
| Profil | GPA, IELTS, tajriba, ism |
