/**
 * Caregiver Circle — domain types + demo seed.
 *
 * The patient controls ALL sharing: every permission defaults to the
 * demo matrix below and only the patient can change it. Caregivers never
 * see clinical content — only logistics the patient ticks.
 *
 * Prototype persistence: localStorage. Production later: Supabase
 * (`caregivers` + `caregiver_activity` tables, RLS, real invites).
 */

export type CaregiverRole = "Partner" | "Parent" | "Family member";

export type CaregiverPermissions = {
  appointmentReminders: boolean;
  appointmentTime: boolean;
  documents: boolean;
  personalQuestions: boolean;
};

export const PERMISSION_META: {
  id: keyof CaregiverPermissions;
  label: string;
  detail: string;
}[] = [
  { id: "appointmentReminders", label: "Appointment reminders", detail: "Gets visit nudges" },
  { id: "appointmentTime", label: "Appointment time", detail: "Sees date, time & place" },
  { id: "documents", label: "Documents", detail: "Sees organized papers" },
  { id: "personalQuestions", label: "Personal questions", detail: "Sees saved questions" },
];

export type CaregiverStatus = "active" | "invited";

export type Caregiver = {
  id: string;
  name: string;
  role: CaregiverRole;
  status: CaregiverStatus;
  permissions: CaregiverPermissions;
  invitedAt: string;
};

export type CaregiverActivityKind =
  | "added"
  | "removed"
  | "permission"
  | "invited"
  | "accepted"
  | "reminder";

export type CaregiverActivity = {
  id: string;
  at: string;
  caregiverId: string | null;
  caregiverName: string;
  kind: CaregiverActivityKind;
  detail: string;
};

export const CAREGIVER_ROLES: CaregiverRole[] = ["Partner", "Parent", "Family member"];

const ROLE_DEFAULTS: Record<CaregiverRole, CaregiverPermissions> = {
  Partner: {
    appointmentReminders: true,
    appointmentTime: true,
    documents: false,
    personalQuestions: false,
  },
  Parent: {
    appointmentReminders: true,
    appointmentTime: false,
    documents: false,
    personalQuestions: false,
  },
  "Family member": {
    appointmentReminders: false,
    appointmentTime: true,
    documents: false,
    personalQuestions: false,
  },
};

export function defaultPermissions(role: CaregiverRole): CaregiverPermissions {
  return { ...ROLE_DEFAULTS[role] };
}

export function permissionSummary(p: CaregiverPermissions): string {
  const on = PERMISSION_META.filter((m) => p[m.id]);
  if (on.length === 0) return "No access yet";
  if (on.length === PERMISSION_META.length) return "Full circle access";
  return on.map((m) => m.label).join(" · ");
}

/** Demo circle — patient-approved starting point, fully editable. */
export const seedCaregivers: Caregiver[] = [
  {
    id: "cg-rahul",
    name: "Rahul",
    role: "Partner",
    status: "active",
    permissions: { ...ROLE_DEFAULTS.Partner },
    invitedAt: "2026-09-12T10:00:00+05:30",
  },
  {
    id: "cg-asha",
    name: "Asha",
    role: "Parent",
    status: "active",
    permissions: { ...ROLE_DEFAULTS.Parent },
    invitedAt: "2026-09-12T10:05:00+05:30",
  },
  {
    id: "cg-divya",
    name: "Divya",
    role: "Family member",
    status: "invited",
    permissions: { ...ROLE_DEFAULTS["Family member"] },
    invitedAt: "2026-10-01T18:30:00+05:30",
  },
];

export const seedCaregiverActivity: CaregiverActivity[] = [
  {
    id: "cga-1",
    at: "2026-10-01T18:30:00+05:30",
    caregiverId: "cg-divya",
    caregiverName: "Divya",
    kind: "invited",
    detail: "Invite sent (simulation). Awaiting acceptance.",
  },
  {
    id: "cga-2",
    at: "2026-09-20T09:15:00+05:30",
    caregiverId: "cg-rahul",
    caregiverName: "Rahul",
    kind: "reminder",
    detail: "Visit reminder shared (simulation).",
  },
  {
    id: "cga-3",
    at: "2026-09-12T10:05:00+05:30",
    caregiverId: "cg-asha",
    caregiverName: "Asha",
    kind: "added",
    detail: "Added as Parent with reminder access.",
  },
];

const STORAGE_KEY = "nurtura-caregivers-v1";

export function loadCaregiversLocal(): {
  caregivers: Caregiver[];
  activity: CaregiverActivity[];
} | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as { caregivers: Caregiver[]; activity: CaregiverActivity[] };
  } catch {
    return null;
  }
}

export function saveCaregiversLocal(caregivers: Caregiver[], activity: CaregiverActivity[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ caregivers, activity }));
  } catch {
    // Private mode — demo continues in memory.
  }
}
