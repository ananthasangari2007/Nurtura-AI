/**
 * Privacy — patient consent record (pure helpers, client-safe).
 *
 * Every sharing surface (handoff scope, caregiver permissions, reminders)
 * is a concrete expression of these toggles. Nothing is shared by default.
 * Prototype persistence: localStorage. Production: `consents` table
 * (see supabase/schema.sql).
 */

export type ConsentCategory =
  | "timeline"
  | "appointments"
  | "questions"
  | "documents"
  | "followups"
  | "caregivers"
  | "reminders_sms"
  | "local_storage";

export type ConsentState = Record<ConsentCategory, boolean>;

export const CONSENT_META: { id: ConsentCategory; label: string; detail: string }[] = [
  { id: "timeline", label: "Care timeline", detail: "Journey events in passports" },
  { id: "appointments", label: "Appointments", detail: "Visit details in passports" },
  { id: "questions", label: "Questions", detail: "Saved questions in passports" },
  { id: "documents", label: "Documents", detail: "Organized papers in passports" },
  { id: "followups", label: "Follow-up info", detail: "Reminders in passports" },
  { id: "caregivers", label: "Caregiver sharing", detail: "Circle members may receive nudges" },
  { id: "reminders_sms", label: "SMS reminders", detail: "Simulated texts for visits" },
  { id: "local_storage", label: "On-device storage", detail: "Demo data stays in this browser" },
];

/** Privacy-first defaults: sharing off, local convenience on. */
export const DEFAULT_CONSENT: ConsentState = {
  timeline: true,
  appointments: true,
  questions: true,
  documents: false,
  followups: false,
  caregivers: true,
  reminders_sms: false,
  local_storage: true,
};

const STORAGE_KEY = "nurtura-consent-v1";
const NOTICE_KEY = "nurtura-privacy-notice-v1";

export function loadConsentLocal(): ConsentState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_CONSENT };
    return { ...DEFAULT_CONSENT, ...(JSON.parse(raw) as Partial<ConsentState>) };
  } catch {
    return { ...DEFAULT_CONSENT };
  }
}

export function saveConsentLocal(state: ConsentState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Private mode — demo continues in memory.
  }
}

export function isNoticeDismissed(): boolean {
  try {
    return localStorage.getItem(NOTICE_KEY) === "dismissed";
  } catch {
    return false;
  }
}

export function dismissNotice() {
  try {
    localStorage.setItem(NOTICE_KEY, "dismissed");
  } catch {
    // Ignore — notice simply reappears.
  }
}
