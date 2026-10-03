/**
 * Doctor Visit Brief — domain types + demo data.
 *
 * Strictly non-clinical: reasons, questions, papers, logistics.
 * Never diagnoses, triage, prescriptions, or interpretations.
 */

export type VisitKind = "new" | "follow-up";

export type CareRequest = {
  reason: string;
  provider: string;
  kind: VisitKind | "";
  notes: string;
};

export type BriefQuestion = {
  id: string;
  text: string;
  discussed: boolean;
};

export type BriefDocument = {
  id: string;
  name: string;
  detail: string;
  selected: boolean;
};

export type BriefStepId = "intake" | "questions" | "documents" | "journey" | "preview";

export type PatientBrief = {
  reason: string;
  provider: string;
  kind: VisitKind | "";
  questions: BriefQuestion[];
  documents: BriefDocument[];
  eventIds: string[];
  appointment: { title: string; date: string; time: string; location: string };
  notes: string;
  generatedAt: string;
  discussedCount: number;
};

export const BRIEF_STEPS: { id: BriefStepId; label: string }[] = [
  { id: "intake", label: "Care request" },
  { id: "questions", label: "Questions" },
  { id: "documents", label: "Documents" },
  { id: "journey", label: "Journey" },
  { id: "preview", label: "Brief" },
];

export const PROVIDER_OPTIONS = [
  "Dr. Meera Sharma · OB-GYN",
  "Dr. Rao · Pediatrics",
  "City Care Clinic front desk",
  "Community Health Center",
] as const;

/** Carry-pack documents — organizational only. */
export const demoBriefDocuments: BriefDocument[] = [
  {
    id: "bd1",
    name: "Appointment slip (Oct)",
    detail: "Clinic slot confirmation · Room 4",
    selected: true,
  },
  {
    id: "bd2",
    name: "Referral slip",
    detail: "Filed Oct 2 · with next-step actions",
    selected: true,
  },
  {
    id: "bd3",
    name: "Prior visit folder",
    detail: "Registration + previous visit papers",
    selected: false,
  },
  {
    id: "bd4",
    name: "ID + insurance card",
    detail: "Carry originals for front desk",
    selected: true,
  },
];

/** One-tap demo: "I need to talk to my doctor about my previous visit." */
export const DEMO_CARE_FLOW: {
  request: CareRequest;
  questions: string[];
  documentIds: string[];
} = {
  request: {
    reason: "I need to talk to my doctor about my previous visit.",
    provider: "Dr. Meera Sharma · OB-GYN",
    kind: "follow-up",
    notes:
      "I organized my referral slip and wrote down what I want to ask. I would like help staying on track after the visit too.",
  },
  questions: [
    "Can you help me understand what was organized from my referral slip?",
    "What should I bring to make my follow-up visit smooth?",
    "How will I know what my next care step is after this visit?",
  ],
  documentIds: ["bd1", "bd2", "bd4"],
};

export const BRIEF_DISCLAIMER =
  "Patient-generated information. Clinical assessment remains with the healthcare professional.";

const BRIEF_STORAGE_KEY = "nurtura-visit-brief-v1";

export function loadSavedBrief(): PatientBrief | null {
  try {
    const raw = localStorage.getItem(BRIEF_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PatientBrief;
  } catch {
    return null;
  }
}

export function saveBriefLocal(brief: PatientBrief) {
  try {
    localStorage.setItem(BRIEF_STORAGE_KEY, JSON.stringify(brief));
  } catch {
    // Private mode etc. — demo continues in memory.
  }
}
