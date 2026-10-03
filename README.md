# Nurtura AI 🌱

> **“From ‘I need a doctor’ to ‘I know my next step.’”**

Nurtura AI is a **patient-focused, assistive AI maternal & child healthcare
care-journey companion**. It helps patients prepare for care, organize
questions and documents, and stay on track — without ever acting as a doctor.

## ⚠️ Safety scope (non-negotiable)

Nurtura AI is **NOT an AI doctor**. It never:

- diagnoses
- prescribes medication
- recommends treatment
- calculates clinical risk scores
- interprets medical reports
- replaces a healthcare professional

It is **only** for: care navigation, patient preparation, organization,
communication, reminders, continuity, and consent-controlled sharing.

## ✨ Phase 1 — Prototype scaffold (this repo)

- ✅ Next.js (App Router) + TypeScript + Tailwind + ESLint
- ✅ Light premium healthcare theme (blush / lavender / teal / sky, navy text)
- ✅ Responsive app shell: sidebar (desktop) + topbar + bottom quick-nav (mobile)
- ✅ Reusable UI kit: Button, Card, Badge, Input, SafetyBanner, Section
- ✅ Routes: `/`, `/dashboard`, `/care-journey`, `/doctor-brief`, `/documents`,
  `/voice`, `/handoff`, `/caregivers`, `/follow-ups`, `/settings`
- ✅ Mock data + DB/AI abstractions (Supabase + provider-ready via env)
- ✅ APIs: `GET /api/health`, `GET /api/journey`, `POST /api/assist`
- ✅ Voice prototype via Web Speech API (browser mic + speech synthesis)
- ✅ PWA manifest + responsive layout

## 🧱 Folder architecture

```text
app/                    # App Router: layout, landing, 9 modules, APIs
  api/health|assist|journey/
  dashboard/ care-journey/ doctor-brief/ documents/
  voice/ handoff/ caregivers/ follow-ups/ settings/
components/
  ui/                   # Button, Card, Badge, Input, SafetyBanner, Section
  layout/               # AppShell, Sidebar, Topbar, MobileNav, Logo
lib/
  navigation.ts         # Nav config + app meta
  mock-data.ts          # Demo questions, visits, actions, reminders
  utils.ts              # cn(), formatDate()
  db/client.ts          # Supabase-ready abstraction (mock-backed now)
  ai/client.ts          # Provider abstraction (mock safe responder now)
public/                 # PWA manifest + icon
```

## 🚀 Run it

```bash
npm install
npm run dev      # → http://localhost:3000
npm run lint
npm run build
```

No external services required — mock data + mock AI work out of the box.

## 🔌 Going live later

Copy `.env.example` → `.env.local` and fill in:

```bash
AI_PROVIDER="mock"          # mock | openai | anthropic | custom
SUPABASE_URL=""
SUPABASE_ANON_KEY=""
```

Then swap implementations inside `lib/db/client.ts` and `lib/ai/client.ts`
without changing page/API call sites.

## 📄 License

Hackathon prototype — for demo purposes only, not a medical device.
