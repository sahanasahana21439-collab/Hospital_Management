# Frontend — Next.js on Vercel

## Overview
This folder will contain the Next.js frontend for the Hospital Management System, deployed on **Vercel**.

> **Design approach**: HTML/CSS is prioritized wherever possible. Framework-specific styling (e.g. Tailwind) is avoided unless explicitly needed.

## Setup
The Next.js app will be initialized here when we begin frontend development.

```bash
# Initialize (will be done during frontend setup step)
npx -y create-next-app@latest ./
```

## Deployment (Vercel)
1. Connect the repo to Vercel
2. Set the root directory to `frontend/`
3. Vercel will auto-detect Next.js and configure build settings
4. The Vercel API token is stored in the project root `tokens` file
