"""
Hospital Management System — Backend API
Framework: FastAPI
Hosting: Render
Update: 2026-03-25 14:00 (Triggering redeploy for auth endpoints)
"""

import os
import datetime
import psycopg2
import jwt
from typing import Optional
from psycopg2.extras import RealDictCursor
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Hospital Management System API",
    description="Backend API for the Hospital Management System",
    version="0.1.0",
)

# CORS — allow frontend origin
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://hospitalmanagement-phi.vercel.app",
    "https://hospitalmanagement-sahanasahana21439s-projects.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom CORS Fail-safe Middleware
@app.middleware("http")
async def add_cors_header(request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

# --- Database Setup ---
DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL environment variable is not set")
    conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
    conn.autocommit = True
    return conn

# --- Initialize Database ---
@app.on_event("startup")
def startup_db_init():
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        # Create users table if not exists
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL DEFAULT 'patient',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        # Create patients table if not exists
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS patients (
                id SERIAL PRIMARY KEY,
                full_name VARCHAR(255) NOT NULL,
                date_of_birth DATE NOT NULL,
                gender VARCHAR(20),
                contact_number VARCHAR(20),
                address TEXT,
                medical_history TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # Create doctors table if not exists
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS doctors (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                specialty VARCHAR(255),
                email VARCHAR(255),
                contact_number VARCHAR(20)
            );
        """)

        # Create appointments table if not exists
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS appointments (
                id SERIAL PRIMARY KEY,
                patient_name VARCHAR(255) NOT NULL,
                doctor_name VARCHAR(255) NOT NULL,
                appointment_date DATE NOT NULL,
                appointment_time TIME NOT NULL,
                contact_number VARCHAR(20),
                email_id VARCHAR(255),
                status VARCHAR(50) DEFAULT 'Scheduled',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)

        # Seed doctors if empty
        cursor.execute("SELECT COUNT(*) FROM doctors")
        count = cursor.fetchone()['count']
        if count == 0:
            cursor.execute("""
                INSERT INTO doctors (name, specialty) VALUES
                ('Dr. Sarah Smith', 'Cardiology'),
                ('Dr. Robert Jones', 'Neurology'),
                ('Dr. Jane Doe', 'Pediatrics'),
                ('Dr. Michael Wilson', 'Orthopedics')
            """)
            print("Seeded test doctors.")

        print("Database tables initialized successfully.")
        cursor.close()
    except Exception as e:
        print(f"Error initializing database: {e}")
    finally:
        if conn:
            conn.close()

# --- Security & Auth Utilities ---
SECRET_KEY = os.getenv("JWT_SECRET", "super-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

import bcrypt

def verify_password(plain_password: str, hashed_password: str):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password: str):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def create_access_token(data: dict, expires_delta: Optional[datetime.timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.datetime.utcnow() + expires_delta
    else:
        expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- Pydantic Models ---
class UserCreate(BaseModel):
    email: str
    password: str
    role: Optional[str] = "patient"

class UserLogin(BaseModel):
    email: str
    password: str

class PatientCreate(BaseModel):
    full_name: str
    date_of_birth: str
    gender: Optional[str] = None
    contact_number: Optional[str] = None
    address: Optional[str] = None
    medical_history: Optional[str] = None

class AppointmentCreate(BaseModel):
    patient_name: str
    doctor_name: str
    appointment_date: str
    appointment_time: str
    contact_number: Optional[str] = None
    email_id: Optional[str] = None

# --- Endpoints ---
@app.get("/")
def root():
    return {"message": "Hospital Management System API is running", "version": "0.2.0"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/db-test")
def db_test():
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        res = cursor.fetchone()
        cursor.close()
        return {"status": "connected", "result": res}
    except Exception as e:
        return {"status": "error", "detail": str(e)}
    finally:
        if conn:
            conn.close()

@app.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(user: UserCreate):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if user already exists
        cursor.execute("SELECT id FROM users WHERE email = %s", (user.email,))
        if cursor.fetchone():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
            
        hashed_password = get_password_hash(user.password)
        cursor.execute(
            "INSERT INTO users (email, password_hash, role) VALUES (%s, %s, %s) RETURNING id, email, role",
            (user.email, hashed_password, user.role)
        )
        new_user = cursor.fetchone()
        cursor.close()
        
        return {"message": "User created successfully", "user": {"email": new_user["email"], "role": new_user["role"]}}
    except psycopg2.Error as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
    finally:
        if conn:
            conn.close()

@app.post("/signin")
def signin(user: UserLogin):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT id, email, password_hash, role FROM users WHERE email = %s", (user.email,))
        db_user = cursor.fetchone()
        cursor.close()
        
        if not db_user or not verify_password(user.password, db_user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        access_token_expires = datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": db_user["email"], "role": db_user["role"], "id": db_user["id"]}, expires_delta=access_token_expires
        )
        
        return {
            "message": "Signed in successfully",
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": db_user["id"],
                "email": db_user["email"],
                "role": db_user["role"]
            }
        }
    except psycopg2.Error as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
    finally:
        if conn:
            conn.close()

@app.post("/patients", status_code=status.HTTP_201_CREATED)
def create_patient(patient: PatientCreate):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO patients (full_name, date_of_birth, gender, contact_number, address, medical_history)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id, full_name
            """,
            (patient.full_name, patient.date_of_birth, patient.gender, patient.contact_number, patient.address, patient.medical_history)
        )
        new_patient = cursor.fetchone()
        return {"message": "Patient registered successfully", "patient": new_patient}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error registering patient: {str(e)}"
        )
    finally:
        if conn:
            conn.close()

@app.get("/patients")
def get_patients():
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM patients ORDER BY created_at DESC LIMIT 50")
        patients = cursor.fetchall()
        cursor.close()
        return patients
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching patients: {str(e)}"
        )
    finally:
        if conn:
            conn.close()

@app.get("/doctors")
def get_doctors():
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM doctors ORDER BY name")
        doctors = cursor.fetchall()
        cursor.close()
        return doctors
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn:
            conn.close()

@app.post("/appointments", status_code=status.HTTP_201_CREATED)
def create_appointment(appointment: AppointmentCreate):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO appointments (patient_name, doctor_name, appointment_date, appointment_time, contact_number, email_id)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id
            """,
            (appointment.patient_name, appointment.doctor_name, appointment.appointment_date, appointment.appointment_time, appointment.contact_number, appointment.email_id)
        )
        new_apt = cursor.fetchone()
        return {"message": "Appointment scheduled successfully", "appointment_id": new_apt["id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error scheduling appointment: {str(e)}")
    finally:
        if conn:
            conn.close()

@app.get("/appointments")
def get_appointments():
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM appointments ORDER BY appointment_date, appointment_time LIMIT 100")
        apts = cursor.fetchall()
        cursor.close()
        return apts
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if conn:
            conn.close()
