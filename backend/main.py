"""
Hospital Management System — Backend API
Framework: FastAPI
Hosting: Render
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Hospital Management System API",
    description="Backend API for the Hospital Management System",
    version="0.1.0",
)

# CORS — allow frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict to Vercel domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Hospital Management System API is running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/signup")
def signup(email: str):
    return {"message": "User created successfully", "email": email}

@app.post("/signin")
def signin(email: str):
    return {"message": "Signed in successfully", "token": "mock_jwt_token"}
