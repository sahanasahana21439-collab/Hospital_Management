# 🏥 Hospital Management System — Detailed Code Explanation

This document provides a **line-by-line explanation** of every source code file in the Hospital Management System. It is organized by layer: Backend → Frontend (Pages) → Frontend (Components) → Context & Utilities.

---

## TABLE OF CONTENTS

1. [Backend — `main.py`](#1-backend--mainpy)
2. [Frontend — `page.js` (Login / Signup)](#2-frontend--pagejs-login--signup)
3. [Frontend — `dashboard/page.js` (Main Dashboard)](#3-frontend--dashboardpagejs-main-dashboard)
4. [Frontend — `ThemeContext.js`](#4-frontend--themecontextjs)
5. [Frontend — `ThemeToggle.js`](#5-frontend--themetogglejs)
6. [Frontend — `RegisterPatient.js`](#6-frontend--registerpatientjs)
7. [Frontend — `NewAppointment.js`](#7-frontend--newappointmentjs)
8. [Frontend — `PatientList.js`](#8-frontend--patientlistjs)
9. [Frontend — `DoctorList.js`](#9-frontend--doctorlistjs)
10. [Frontend — `AppointmentList.js`](#10-frontend--appointmentlistjs)
11. [Frontend — `BillingList.js`](#11-frontend--billinglistjs)
12. [Frontend — `GenerateReport.js`](#12-frontend--generatereportjs)
13. [Frontend — `SettingsView.js`](#13-frontend--settingsviewjs)
14. [Database — `schema.sql`](#14-database--schemasql)

---

## 1. Backend — `main.py`

**Path:** `backend/main.py`  
**Language:** Python  
**Framework:** FastAPI  
**Purpose:** This is the **entire backend server** — it handles authentication, database initialization, and all REST API endpoints.

### 1.1 Imports & Setup (Lines 1–19)

```python
import os, datetime, psycopg2, jwt
from typing import Optional
from psycopg2.extras import RealDictCursor
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()
app = FastAPI(title="Hospital Management System API", version="0.1.0")
```

**Explanation:**
- `os` — Reads environment variables like `DATABASE_URL` and `JWT_SECRET`.
- `psycopg2` — PostgreSQL database adapter; connects Python to the Neon database.
- `RealDictCursor` — Returns database rows as Python dictionaries (key-value) instead of tuples.
- `jwt` (PyJWT) — Encodes and decodes JSON Web Tokens for authentication.
- `FastAPI` — The web framework that creates the REST API server.
- `CORSMiddleware` — Allows the Vercel frontend (different domain) to call this API.
- `BaseModel` (Pydantic) — Validates incoming request data (like patient name, email).
- `load_dotenv()` — Loads secrets from the `.env` file into `os.environ`.

### 1.2 CORS Configuration (Lines 27–50)

```python
origins = [
    "http://localhost:3000",
    "https://hospitalmanagement-phi.vercel.app",
]
app.add_middleware(CORSMiddleware, allow_origins=origins, ...)
```

**Explanation:**
- **CORS (Cross-Origin Resource Sharing)** is a browser security feature that blocks API calls from a different domain.
- Since the frontend is on `vercel.app` and the backend is on `onrender.com`, we must explicitly whitelist the frontend's domain.
- Without this, the browser would block all `fetch()` calls from the frontend to the backend.

### 1.3 Database Connection (Lines 52–60)

```python
DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
    conn.autocommit = True
    return conn
```

**Explanation:**
- `DATABASE_URL` is the connection string to the Neon PostgreSQL cloud database. It looks like: `postgresql://user:password@host/dbname?sslmode=require`
- `get_db_connection()` creates a new database connection each time it's called.
- `autocommit = True` means every SQL statement is automatically saved (committed) without needing to call `conn.commit()`.
- `RealDictCursor` makes query results accessible by column name (e.g., `row['email']`) instead of index.

### 1.4 Database Initialization (Lines 62–154)

```python
@app.on_event("startup")
def startup_db_init():
    cursor.execute("CREATE TABLE IF NOT EXISTS users (...)")
    cursor.execute("CREATE TABLE IF NOT EXISTS patients (...)")
    cursor.execute("CREATE TABLE IF NOT EXISTS doctors (...)")
    cursor.execute("CREATE TABLE IF NOT EXISTS billing (...)")
```

**Explanation:**
- `@app.on_event("startup")` — This function runs **once** when the server starts.
- It creates all 5 database tables if they don't already exist.
- It also **seeds test data** for doctors and billing records (inserts sample rows).
- The `DROP TABLE IF EXISTS doctors` ensures doctors are re-created fresh on each startup with the latest schema.

### 1.5 Security Utilities (Lines 156–178)

```python
import bcrypt

def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def create_access_token(data, expires_delta=None):
    to_encode = data.copy()
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
```

**Explanation:**
- **bcrypt** is a one-way hashing algorithm. When a user signs up, their password is converted to a hash (e.g., `$2b$12$...`). The original password cannot be recovered from the hash.
- `verify_password()` checks if a login password matches the stored hash.
- `get_password_hash()` generates a new hash with a random salt (extra random characters added before hashing for security).
- `create_access_token()` creates a **JWT token** containing the user's email, role, and an expiration time. This token is sent to the frontend and stored in `localStorage`.

### 1.6 Pydantic Models (Lines 180–205)

```python
class UserCreate(BaseModel):
    email: str
    password: str
    role: Optional[str] = "patient"

class PatientCreate(BaseModel):
    full_name: str
    date_of_birth: str
    gender: Optional[str] = None
```

**Explanation:**
- Pydantic models define the **expected shape of incoming JSON data**.
- When the frontend sends `POST /patients` with `{ "full_name": "John", ... }`, FastAPI automatically validates the data against `PatientCreate`.
- If a required field is missing, FastAPI returns a `422 Validation Error` without the endpoint code ever running.
- `Optional[str] = None` means the field is not required and defaults to `None` if omitted.

### 1.7 Authentication Endpoints (Lines 232–305)

#### POST `/signup`
```python
@app.post("/signup", status_code=201)
def signup(user: UserCreate):
    cursor.execute("SELECT id FROM users WHERE email = %s", (user.email,))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    cursor.execute("INSERT INTO users (email, password_hash, role) VALUES (%s, %s, %s) RETURNING id, email, role", ...)
```

**Flow:**
1. Check if email already exists in database → if yes, return error.
2. Hash the password using bcrypt.
3. Insert the new user into the `users` table.
4. Return success message with user details.

#### POST `/signin`
```python
@app.post("/signin")
def signin(user: UserLogin):
    cursor.execute("SELECT id, email, password_hash, role FROM users WHERE email = %s", ...)
    if not db_user or not verify_password(user.password, db_user["password_hash"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    access_token = create_access_token(data={"sub": db_user["email"], "role": db_user["role"]})
    return {"access_token": access_token, "token_type": "bearer"}
```

**Flow:**
1. Look up user by email in the database.
2. If user not found or password doesn't match the hash → return 401 Unauthorized.
3. Generate a JWT token with the user's email and role embedded.
4. Return the token to the frontend.

### 1.8 Data CRUD Endpoints (Lines 307–403)

#### POST `/patients` — Register a New Patient
- Receives patient data from the frontend form.
- Executes `INSERT INTO patients (...)` SQL query.
- Returns the new patient's ID and name.

#### GET `/patients` — Fetch All Patients
- Executes `SELECT * FROM patients ORDER BY created_at DESC LIMIT 50`.
- Returns a JSON array of all patient records.

#### GET `/doctors` — Fetch All Doctors
- Executes `SELECT * FROM doctors ORDER BY name`.
- Returns a JSON array of all doctor records.

#### POST `/appointments` — Schedule an Appointment
- Receives appointment details (patient, doctor, date, time).
- Executes `INSERT INTO appointments (...)`.
- Returns the new appointment ID.

#### GET `/appointments` — Fetch All Appointments
- Executes `SELECT * FROM appointments ORDER BY appointment_date, appointment_time`.
- Returns a JSON array sorted by date and time.

#### GET `/billing` — Fetch All Billing Records
- Executes `SELECT * FROM billing ORDER BY created_at DESC`.
- Returns all invoice records.

### 1.9 Report Summary Endpoint (Lines 421–457)

```python
@app.get("/reports/summary")
def get_report_summary():
    cursor.execute("SELECT COUNT(*) FROM patients")
    patients_count = cursor.fetchone()['count']
    
    cursor.execute("SELECT COUNT(*) FROM doctors")
    doctors_count = cursor.fetchone()['count']
    
    cursor.execute("SELECT COUNT(*) FROM appointments WHERE status = 'Scheduled'")
    appointments_count = cursor.fetchone()['count']
    
    cursor.execute("SELECT SUM(amount) as total FROM billing WHERE status = 'Paid'")
    total_revenue = float(rev) if rev else 0.0
    
    return {
        "total_patients": patients_count,
        "total_doctors": doctors_count,
        "scheduled_appointments": appointments_count,
        "total_revenue": total_revenue,
    }
```

**Explanation:**
- This is the **single most important endpoint** for the dashboard.
- It runs 4 separate SQL aggregate queries to calculate live totals.
- `COUNT(*)` counts total rows. `SUM(amount)` adds up all paid invoices.
- The dashboard frontend calls this endpoint on every page load and after every successful form submission to keep the stat cards synchronized.

---

## 2. Frontend — `page.js` (Login / Signup)

**Path:** `frontend/src/app/page.js`  
**Language:** JavaScript (React/Next.js)  
**Purpose:** The **landing page** — handles user authentication (sign in and sign up).

### Key Concepts

```javascript
"use client";  // Tells Next.js this is a Client Component (runs in browser, not server)

const [isSignIn, setIsSignIn] = useState(true);   // Toggle between Login and Signup forms
const [email, setEmail] = useState("");            // Stores the email input value
const [password, setPassword] = useState("");      // Stores the password input value
const [statusMessage, setStatusMessage] = useState("");  // Success or error messages
```

**Explanation:**
- `useState` is a React Hook that creates "reactive" variables. When their value changes, the UI automatically re-renders.
- `"use client"` is a Next.js directive needed because this component uses browser APIs (`localStorage`, `fetch`).

### Sign In Flow

```javascript
const handleSignIn = async (e) => {
    e.preventDefault();                              // Prevent browser page reload
    const res = await fetch(`${apiUrl}/signin`, {    // Call backend API
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })     // Send credentials as JSON
    });
    const data = await res.json();
    if (res.ok) {
        localStorage.setItem("token", data.access_token);  // Save JWT token
        router.push("/dashboard");                         // Navigate to Dashboard
    } else {
        setStatusMessage(data.detail || "Sign in failed"); // Show error
    }
};
```

**Step-by-step:**
1. User fills email + password and clicks "Sign In".
2. `handleSignIn` sends a `POST /signin` request to the backend.
3. Backend verifies credentials and returns a JWT token.
4. Token is saved in `localStorage` (browser's persistent storage).
5. User is redirected to `/dashboard`.

### Sign Up Flow
- Similar to Sign In, but calls `POST /signup`.
- On success, it switches the form back to Sign In mode so the user can log in with the new account.

---

## 3. Frontend — `dashboard/page.js` (Main Dashboard)

**Path:** `frontend/src/app/dashboard/page.js`  
**Language:** JavaScript (React/Next.js)  
**Purpose:** The **heart of the application** — a Single Page Application (SPA) that manages all modules through tab switching.

### State Variables

```javascript
const [activeTab, setActiveTab] = useState("dashboard");    // Current visible module
const [dashboardStats, setDashboardStats] = useState({      // Live statistics from API
    patients: 0, appointments: 0, doctors: 0, revenue: 0,
});
const [recentAppointments, setRecentAppointments] = useState([]);  // Recent appointments table
```

### Authentication Guard

```javascript
useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        router.push("/");   // No token? Redirect to login page
        return;
    }
    const payloadBase64 = token.split('.')[1];            // JWT has 3 parts: header.payload.signature
    const decodedPayload = JSON.parse(atob(payloadBase64)); // Decode Base64 payload
    setUserEmail(decodedPayload.sub || "User");             // Extract email from token
    fetchStats();                                           // Fetch live data from API
}, [router]);
```

**Explanation:**
- `useEffect` runs once when the component mounts (page loads).
- It checks if a JWT token exists in `localStorage`. If not, it forces the user back to the login page.
- It decodes the JWT token to extract the user's email for display.
- It calls `fetchStats()` to load live dashboard data from the backend.

### Live Data Fetching

```javascript
const fetchStats = async () => {
    const response = await fetch(`${apiUrl}/reports/summary`);
    if (response.ok) {
        const data = await response.json();
        setDashboardStats({
            patients: data.total_patients,
            appointments: data.scheduled_appointments,
            doctors: data.total_doctors,
            revenue: data.total_revenue,
        });
    }
    
    const aptResponse = await fetch(`${apiUrl}/appointments`);
    if (aptResponse.ok) {
        const aptData = await aptResponse.json();
        setRecentAppointments(aptData.slice(0, 5));  // Show only 5 most recent
    }
};
```

**Explanation:**
- Calls `GET /reports/summary` to get aggregate counts.
- Calls `GET /appointments` to populate the "Recent Appointments" table.
- `slice(0, 5)` takes only the first 5 records.
- This function is called on page load AND after every new appointment/patient is created (real-time sync).

### Tab Routing (SPA Pattern)

```javascript
{activeTab === 'dashboard' && <DashboardContent />}
{activeTab === 'patients' && <PatientList />}
{activeTab === 'doctors' && <DoctorList />}
{activeTab === 'appointments' && <AppointmentList />}
{activeTab === 'billing' && <BillingList />}
{activeTab === 'settings' && <SettingsView />}
```

**Explanation:**
- Instead of navigating to different URLs, the dashboard uses **conditional rendering**.
- Only the component matching `activeTab` is rendered, all others are hidden.
- Clicking a sidebar button changes `activeTab`, which triggers React to swap the visible component.

### Revenue Currency Formatting

```javascript
value: `₹${parseFloat(dashboardStats.revenue).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
```

**Explanation:**
- `parseFloat()` ensures the revenue value is a number.
- `toLocaleString('en-IN')` formats the number in Indian numbering system (lakhs/crores).
- `₹` prefix displays the Indian Rupee symbol.
- Example: `4450` → `₹4,450.00`

---

## 4. Frontend — `ThemeContext.js`

**Path:** `frontend/src/context/ThemeContext.js`  
**Purpose:** Manages the global Light/Dark theme state using React Context API.

```javascript
const ThemeContext = createContext();  // Creates a shared state container

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark');  // Default theme is dark

    useEffect(() => {
        const savedTheme = localStorage.getItem('hospital-theme') || 'dark';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('hospital-theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
```

**Explanation:**
- **React Context** is a way to share state across all components without passing props manually.
- `ThemeProvider` wraps the entire app in `layout.js`, making `theme` and `toggleTheme` available everywhere.
- `localStorage.getItem('hospital-theme')` persists the user's theme choice across browser sessions.
- `document.documentElement.setAttribute('data-theme', ...)` sets a CSS attribute on the `<html>` tag, which activates the corresponding CSS variable set (dark or light colors).

---

## 5. Frontend — `ThemeToggle.js`

**Path:** `frontend/src/components/ThemeToggle.js`  
**Purpose:** A button component that switches between ☀️ (Sun) and 🌙 (Moon) icons.

```javascript
const { theme, toggleTheme } = useTheme();  // Access global theme state

return (
    <button onClick={toggleTheme}>
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
);
```

**Explanation:**
- Uses the `useTheme()` hook to read the current theme and get the toggle function.
- Renders an SVG sun icon in dark mode (click to switch to light) and a moon icon in light mode (click to switch to dark).
- The button has hover effects: translateY(-2px) lift, border color change, and color transition.

---

## 6. Frontend — `RegisterPatient.js`

**Path:** `frontend/src/components/RegisterPatient.js`  
**Purpose:** A modal form for registering new patients in the system.

### Key Logic

```javascript
const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${apiUrl}/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            full_name: formData.fullName,
            date_of_birth: formData.dateOfBirth,
            gender: formData.gender,
            contact_number: formData.contactNumber,
            address: formData.address,
            medical_history: formData.medicalHistory,
        }),
    });
    if (res.ok) {
        onSuccess("Patient registered successfully!");  // Notify parent dashboard
        onClose();                                       // Close the modal
    }
};
```

**Explanation:**
- Collects 6 form fields: Full Name, DOB, Gender, Contact, Address, Medical History.
- Sends them as JSON to `POST /patients` on the backend.
- On success, calls `onSuccess()` which triggers the dashboard to show a green notification and call `fetchStats()` to update the "Total Patients" counter in real-time.

---

## 7. Frontend — `NewAppointment.js`

**Path:** `frontend/src/components/NewAppointment.js`  
**Purpose:** Modal form for scheduling new appointments with doctor selection.

### Key Logic

```javascript
useEffect(() => {
    const fetchDoctors = async () => {
        const res = await fetch(`${apiUrl}/doctors`);
        const data = await res.json();
        setDoctors(data);  // Populate the doctor dropdown
    };
    fetchDoctors();
}, []);
```

**Explanation:**
- When the modal opens, it immediately fetches the list of doctors from `GET /doctors`.
- The doctor names are displayed in a `<select>` dropdown.
- When submitted, it calls `POST /appointments` with the patient name, selected doctor, date, time, contact, and email.
- On success, calls `onSuccess()` → dashboard refreshes stats → Appointment counter increments.

---

## 8. Frontend — `PatientList.js`

**Path:** `frontend/src/components/PatientList.js`  
**Purpose:** Displays a searchable directory of all registered patients.

### Key Logic

```javascript
useEffect(() => {
    const fetchPatients = async () => {
        const res = await fetch(`${apiUrl}/patients`);
        const data = await res.json();
        setPatients(data);
    };
    fetchPatients();
}, []);

const filteredPatients = patients.filter(p =>
    p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.contact_number?.includes(searchTerm)
);
```

**Explanation:**
- Fetches all patients from `GET /patients` on component mount.
- Implements **client-side search filtering** — as the user types in the search box, the list instantly filters by name or phone number without making additional API calls.
- Each row shows: Initial (first letter), Name, DOB, Gender, Contact, Medical History, and "View Details" button.

---

## 9. Frontend — `DoctorList.js`

**Path:** `frontend/src/components/DoctorList.js`  
**Purpose:** Displays the doctor roster with specialty and availability status.

### Key Logic
- Fetches doctors from `GET /doctors`.
- Shows each doctor in a card/table format with: Name, Specialty, Email, Contact, Date of Joining, Availability.
- Availability is shown as a colored badge: 🟢 Available, 🟡 On Call, 🔴 On Leave.
- Real-time search by name or specialty.

---

## 10. Frontend — `AppointmentList.js`

**Path:** `frontend/src/components/AppointmentList.js`  
**Purpose:** Displays the full appointment schedule with 7 distinct columns.

### Key Columns
| Column | Source Field |
|---|---|
| Patient | `patient_name` |
| Doctor | `doctor_name` |
| Date | `appointment_date` |
| Time | `appointment_time` |
| Status | `status` (Scheduled / Completed / Cancelled) |
| Contact | `contact_number` |
| Email | `email_id` |

**Explanation:**
- Fetches from `GET /appointments`.
- Status is displayed as a colored badge with distinct styling per state.
- Supports real-time search across all fields.

---

## 11. Frontend — `BillingList.js`

**Path:** `frontend/src/components/BillingList.js`  
**Purpose:** Manages financial invoices with revenue summary analytics.

### Key Features
- **Summary Cards**: Total Revenue (sum of paid), Pending Invoices (count), Collection Rate (percentage).
- **Invoice Table**: Patient Name, Description, Amount (₹), Status, Payment Method, Date.
- Status badges: 🟢 Paid, 🟡 Pending, 🔴 Overdue.
- Real-time search filtering.

---

## 12. Frontend — `GenerateReport.js`

**Path:** `frontend/src/components/GenerateReport.js`  
**Purpose:** Analytics modal showing real-time summary statistics from the database.

### Key Logic

```javascript
useEffect(() => {
    const fetchReport = async () => {
        const res = await fetch(`${apiUrl}/reports/summary`);
        const data = await res.json();
        setReportData(data);
    };
    fetchReport();
}, [isOpen]);
```

**Explanation:**
- When the report modal opens, it fetches live data from `GET /reports/summary`.
- Displays: Total Patients, Total Doctors, Scheduled Appointments, Total Revenue.
- Shows the report generation timestamp.
- Premium card-based layout with themed styling.

---

## 13. Frontend — `SettingsView.js`

**Path:** `frontend/src/components/SettingsView.js`  
**Purpose:** Enterprise-grade system configuration panel with 4 sections.

### Sections

| Tab | Contents |
|---|---|
| 👤 Profile Information | Full Name, Email, Role/Department, Contact Number inputs |
| 🎨 App Preferences | Language selector, Timezone selector, Auto-backup toggle, Compact mode toggle |
| 🔔 Notifications | Email alerts toggle, SMS notifications toggle |
| 🛡️ Security & Access | 2FA toggle, Change Password form (3 fields), Danger Zone (Delete Account) |

### Key Design Pattern
- Uses a **side navigation** (`activeSection` state) to switch between the 4 tabs.
- All settings are rendered in a **bordered list layout** — label on the left, input on the right — for a professional, enterprise SaaS appearance.
- Toggle switches use a custom CSS-styled `<button>` that changes color and position on click.

---

## 14. Database — `schema.sql`

**Path:** `db/schema.sql`  
**Purpose:** SQL definitions for all database tables.

```sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,              -- Auto-incrementing unique ID
    email VARCHAR(255) UNIQUE NOT NULL,  -- Login email (must be unique)
    password_hash VARCHAR(255) NOT NULL, -- bcrypt hashed password
    role VARCHAR(50) DEFAULT 'patient',  -- User role (admin or patient)
    created_at TIMESTAMP DEFAULT NOW()   -- Account creation timestamp
);

CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20),
    contact_number VARCHAR(20),
    address TEXT,                        -- Can hold long address strings
    medical_history TEXT,                -- Can hold detailed medical notes
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS doctors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(255),             -- e.g., Cardiology, Neurology
    email VARCHAR(255),
    contact_number VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    patient_name VARCHAR(255) NOT NULL,
    doctor_name VARCHAR(255) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    contact_number VARCHAR(20),
    email_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Scheduled',  -- Scheduled / Completed / Cancelled
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Explanation:**
- `SERIAL PRIMARY KEY` auto-generates a unique integer ID for each new row.
- `VARCHAR(n)` limits string length to `n` characters.
- `TEXT` allows unlimited-length strings (used for addresses and medical history).
- `DEFAULT` sets automatic values when none are provided.
- `IF NOT EXISTS` prevents errors if the table already exists.

---

## Summary: Code Flow for a Typical User Session

```
1. User opens https://hospitalmanagement-phi.vercel.app
2. page.js renders the Login/Signup form
3. User enters email + password → clicks "Sign In"
4. fetch() sends POST /signin → Backend verifies with bcrypt
5. Backend returns JWT token → Stored in localStorage
6. router.push("/dashboard") → dashboard/page.js loads
7. useEffect() checks token → decodes email → calls fetchStats()
8. fetchStats() calls GET /reports/summary → Backend queries PostgreSQL
9. Dashboard stat cards populate with live data (4 patients, 8 appointments, etc.)
10. User clicks "Patients" tab → activeTab changes → PatientList renders
11. PatientList calls GET /patients → Displays searchable table
12. User clicks "+ New Appointment" → NewAppointment modal opens
13. Modal calls GET /doctors → Populates dropdown → User fills form
14. Submit calls POST /appointments → Backend inserts into PostgreSQL
15. onSuccess() triggers fetchStats() → Stat cards update instantly
16. User clicks "Logout" → Token removed → Redirected to login page
```

---

**Document prepared for: Project Report & PPT Presentation**  
**Author:** Sahana | **Date:** March 2026
