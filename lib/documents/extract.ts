/**
 * Prototype extraction service.
 *
 * `extractDocumentCareActions()` is the single seam for document
 * understanding. Today it is a DETERMINISTIC mock keyed off the document
 * type/name, so the demo is reliable with no API key.
 *
 * Later, an AI provider implementation can replace the body: it must still
 * return ONLY administrative / care-navigation fields (dates, provider,
 * location, packing lists, admin instructions) and must never interpret
 * medical results, diagnoses, or treatment recommendations.
 */

import type {
  DocFileKind,
  DocType,
  ExtractedCareActions,
} from "@/lib/documents/types";

export type ExtractInput = {
  name: string;
  docType: DocType;
  fileKind: DocFileKind;
};

const BASE_APPOINTMENT: ExtractedCareActions = {
  documentType: "Appointment slip",
  providerName: "City Care Clinic",
  location: "City Care Clinic, Room 4",
  appointmentDate: "18 October, 10:30 AM",
  followUpDate: "25 October (to be confirmed at visit)",
  followUpRequired: true,
  bringItems: ["Previous report", "ID + insurance card", "Visit question list"],
  questionsMentioned: ["What should I bring to make my visit smooth?"],
  adminInstructions: [
    "Arrive 15 minutes early for front-desk registration",
    "Confirm the Oct 18 slot by phone before Oct 16",
  ],
  reminders: [
    { id: "dr1", title: "Confirm Oct 18 clinic slot", due: "Oct 16" },
    { id: "dr2", title: "Pack visit folder (ID + slips + questions)", due: "Oct 17" },
  ],
  prepItems: ["Confirm clinic slot", "Pack visit folder"],
};

const BY_TYPE: Record<DocType, Partial<ExtractedCareActions>> = {
  "appointment-slip": {},
  "referral-slip": {
    documentType: "Referral slip",
    providerName: "City Care Clinic (referred desk)",
    adminInstructions: [
      "Carry this slip plus prior visit papers to the appointment",
      "Ask the front desk which counter accepts referral slips",
    ],
  },
  prescription: {
    documentType: "Prescription (admin info only)",
    adminInstructions: [
      "File this with your visit folder for the doctor to review",
      "Note the refill date on your reminders — never adjust doses yourself",
    ],
    bringItems: ["This prescription", "ID + insurance card"],
    questionsMentioned: [],
  },
  report: {
    documentType: "Medical report (admin info only)",
    adminInstructions: [
      "File this unopened with your visit folder for the doctor to review",
      "Nurtura does not read or explain report contents",
    ],
    bringItems: ["Previous report", "ID + insurance card"],
    questionsMentioned: ["What should I ask about carrying reports to visits?"],
  },
  insurance: {
    documentType: "Insurance / ID card",
    providerName: "Patient carry item",
    appointmentDate: "No appointment on this card",
    followUpDate: "No follow-up on this card",
    followUpRequired: false,
    bringItems: ["ID + insurance card (originals)"],
    questionsMentioned: [],
    adminInstructions: ["Keep originals in the visit folder"],
    reminders: [{ id: "dr3", title: "Keep ID + insurance in visit folder", due: "Oct 17" }],
    prepItems: ["Pack ID + insurance"],
  },
  other: {
    documentType: "Care document",
  },
};

export async function extractDocumentCareActions(
  input: ExtractInput
): Promise<ExtractedCareActions> {
  // Deterministic mock: derive only admin fields from the declared type.
  // A provider implementation MUST NOT add clinical interpretation.
  const lower = input.name.toLowerCase();
  const venue = lower.includes("community")
    ? "Community Health Center"
    : "City Care Clinic";
  const dated: Partial<ExtractedCareActions> = {
    location: input.docType === "appointment-slip" ? `${venue}, Room 4` : venue,
  };
  return {
    ...BASE_APPOINTMENT,
    ...BY_TYPE[input.docType],
    ...dated,
  };
}
