# Ascent — Student Career & Placement Portal

A modern, full-stack career development and hiring platform connecting university students with employers. Built with a high-performance **FastAPI** asynchronous backend and a sleek **React 19 + Vite** frontend styled with the custom **Apex Slate** dark design system.

---

## ⚡ Highlights & Features

### 🎓 For Students
- **Job Discovery & Search**: Filter by job type (Full-time, Internship, Part-time, Contract), location, remote availability, and keywords.
- **One-Click Application**: Apply with uploaded resumes (PDF) and cover letters or save profile-default resumes.
- **Application Pipeline**: Track real-time application states (*Applied*, *Reviewing*, *Interview*, *Accepted*, *Rejected*).
- **Profile Management**: Maintain academic records, skills, portfolio links, and resume documents.

### 🏢 For Employers
- **Job Posting & Management**: Publish, edit, and toggle status on job listings with custom salary ranges, deadlines, and requirements.
- **Interactive ATS Kanban**: Drag-and-drop or status-driven applicant tracking board to advance candidates through review pipelines.
- **Candidate Profiles**: Review applicant credentials, cover letters, and inspect uploaded PDF resumes.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, React Router 7, Tailwind CSS, Lucide Icons |
| **Backend** | Python 3.12+, FastAPI, SQLAlchemy 2 (Asyncio), Pydantic v2 |
| **Database** | PostgreSQL, asyncpg, Alembic (migrations) |
| **Auth & Security** | JWT (python-jose), Password hashing (bcrypt) |
| **Package Managers** | `uv` (Python), `npm` (Node.js) |

---

## 📁 Repository Structure

```text
├── backend/
│   ├── alembic/              # Database migration scripts
│   ├── app/
│   │   ├── models/           # SQLAlchemy ORM models (User, Job, Company, Application)
│   │   ├── routers/          # API route handlers (auth, jobs, applications, uploads, users)
│   │   ├── schemas/          # Pydantic request/response schemas
│   │   ├── services/         # Business logic
│   │   ├── database.py       # Async engine & session setup
│   │   └── main.py           # FastAPI entrypoint & middleware
│   ├── pyproject.toml        # Backend dependencies & metadata (uv)
│   └── seed.py               # Database seeder with sample data
│
├── frontend/
│   ├── src/
│   │   ├── api/              # Axios / Fetch client services
│   │   ├── components/       # Reusable UI components & layouts (Navbar, Footer, ProtectedRoute)
│   │   ├── contexts/         # AuthContext & global state
│   │   ├── pages/            # Application views (Landing, Jobs, JobDetail, ATS, Dashboard)
│   │   └── index.css         # Apex Slate theme & design tokens
│   ├── package.json          # Frontend scripts & dependencies
│   └── vite.config.ts        # Vite configuration & path aliases
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18+) & **npm**
- **Python** (3.12+) & [**uv**](https://github.com/astral-sh/uv)
- **PostgreSQL** running locally or via Docker

---

### 1. Backend Setup

1. Navigate to `backend/`:
   ```bash
   cd backend
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your PostgreSQL credentials & JWT secret
   ```

3. Run migrations and seed data:
   ```bash
   uv run alembic upgrade head
   uv run python seed.py
   ```

4. Start the backend server:
   ```bash
   uv run uvicorn app.main:app --reload --port 8000
   ```
   - API: [http://localhost:8000](http://localhost:8000)
   - Interactive Swagger Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 2. Frontend Setup

1. Navigate to `frontend/`:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   - App: [http://localhost:5173](http://localhost:5173)

---

## 🔐 Environment Variables (`backend/.env`)

```ini
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/career_portal
JWT_SECRET=your_super_secret_key_here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
CORS_ORIGINS=["http://localhost:5173"]
UPLOAD_DIR=uploads
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
