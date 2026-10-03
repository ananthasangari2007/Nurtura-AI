/**
 * Care Handoff Passport — domain types.
 *
 * Prototype: patient-controlled, time-boxed sharing of NON-CLINICAL
 * journey information. Explicitly not production-grade medical
 * interoperability — mock session, mock tokens, demo expiry.
 */

export type ShareScope = {
  timeline: boolean;
  appointments: boolean;
  questions: boolean;
  documents: boolean;
  followups: boolean;
};

export const SCOPE_META: {
  id: keyof ShareScope;
  label: string;
  detail: string;
}[] = [
  { id: "timeline", label: "Care timeline", detail: "Journey events you select" },
  { id: "appointments", label: "Appointments", detail: "Upcoming visit details" },
  { id: "questions", label: "Questions", detail: "Questions you select" },
  { id: "documents", label: "Documents", detail: "Organized papers you select" },
  { id: "followups", label: "Follow-up information", detail: "Reminders & next steps" },
];

export const DEFAULT_SCOPE: ShareScope = {
  timeline: true,
  appointments: true,
  questions: true,
  documents: false,
  followups: false,
};

export type PassportStatus = "active" | "revoked" | "expired";

export type SharedItems = {
  questionIds: string[];
  eventIds: string[];
  documentIds: string[];
};

export type HandoffPassport = {
  token: string;
  createdAt: string;
  expiresAt: string;
  scope: ShareScope;
  items: SharedItems;
  status: PassportStatus;
  viewCount: number;
};

export type AuditKind = "created" | "viewed" | "revoked" | "expired";

export type AuditEvent = {
  id: string;
  token: string;
  at: string;
  kind: AuditKind;
  detail: string;
};

export const AUDIT_LABEL: Record<AuditKind, string> = {
  created: "Passport created",
  viewed: "Viewed",
  revoked: "Access revoked",
  expired: "Link expired",
};

/** Mock session — prototype patient identity (no real auth). */
export const mockSession = {
  patientDisplayName: "Ananya",
  patientId: "demo-patient-ananya",
} as const;

export const PASSPORT_TTL_HOURS = 24;

export function isExpiredPassport(p: Pick<HandoffPassport, "expiresAt">, now = Date.now()): boolean {
  return new Date(p.expiresAt).getTime() <= now;
}

export function expiryLabel(expiresAt: string, now = Date.now()): string {
  const ms = new Date(expiresAt).getTime() - now;
  if (ms <= 0) return "Expired";
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  if (h >= 1) return `Share link expires in ${h} hour${h === 1 ? "" : "s"}.`;
  return `Share link expires in ${m} minute${m === 1 ? "" : "s"}.`;
}
