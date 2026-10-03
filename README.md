# Nurtura AI 🌱

> **“From ‘I need a doctor’ to ‘I know my next step.’”**

Nurtura AI is a **patient-focused, assistive maternal & child healthcare
care-journey companion** for fictional demo patient **Ananya**. It helps
patients prepare for care, organize questions and documents, and stay on
track — without ever acting as a doctor.

## ⚠️ Safety scope (non-negotiable)

Nurtura AI is **NOT an AI doctor**. A central gate
(`lib/safety/policy.ts` → `validateAIResponse()`) screens every AI-shaped
output. The system **blocks**: diagnosis · treatment recommendations ·
prescriptions · clinical risk scoring · medical interpretation · autonomous
clinical decisions.

It is **only** for: care navigation · organization · summarization of
patient-provided non-clinical information · appointment preparation ·
reminders · question organization · administrative document extraction ·
multilingual interaction.

## ✨ Features

| Route | Module |
|---|---|
| `/dashboard` | Welcome, journey progress, “I Need a Doctor” CTA, quick actions, appointment card, timeline, floating Care Navigator |
| `/care-journey` | Longitudinal Care Journey Memory — filterable timeline, add-event modal, detail panel, progress, “Ask my journey” recall |
| `/doctor-brief` | Conversational intake → saved questions → documents → journey refs → printable, patient-approved Visit Brief |
| `/documents` | Upload (PDF/image) → “Organizing…” → admin-only extraction → confirm-before-adding → journey event + reminders |
| `/voice` | Trilingual (EN/தமிழ்/हिन्दी) mic + transcript + 9-intent navigator with routing + TTS + clinical boundary |
| `/handoff` | Consent-ticked 24h passport: link + QR + PDF + revoke + audit; receiver at `/handoff/[token]` sees only scoped sections |
| `/caregivers` | Partner/Parent/Family circle, per-person permissions, invite simulation, activity log |
| `/follow-ups` | Upcoming / Due soon / Completed board, prep checklists, snooze/reschedule, Next Care Step |
| `/settings` | Language, provider status, global consent controls |

Plus: Demo Mode guide (header badge, 13-step 3-minute path), global consent
provider, demo privacy banner, print-safe brief/passport views, app-wide
loading/error/404 states.

## 🧱 Architecture

```text
app/                        # App Router: 10 routes + 8 API endpoints
  api/assist|navigate|documents/extract|health|journey|journey/events|
      handoff/passports|handoff/passports/[token]
  dashboard/ care-journey/ doctor-brief/ documents/ voice/
  handoff/ handoff/[token]/ caregivers/ follow-ups/ settings/
components/
  ui/                       # Button, Card, Badge, Input, SafetyBanner, FlowNext…
  layout/                   # AppShell, AppHeader, Sidebar, MobileBottomNav…
  dashboard|journey|brief|documents|voice|handoff|caregivers|continuity|demo|privacy/
lib/
  safety/policy.ts          # validateAIResponse() — central AI gate
  store/snapshot.ts         # Shared demo snapshot + module flow map
  db/provider.ts|client.ts|supabase.ts   # Demo↔Supabase seam (mock default)
  ai/client.ts|navigator.ts # Provider seam + deterministic intent engine
  journey|brief|documents|voice|handoff|caregivers|continuity/  # domains
  privacy/consent.ts        # Patient consent record
  demo/guide.ts             # 13-step demo script
supabase/schema.sql         # 12 tables, RLS, demo seed
```

**Data flow:** screens → module hooks → (fetch) API routes → repository
abstractions → mock store today, Supabase rows tomorrow. AI calls live
**only** in server API routes; browser APIs (Web Speech, mic, clipboard,
`localStorage`) are client-only and SSR-guarded. Uploads never leave the
browser in the prototype (object-URL previews).

## 🛠 Tech stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 ·
lucide-react · `qrcode` (client QR) · Web Speech API · Supabase-ready Postgres

## 🚀 Local setup

```bash
npm install
npm run dev      # → http://localhost:3000
npm run lint
npm run build
npm run start    # serves the production build → http://localhost:3000
```

No external services required — demo mode works out of the box.

## 🔐 Environment variables

Copy `.env.example` → `.env.local`. Full documentation lives in
`.env.example`. Summary:

| Variable | Where | Required? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser-safe (RLS-gated) | Only for live DB |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser-safe (RLS-gated) | Only for live DB |
| `AI_PROVIDER` | Server only | No (`mock` default) |
| `AI_API_KEY` | **Server only — never `NEXT_PUBLIC_`** | Only for live LLM |
| `AI_MODEL`, `AI_BASE_URL` | Server only | Optional |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only, never in this repo’s reads** | Admin jobs only |
| `DATABASE_URL` | Server only | Alternative to REST |
| `NEXT_PUBLIC_APP_URL` | Browser-safe | Optional (share links) |

Rules enforced in code: no client module references API keys
(`lib/ai/navigator.ts` is pure/deterministic for offline fallback; key
resolution lives in `POST /api/navigate`); no service-role usage anywhere.

## 🗄 Supabase setup

1. Create a project at supabase.com → copy URL + anon key.
2. SQL editor → run `supabase/schema.sql` (12 tables, relationships, RLS,
   demo patient seed).
3. Set `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   locally (`.env.local`) or in Vercel env vars.
4. The app flips from “Mock connected” to “Supabase connected”. Per-module
   repositories (`lib/*/api.ts`, `lib/db/*`) are the swap points — same
   shapes, no screen changes.

## 🤖 AI setup

Default `AI_PROVIDER="mock"`: deterministic intent classifier, scripted
navigation replies (EN/TA/HI), and mock extraction — reliable with no key,
always behind `validateAIResponse()`. To go live: set `AI_PROVIDER` +
server-side `AI_API_KEY` (+ optional `AI_MODEL`/`AI_BASE_URL`) and implement
the provider call inside the API routes keeping the safety gate as the last
step before responding.

## 🧪 Demo mode

Fictional patient **Ananya**; every name/date/document is invented. Header
**Demo Mode** badge opens the 13-step guide (dashboard → voice line → brief
→ documents → journey → passport → caregivers → follow-ups, ~3 minutes).
A sample handoff passport auto-seeds so QR/receiver works instantly.
“Demo prototype — sample data only” banner persists app-wide.

## ▲ Vercel deployment steps

1. Push this repo to GitHub (`.env*` files are gitignored; secrets stay out).
2. Vercel → **Add New Project** → import the repo (framework preset:
   **Next.js** — no custom settings needed).
3. **Build & Output Settings** (defaults are correct):
   - Build Command: `next build` (or `npm run build`)
   - Output Directory: (Next.js default — leave as-is)
   - Install Command: `npm install`
   - Node.js Version: 20.x or newer (engines: `>=20.0.0`)
4. **Environment Variables** → add for Production (and Preview if wanted):
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL *(optional; omit for demo mode)*
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key *(optional; omit for demo mode)*
   - `AI_PROVIDER` = `mock` *(demo)* or your provider
   - `AI_API_KEY` = key *(only when using a live LLM; server-only, never public)*
   - `NEXT_PUBLIC_APP_URL` = `https://<your-app>.vercel.app` *(optional; share links)*
   - ❌ Never add `SUPABASE_SERVICE_ROLE_KEY` or any secret with a `NEXT_PUBLIC_` prefix.
5. **Deploy.** Demo mode works with zero variables set.
6. Post-deploy smoke test: `/api/health` → `db.provider: "mock"`,
   open `/dashboard`, run the Demo Mode path, scan a passport QR.

> Known prototype limits on serverless: handoff vault is tmp-file backed
> (links are instance-scoped; unknown tokens get the friendly 404);
> uploads stay in-browser (object URLs). Both are documented in-code and
> graduate to Supabase Storage/tables in production.

## ✅ Deployment checklist

- [ ] `npm run lint` clean
- [ ] `npm run build` succeeds locally (19 routes)
- [ ] `npm run start` serves the build; `/api/health` OK
- [ ] No `NEXT_PUBLIC_` secret leaks (`AI_API_KEY`, service-role stay server-only)
- [ ] `.env.local` not committed; `.env.example` up to date
- [ ] Vercel env vars set per table above (or intentionally empty for demo)
- [ ] Post-deploy: dashboard renders, Demo Mode path completes, passport QR opens
- [ ] Prototype disclaimers visible (demo banner, safety notices, “not medical interoperability”)

## 📄 License

Hackathon prototype — for demo purposes only, not a medical device.
