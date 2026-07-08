# Mellogang Visuals React Frontend

Premium cinematic React + Vite + Tailwind frontend for the existing CodeIgniter 4 MellogangVisuals backend.

## Architecture

- Frontend: React, Vite, Tailwind, React Router, Framer Motion, lucide-react.
- Backend: CodeIgniter 4 remains intact for auth, orders, payment upload/verification, scheduling, editor progress, reports.
- Vercel deploys only `/frontend` because PHP/CodeIgniter does not run natively on Vercel.

## Vercel settings

- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

## Backend API

Scraped brand source:

- Instagram: `https://www.instagram.com/mellogangvisuals/` via public embed endpoint; extracted six latest profile thumbnails from `contextJSON`.
- Linktree: `https://linktr.ee/mellogangvisuals`
- Extracted brand: `Mellogang Visuals | Profesional Videographer`
- Extracted avatar/logo: `frontend/public/brand/mellogang-logo.png`
- Extracted social links: WhatsApp via Linktree, Instagram, YouTube, LinkedIn
- Extracted theme: Linktree `air-black`, background `#2A3236`, logo accent turquoise `#00f0c0`

Set `VITE_API_BASE_URL` to the deployed CodeIgniter base URL, for example:

```env
VITE_API_BASE_URL=https://mellogangvisuals.example.com
```

If the API is not configured, the UI falls back to mock data so the Vercel demo still shows the complete business flow.

## Local commands

```bash
npm install
npm run build
npm run dev
```

## Backend limitation

Vercel static hosting can host this React UI. The CodeIgniter 4 backend should stay on PHP-compatible hosting: existing shared hosting, Railway/Render with PHP image, VPS, or another PHP/MariaDB environment.
