/**
 * Document → Care Action — domain types + demo library.
 *
 * SAFETY: only administrative / care-navigation information is ever
 * extracted or stored (dates, provider, location, packing lists,
 * admin instructions). Medical results, diagnoses, and treatment
 * recommendations are never interpreted, explained, or stored.
 */

export type DocFileKind = "pdf" | "image";

export type DocType =
  | "appointment-slip"
  | "referral-slip"
  | "prescription"
  | "report"
  | "insurance"
  | "other";

export type DocStatus = "new" | "processing" | "review" | "organized";

export type CareDocument = {
  id: string;
  name: string;
  fileKind: DocFileKind;
  docType: DocType;
  /** ISO date added, e.g. "2026-10-02" */
  dateAdded: string;
  status: DocStatus;
  /** Local object URL for image preview (client only, never uploaded). */
  previewUrl?: string;
  relatedEventId?: string;
};

export type DocReminder = {
  id: string;
  title: string;
  due: string;
};

export type ExtractedCareActions = {
  documentType: string;
  providerName: string;
  location: string;
  appointmentDate: string;
  followUpDate: string;
  followUpRequired: boolean;
  bringItems: string[];
  questionsMentioned: string[];
  adminInstructions: string[];
  reminders: DocReminder[];
  prepItems: string[];
};

export const DOC_TYPE_LABELS: Record<DocType, string> = {
  "appointment-slip": "Appointment slip",
  "referral-slip": "Referral slip",
  prescription: "Prescription",
  report: "Medical report",
  insurance: "Insurance / ID",
  other: "Other document",
};

export const DOC_TYPE_OPTIONS: { value: DocType; label: string }[] = (
  Object.keys(DOC_TYPE_LABELS) as DocType[]
).map((value) => ({ value, label: DOC_TYPE_LABELS[value] }));

/** Demo library — pre-organized plus one fresh upload candidate. */
export const seedDocuments: CareDocument[] = [
  {
    id: "doc1",
    name: "Appointment slip — Oct visit",
    fileKind: "pdf",
    docType: "appointment-slip",
    dateAdded: "2026-10-02",
    status: "organized",
    relatedEventId: "e5",
  },
  {
    id: "doc2",
    name: "Referral slip photo",
    fileKind: "image",
    docType: "referral-slip",
    dateAdded: "2026-10-02",
    status: "organized",
    relatedEventId: "e5",
  },
  {
    id: "doc3",
    name: "Insurance card photo",
    fileKind: "image",
    docType: "insurance",
    dateAdded: "2026-09-20",
    status: "new",
  },
];

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
