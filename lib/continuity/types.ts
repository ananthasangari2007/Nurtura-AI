/**
 * Follow-up & Continuity — domain types + demo seed.
 *
 * Fixed DEMO_TODAY keeps buckets stable for the demo (Oct 3, 2026).
 * Everything here is administrative / preparation — visit logistics,
 * packing, confirmations. Never medical recommendations.
 *
 * Prototype persistence: localStorage. Production later: Supabase
 * (`follow_ups` table), same shapes, linked to `care_events`.
 */

export const DEMO_TODAY_ISO = "2026-10-03";

export type FollowUpBucket = "upcoming" | "due-soon" | "completed";

export type FollowUpPrep = { id: string; label: string; done: boolean };

export type FollowUpItem = {
  id: string;
  title: string;
  /** ISO date */
  date: string;
  /** Related Care Journey Memory event id */
  eventId?: string;
  prep: FollowUpPrep[];
  completed: boolean;
  channel: string;
};

export const seedFollowUps: FollowUpItem[] = [
  {
    id: "fu-appt",
    title: "Upcoming appointment — Antenatal checkup",
    date: "2026-10-10",
    eventId: "e8",
    prep: [
      { id: "fp1", label: "Review questions", done: true },
      { id: "fp2", label: "Select documents", done: true },
      { id: "fp3", label: "Confirm appointment", done: false },
    ],
    completed: false,
    channel: "SMS + App",
  },
  {
    id: "fu-pack",
    title: "Pack visit folder",
    date: "2026-10-09",
    eventId: "e6",
    prep: [
      { id: "fp4", label: "ID + insurance in folder", done: true },
      { id: "fp5", label: "Print question list", done: false },
    ],
    completed: false,
    channel: "App",
  },
  {
    id: "fu-confirm",
    title: "Confirm clinic slot by phone",
    date: "2026-10-08",
    eventId: "e5",
    prep: [{ id: "fp6", label: "Call front desk", done: false }],
    completed: false,
    channel: "App",
  },
  {
    id: "fu-share",
    title: "Share visit summary with caregivers",
    date: "2026-10-11",
    eventId: "e9",
    prep: [{ id: "fp7", label: "Approve summary first", done: false }],
    completed: false,
    channel: "App",
  },
  {
    id: "fu-call",
    title: "Phone check-in with clinic",
    date: "2026-09-28",
    eventId: "e3",
    prep: [{ id: "fp8", label: "Call logged", done: true }],
    completed: true,
    channel: "App",
  },
];

function daysFromToday(dateISO: string): number {
  const ms = new Date(dateISO + "T00:00:00").getTime() - new Date(DEMO_TODAY_ISO + "T00:00:00").getTime();
  return Math.round(ms / 86_400_000);
}

export function bucketOf(item: FollowUpItem): FollowUpBucket {
  if (item.completed) return "completed";
  return daysFromToday(item.date) <= 7 ? "due-soon" : "upcoming";
}

export function sortFollowUps(items: FollowUpItem[]): FollowUpItem[] {
  return [...items].sort((a, b) => a.date.localeCompare(b.date));
}

export function dueLabel(dateISO: string): string {
  const d = daysFromToday(dateISO);
  const full = new Date(dateISO + "T00:00:00").toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
  });
  if (d < 0) return `${full} (past)`;
  if (d === 0) return "Today";
  if (d === 1) return "Tomorrow";
  return `${full} · in ${d} days`;
}

/**
 * Next Care Step — administrative / preparation actions ONLY.
 * Derived from fixed templates over live state; never clinical.
 */
export type NextStep = { title: string; detail: string; cta: string; href: string };

export function getNextCareStep(items: FollowUpItem[]): NextStep {
  const open = sortFollowUps(items.filter((i) => !i.completed));
  const nextPrep = open
    .flatMap((i) => i.prep.filter((p) => !p.done).map((p) => ({ item: i, prep: p })))
    .sort((a, b) => a.item.date.localeCompare(b.item.date))[0];

  if (nextPrep) {
    const label = nextPrep.prep.label.toLowerCase();
    if (label.includes("confirm")) {
      return {
        title: "Confirm your appointment.",
        detail: `${nextPrep.item.title} · ${dueLabel(nextPrep.item.date)}. A quick call keeps your slot safe.`,
        cta: "Open follow-ups",
        href: "/follow-ups",
      };
    }
    if (label.includes("question")) {
      return {
        title: "Review your saved questions.",
        detail: "Star the 2–3 questions that matter most for your Doctor Visit Brief.",
        cta: "Review questions",
        href: "/care-journey",
      };
    }
    if (label.includes("document") || label.includes("pack") || label.includes("print")) {
      return {
        title: "Prepare your selected documents.",
        detail: "File slips, ID, and printouts in one visit folder the night before.",
        cta: "Open documents",
        href: "/documents",
      };
    }
    return {
      title: `${nextPrep.prep.label}.`,
      detail: `${nextPrep.item.title} · ${dueLabel(nextPrep.item.date)}.`,
      cta: "Open follow-ups",
      href: "/follow-ups",
    };
  }
  return {
    title: "You're all caught up.",
    detail: "Every preparation step is done. Your journey memory holds the full story.",
    cta: "View care journey",
    href: "/care-journey",
  };
}

const STORAGE_KEY = "nurtura-followups-v1";

export function loadFollowUpsLocal(): FollowUpItem[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as FollowUpItem[];
  } catch {
    return null;
  }
}

export function saveFollowUpsLocal(items: FollowUpItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Private mode — demo continues in memory.
  }
}
