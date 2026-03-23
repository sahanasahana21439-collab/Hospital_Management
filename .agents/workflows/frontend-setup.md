---
description: How to set up and deploy the Next.js frontend on Vercel
---

# Frontend Setup — Next.js on Vercel

## Prerequisites
- Node.js 18+
- Vercel account at [vercel.com](https://vercel.com)
- Vercel API token (stored in project root `tokens` file)

## Design Approach
- **Prioritize HTML/CSS** for styling — avoid Tailwind unless explicitly needed
- Use vanilla CSS files (e.g., `globals.css`, component-level `.css` files)
- Keep components clean and semantic

## Initialize the App
```bash
cd frontend
npx -y create-next-app@latest ./ --no-tailwind --no-eslint --src-dir --app --no-import-alias
```

## Local Development
```bash
npm run dev
```
- App: `http://localhost:3000`

## Deploy to Vercel

### 1. Connect to Vercel
```bash
npx -y vercel --token <VERCEL_TOKEN>
```

### 2. Production Deploy
```bash
npx -y vercel --prod --token <VERCEL_TOKEN>
```

### 3. Via Dashboard
- Go to [vercel.com/dashboard](https://vercel.com/dashboard)
- Import the GitHub repo
- Set root directory to `frontend/`
- Vercel auto-detects Next.js

## Files
| File | Purpose |
|---|---|
| `frontend/README.md` | Setup docs |
| (more files after `create-next-app`) | |
