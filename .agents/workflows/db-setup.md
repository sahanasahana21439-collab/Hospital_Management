---
description: How to set up and manage the Neon PostgreSQL database
---

# Database Setup — Neon PostgreSQL

## Prerequisites
- Neon account at [neon.tech](https://neon.tech)
- Neon API token (stored in project root `tokens` file)

## Steps

### 1. Create a Neon Project
- Log in to [Neon Console](https://console.neon.tech)
- Create a new project named `hospital-management`
- Copy the connection string (will look like `postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname`)

### 2. Configure Connection
- Store the connection string as an environment variable: `DATABASE_URL`
- For backend, add it to a `.env` file in `backend/`

### 3. Run Schema
```bash
# Using psql with Neon connection string
psql "$DATABASE_URL" -f db/schema.sql
```

### 4. Schema Updates
- All schema changes go in `db/schema.sql`
- For incremental changes, create migration files: `db/migrations/001_description.sql`

## Files
| File | Purpose |
|---|---|
| `db/schema.sql` | Full database schema |
| `db/README.md` | Setup instructions |
