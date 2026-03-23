---
description: How to set up and deploy the FastAPI backend on Render
---

# Backend Setup — FastAPI on Render

## Prerequisites
- Python 3.11+
- Render account at [render.com](https://render.com)
- Render API token (stored in project root `tokens` file)

## Local Development

### 1. Create Virtual Environment
```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate  # macOS/Linux
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Create `.env` File
```env
DATABASE_URL=postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname
```

### 4. Run Dev Server
```bash
uvicorn main:app --reload --port 8000
```
- API: `http://localhost:8000`
- Docs: `http://localhost:8000/docs`

## Deploy to Render

### 1. Create Web Service
- Go to Render Dashboard → New → Web Service
- Connect your GitHub repo
- Set root directory to `backend/`

### 2. Configure
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Environment**: Add `DATABASE_URL` as an env variable

## Files
| File | Purpose |
|---|---|
| `backend/main.py` | FastAPI app entry point |
| `backend/requirements.txt` | Python dependencies |
| `backend/README.md` | Setup docs |
