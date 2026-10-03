-- =====================================================================
-- Nurtura AI — Supabase / PostgreSQL schema (prototype, hackathon)
--
-- 12 tables with relationships. Apply in the Supabase SQL editor or
-- `psql`. Demo mode needs NOTHING: when SUPABASE_URL is unset the app
-- serves local/mock data with identical shapes (see lib/db/*).
--
-- Design notes:
-- * One demo patient per install (users.id = 'demo-patient-ananya').
--    Multi-user auth later: replace with auth.users FK + RLS on
--    auth.uid().
-- * NO clinical columns anywhere by design: no diagnoses, prescriptions,
--    risk scores, or interpretations. Only navigation / organization.
-- * RLS is enabled with permissive demo policies; tighten before any
--    real-data pilot.
-- =====================================================================

-- ---------------------------------------------------------------------
-- users: prototype patient profile (non-clinical fields only)
-- ---------------------------------------------------------------------
create table if not exists users (
  id text primary key,
  display_name text not null,
  preferred_language text not null default 'en',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- appointments: visit logistics (doctor, time, place, prep state)
-- ---------------------------------------------------------------------
create table if not exists appointments (
  id text primary key,
  user_id text not null references users (id) on delete cascade,
  title text not null,
  doctor text not null,
  specialty text not null default '',
  date date not null,
  time text not null default '',
  location text not null default '',
  status text not null default 'upcoming'
    check (status in ('upcoming', 'preparing', 'done')),
  created_at timestamptz not null default now()
);
create index if not exists appointments_user_date_idx on appointments (user_id, date);

-- ---------------------------------------------------------------------
-- questions: patient-authored visit questions (never clinical advice)
-- ---------------------------------------------------------------------
create table if not exists questions (
  id text primary key,
  user_id text not null references users (id) on delete cascade,
  text text not null,
  category text not null default 'General',
  for_visit text not null default '',
  starred boolean not null default false,
  discussed boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists questions_user_idx on questions (user_id);

-- ---------------------------------------------------------------------
-- care_events: longitudinal journey memory (CareEvent model)
-- ---------------------------------------------------------------------
create table if not exists care_events (
  id text primary key,
  user_id text not null references users (id) on delete cascade,
  date date not null,
  type text not null
    check (type in ('consultation','appointment','document','follow-up','question','reminder','care_instruction')),
  title text not null,
  description text not null default '',
  source text not null default '',
  status text not null default 'completed'
    check (status in ('completed','upcoming')),
  related_document_id text,
  created_at timestamptz not null default now()
);
create index if not exists care_events_user_date_idx on care_events (user_id, date);

-- ---------------------------------------------------------------------
-- documents: uploaded papers + ADMIN-ONLY organization metadata
-- ---------------------------------------------------------------------
create table if not exists documents (
  id text primary key,
  user_id text not null references users (id) on delete cascade,
  name text not null,
  file_kind text not null default 'image' check (file_kind in ('pdf','image')),
  doc_type text not null default 'other',
  date_added date not null default current_date,
  status text not null default 'new'
    check (status in ('new','processing','review','organized')),
  appointment_date text not null default '',
  follow_up_required boolean not null default false,
  provider_name text not null default '',
  location text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists documents_user_idx on documents (user_id);

-- ---------------------------------------------------------------------
-- care_actions: non-clinical next steps derived from documents/visits
-- ---------------------------------------------------------------------
create table if not exists care_actions (
  id text primary key,
  user_id text not null references users (id) on delete cascade,
  title text not null,
  detail text not null default '',
  due text not null default '',
  done boolean not null default false,
  source text not null default '',
  document_id text references documents (id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists care_actions_user_idx on care_actions (user_id);

-- ---------------------------------------------------------------------
-- doctor_briefs: patient-approved visit briefs (request + selections)
-- ---------------------------------------------------------------------
create table if not exists doctor_briefs (
  id text primary key,
  user_id text not null references users (id) on delete cascade,
  reason text not null default '',
  provider text not null default '',
  kind text not null default '' check (kind in ('','new','follow-up')),
  patient_notes text not null default '',
  question_ids jsonb not null default '[]',
  document_ids jsonb not null default '[]',
  event_ids jsonb not null default '[]',
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- follow_ups: continuity reminders + prep checklists
-- ---------------------------------------------------------------------
create table if not exists follow_ups (
  id text primary key,
  user_id text not null references users (id) on delete cascade,
  title text not null,
  date date not null,
  event_id text references care_events (id) on delete set null,
  prep jsonb not null default '[]',
  completed boolean not null default false,
  channel text not null default 'App',
  created_at timestamptz not null default now()
);
create index if not exists follow_ups_user_date_idx on follow_ups (user_id, date);

-- ---------------------------------------------------------------------
-- caregivers: trusted circle members (patient-added)
-- ---------------------------------------------------------------------
create table if not exists caregivers (
  id text primary key,
  user_id text not null references users (id) on delete cascade,
  name text not null,
  role text not null default 'Family member'
    check (role in ('Partner','Parent','Family member')),
  status text not null default 'invited'
    check (status in ('active','invited')),
  invited_at timestamptz not null default now()
);
create index if not exists caregivers_user_idx on caregivers (user_id);

-- ---------------------------------------------------------------------
-- caregiver_permissions: per-person, patient-controlled toggles
-- ---------------------------------------------------------------------
create table if not exists caregiver_permissions (
  caregiver_id text primary key references caregivers (id) on delete cascade,
  appointment_reminders boolean not null default false,
  appointment_time boolean not null default false,
  documents boolean not null default false,
  personal_questions boolean not null default false,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- handoff_passports: 24h scoped share tokens (non-clinical snapshot refs)
-- ---------------------------------------------------------------------
create table if not exists handoff_passports (
  token text primary key,
  user_id text not null references users (id) on delete cascade,
  scope jsonb not null default '{}',
  question_ids jsonb not null default '[]',
  event_ids jsonb not null default '[]',
  document_ids jsonb not null default '[]',
  status text not null default 'active'
    check (status in ('active','revoked','expired')),
  view_count integer not null default 0,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '24 hours'
);
create index if not exists handoff_passports_user_idx on handoff_passports (user_id);

-- ---------------------------------------------------------------------
-- consents: explicit patient consent record per scope category
-- ---------------------------------------------------------------------
create table if not exists consents (
  user_id text not null references users (id) on delete cascade,
  category text not null
    check (category in ('timeline','appointments','questions','documents','followups','caregivers','reminders_sms','local_storage')),
  granted boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, category)
);

-- ---------------------------------------------------------------------
-- Row Level Security (demo: enabled, permissive; tighten pre-pilot)
-- ---------------------------------------------------------------------
alter table users enable row level security;
alter table appointments enable row level security;
alter table questions enable row level security;
alter table care_events enable row level security;
alter table documents enable row level security;
alter table care_actions enable row level security;
alter table doctor_briefs enable row level security;
alter table follow_ups enable row level security;
alter table caregivers enable row level security;
alter table caregiver_permissions enable row level security;
alter table handoff_passports enable row level security;
alter table consents enable row level security;

-- Demo policies: single-prototype-user access (replace with auth.uid() later).
-- Example (repeat per table as needed):
-- create policy "demo full access" on appointments
--   for all using (true) with check (true);

-- ---------------------------------------------------------------------
-- Demo seed (optional): one prototype patient, Ananya
-- ---------------------------------------------------------------------
insert into users (id, display_name, preferred_language)
values ('demo-patient-ananya', 'Ananya', 'en')
on conflict (id) do nothing;
