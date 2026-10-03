/**
 * Demo Mode — the 3-minute hackathon journey for fictional patient Ananya.
 *
 * Every person, date, and document here is invented for demonstration.
 * No real patient data exists anywhere in this prototype.
 */

export type DemoStep = {
  n: number;
  title: string;
  detail: string;
  href: string;
  cta: string;
  /** Exact phrase the presenter says/types at this step (if any). */
  say?: string;
};

export const DEMO_PATIENT_NOTE =
  "Ananya is a fictional demo patient. All names, dates, and documents are invented samples.";

export const DEMO_STEPS: DemoStep[] = [
  { n: 1, title: "Dashboard", detail: "Ananya's morning: next visit, focus list, journey at a glance.", href: "/dashboard", cta: "Open dashboard" },
  { n: 2, title: "Click “I Need a Doctor”", detail: "The big blush CTA — starts the voice intake.", href: "/voice", cta: "Tap I Need a Doctor" },
  { n: 3, title: "Say the need", detail: "Speak or paste the line, then Send to Nurtura.", href: "/voice", cta: "Open voice intake", say: "I want to prepare for my next doctor visit." },
  { n: 4, title: "Open Doctor Visit Brief", detail: "The navigator routes here — start the guided intake.", href: "/doctor-brief", cta: "Open brief builder" },
  { n: 5, title: "Show saved questions", detail: "Ananya's 2 questions — add, edit, or mark discussed live.", href: "/doctor-brief", cta: "See questions step" },
  { n: 6, title: "Open Documents", detail: "Slips and cards become packing lists and reminders.", href: "/documents", cta: "Open documents" },
  { n: 7, title: "Show Document → Care Action", detail: "Upload any PDF/photo — confirm to add journey event + reminders.", href: "/documents", cta: "Try an upload" },
  { n: 8, title: "Open Care Journey", detail: "Longitudinal memory, not isolated appointments.", href: "/care-journey", cta: "Open journey" },
  { n: 9, title: "Show timeline", detail: "Filter visits/documents/questions/follow-ups; ask “When is my next follow-up?”", href: "/care-journey", cta: "See timeline" },
  { n: 10, title: "Open Care Passport", detail: "A pre-made demo passport is waiting with QR + link.", href: "/handoff", cta: "Open passport" },
  { n: 11, title: "Show consent-controlled sharing", detail: "Untick Documents — the receiver view hides that section instantly.", href: "/handoff", cta: "Toggle sharing" },
  { n: 12, title: "Open Caregiver Circle", detail: "Rahul (Partner) gets reminders + time — never documents.", href: "/caregivers", cta: "Meet the circle" },
  { n: 13, title: "Show follow-up", detail: "Due-soon board, prep checklists, and the Next Care Step.", href: "/follow-ups", cta: "See continuity" },
];
