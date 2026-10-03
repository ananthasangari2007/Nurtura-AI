export type JourneyStatus = "upcoming" | "preparing" | "done";

export type CareQuestion = {
  id: string;
  text: string;
  category: string;
  forVisit: string;
  starred: boolean;
};

export type Appointment = {
  id: string;
  title: string;
  doctor: string;
  date: string;
  time: string;
  location: string;
  status: JourneyStatus;
};

export type CareAction = {
  id: string;
  title: string;
  detail: string;
  due: string;
  done: boolean;
  source: string;
};

export type FollowUp = {
  id: string;
  title: string;
  due: string;
  channel: string;
  enabled: boolean;
};

export type TimelineStatus = "done" | "current" | "upcoming";

export type TimelineEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  status: TimelineStatus;
};

export type PrepItem = {
  id: string;
  label: string;
  done: boolean;
};

export type DetailedAppointment = Appointment & {
  specialty: string;
  countdown: string;
  prepPercent: number;
  prep: PrepItem[];
};

export type JourneyStage = {
  current: string;
  currentDetail: string;
  previous: string;
  previousDetail: string;
  next: string;
  nextDetail: string;
  progress: number;
  stepLabel: string;
};

export const mockQuestions: CareQuestion[] = [
  {
    id: "q1",
    text: "What should I bring to my first antenatal visit?",
    category: "Preparation",
    forVisit: "Antenatal checkup",
    starred: true,
  },
  {
    id: "q2",
    text: "How can I track my child's vaccination visits?",
    category: "Child health",
    forVisit: "Immunization visit",
    starred: true,
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: "a1",
    title: "Antenatal checkup",
    doctor: "Dr. Sharma · OB-GYN",
    date: "2026-10-10",
    time: "10:30 AM",
    location: "City Care Clinic, Room 4",
    status: "preparing",
  },
  {
    id: "a2",
    title: "Child immunization visit",
    doctor: "Dr. Rao · Pediatrics",
    date: "2026-10-18",
    time: "9:00 AM",
    location: "Community Health Center",
    status: "upcoming",
  },
];

export const mockActions: CareAction[] = [
  {
    id: "c1",
    title: "Confirm appointment time",
    detail: "Call clinic front desk to confirm Oct 10 slot.",
    due: "Oct 8",
    done: false,
    source: "Appointment slip",
  },
  {
    id: "c2",
    title: "Pack visit folder",
    detail: "ID, prior prescriptions, insurance card, question list.",
    due: "Oct 9",
    done: false,
    source: "Doctor Visit Brief",
  },
  {
    id: "c3",
    title: "Arrange childcare for visit",
    detail: "Ask caregiver to cover 9 AM – 12 PM.",
    due: "Oct 9",
    done: true,
    source: "Care circle",
  },
];

export const mockFollowUps: FollowUp[] = [  {
    id: "f1",
    title: "Antenatal visit reminder",
    due: "Oct 10 · 8:00 AM",
    channel: "SMS + App",
    enabled: true,
  },
  {
    id: "f2",
    title: "Ask about referral slip",
    due: "Oct 12",
    channel: "App",
    enabled: true,
  },
  {
    id: "f3",
    title: "Share visit summary with caregiver",
    due: "Oct 11",
    channel: "App",
    enabled: false,
  },
];

/* ---------- Premium dashboard demo data (Ananya) ---------- */

export const demoPatient = {
  name: "Ananya",
  greeting: "Good morning",
  subtitle: "Let's keep your care journey organized.",
  weekNote: "Week 24 · Antenatal journey",
  avatarFallback: "A",
} as const;

export const demoJourneyStage: JourneyStage = {
  current: "Preparing for Doctor Visit",
  currentDetail: "Antenatal checkup · Oct 10 · 2 questions ready",
  previous: "Document Added",
  previousDetail: "Referral slip organized into 2 care actions · Oct 2",
  next: "Doctor Visit — Oct 10, 10:30 AM",
  nextDetail: "City Care Clinic, Room 4 · Dr. Meera Sharma",
  progress: 68,
  stepLabel: "Step 4 of 6",
};

export const demoTimeline: TimelineEvent[] = [
  {
    id: "t1",
    title: "First Visit",
    description: "Antenatal registration & initial checkup completed.",
    date: "Sep 12",
    status: "done",
  },
  {
    id: "t2",
    title: "Document Added",
    description: "Referral slip organized into 2 non-clinical care actions.",
    date: "Oct 2",
    status: "done",
  },
  {
    id: "t3",
    title: "Follow-up",
    description: "Phone check-in with clinic front desk confirmed.",
    date: "Oct 5",
    status: "done",
  },
  {
    id: "t4",
    title: "Doctor Visit",
    description: "Antenatal checkup with visit brief ready to carry in.",
    date: "Oct 10",
    status: "current",
  },
  {
    id: "t5",
    title: "Next Care Step",
    description: "Share summary with caregivers & schedule follow-up.",
    date: "Oct 12",
    status: "upcoming",
  },
];

export const demoAppointment: DetailedAppointment = {  id: "a1",
  title: "Antenatal checkup",
  doctor: "Dr. Meera Sharma",
  specialty: "OB-GYN",
  date: "Friday, Oct 10",
  time: "10:30 AM",
  location: "City Care Clinic, Room 4",
  status: "preparing",
  countdown: "In 7 days",
  prepPercent: 75,
  prep: [
    { id: "p1", label: "Visit brief reviewed", done: true },
    { id: "p2", label: "Questions shortlisted (2)", done: true },
    { id: "p3", label: "Documents packed", done: true },
    { id: "p4", label: "Confirm clinic slot", done: false },
  ],
};

/* ---------- Care Journey Memory (longitudinal, non-clinical) ---------- */

export type CareEventType =
  | "consultation"
  | "appointment"
  | "document"
  | "follow-up"
  | "question"
  | "reminder"
  | "care_instruction";

export type CareEventStatus = "completed" | "upcoming";

export type CareEvent = {
  id: string;
  /** ISO date, e.g. "2026-08-12" */
  date: string;
  type: CareEventType;
  title: string;
  /** Non-clinical, organizational description only — never diagnoses. */
  description: string;
  /** Where the event came from, e.g. "Clinic visit", "Patient added". */
  source: string;
  status: CareEventStatus;
  relatedDocumentId?: string;
  createdAt: string;
};

/**
 * Demo seed — Ananya's longitudinal journey. All entries are
 * organizational (visits, papers, questions, reminders), never clinical.
 */
export const seedCareEvents: CareEvent[] = [
  {
    id: "e1",
    date: "2026-08-12",
    type: "consultation",
    title: "First consultation",
    description:
      "Antenatal registration visit completed. Front desk confirmed the visit folder checklist for next time.",
    source: "City Care Clinic",
    status: "completed",
    createdAt: "2026-08-12T11:00:00+05:30",
  },
  {
    id: "e2",
    date: "2026-08-15",
    type: "document",
    title: "Document uploaded",
    description:
      "Appointment slip scanned and organized into a packing checklist. No medical content interpreted.",
    source: "Patient upload",
    status: "completed",
    relatedDocumentId: "doc-slip-aug",
    createdAt: "2026-08-15T18:20:00+05:30",
  },
  {
    id: "e3",
    date: "2026-09-05",
    type: "follow-up",
    title: "Follow-up recorded",
    description:
      "Phone check-in with the clinic front desk logged. Next visit window confirmed as mid-October.",
    source: "Clinic call",
    status: "completed",
    createdAt: "2026-09-05T10:15:00+05:30",
  },
  {
    id: "e4",
    date: "2026-09-20",
    type: "reminder",
    title: "Reminder set",
    description:
      "Reminder scheduled to pack the visit folder the night before the October checkup.",
    source: "Nurtura reminders",
    status: "completed",
    createdAt: "2026-09-20T09:00:00+05:30",
  },
  {
    id: "e5",
    date: "2026-10-02",
    type: "document",
    title: "Referral slip organized",
    description:
      "Referral slip filed and turned into 2 plain next-step actions: confirm slot, carry prior slips.",
    source: "Patient upload",
    status: "completed",
    relatedDocumentId: "doc-referral-oct",
    createdAt: "2026-10-02T19:40:00+05:30",
  },
  {
    id: "e6",
    date: "2026-10-05",
    type: "care_instruction",
    title: "Visit prep checklist",
    description:
      "Front-desk guidance saved as a checklist: arrive 15 minutes early, carry ID and prior slips.",
    source: "City Care Clinic",
    status: "completed",
    createdAt: "2026-10-05T12:05:00+05:30",
  },
  {
    id: "e7",
    date: "2026-10-12",
    type: "question",
    title: "Questions prepared",
    description:
      "2 visit questions shortlisted and starred for the Doctor Visit Brief: what to bring and vaccination visits.",
    source: "Patient added",
    status: "upcoming",
    createdAt: "2026-10-03T08:30:00+05:30",
  },
  {
    id: "e8",
    date: "2026-10-18",
    type: "appointment",
    title: "Upcoming doctor visit",
    description:
      "Antenatal checkup at City Care Clinic, Room 4. Visit brief approved and ready to carry in.",
    source: "City Care Clinic",
    status: "upcoming",
    createdAt: "2026-10-03T08:32:00+05:30",
  },
  {
    id: "e9",
    date: "2026-10-25",
    type: "follow-up",
    title: "Next follow-up",
    description:
      "Share the visit summary with caregivers and confirm the following visit window.",
    source: "Nurtura reminders",
    status: "upcoming",
    createdAt: "2026-10-03T08:33:00+05:30",
  },
];
