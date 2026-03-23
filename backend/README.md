# Backend — FastAPI on Render

## Overview
This folder contains the FastAPI backend for the Hospital Management System, deployed on **Render**.

## Files
| File | Purpose |
|---|---|
| `main.py` | FastAPI application entry point |
| `requirements.txt` | Python dependencies |

## Local Development
```bash
# Install dependencies
pip install -r requirements.txt

# Run the dev server
uvicorn main:app --reload --port 8000
```

API docs will be available at `http://localhost:8000/docs`

## Deployment (Render)
1. Connect the repo to Render
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. The Render API token is stored in the project root `tokens` file
