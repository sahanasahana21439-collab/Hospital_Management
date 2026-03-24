-- ============================================
-- Hospital Management System — Database Schema
-- Database: Neon PostgreSQL
-- ============================================

-- Schema will be added as we design tables
-- (patients, doctors, appointments, etc.)

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'patient',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
