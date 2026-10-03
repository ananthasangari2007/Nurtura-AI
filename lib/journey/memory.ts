/**
 * Care Journey Memory — pure state helpers + deterministic Q&A.
 *
 * All answers are computed from structured demo data only.
 * Nothing here invents medical information: no diagnoses, prescriptions,
 * risk scores, or report interpretations — only organizational recall.
 */

import {
  mockQuestions,
  type CareEvent,
  type CareEventType,
} from "@/lib/mock-data";

export type JourneyFilterId = "all" | "visits" | "documents" | "questions" | "followups";

export type JourneyFilter = {
  id: JourneyFilterId;
  label: string;
  matches: (type: CareEventType) => boolean;
};

export const JOURNEY_FILTERS: JourneyFilter[] = [
  { id: "all", label: "All", matches: () => true },
  {
    id: "visits",
    label: "Visits",
    matches: (t) => t === "consultation" || t === "appointment",
  },
  { id: "documents", label: "Documents", matches: (t) => t === "document" },
  { id: "questions", label: "Questions", matches: (t) => t === "question" },
  {
    id: "followups",
    label: "Follow-ups",
    matches: (t) => t === "follow-up" || t === "reminder" || t === "care_instruction",
  },
];

export function filterEvents(events: CareEvent[], filter: JourneyFilterId): CareEvent[] {
  const def = JOURNEY_FILTERS.find((f) => f.id === filter) ?? JOURNEY_FILTERS[0];
  return events.filter((e) => def.matches(e.type));
}

export function sortEventsChronological(events: CareEvent[]): CareEvent[] {
  return [...events].sort((a, b) => a.date.localeCompare(b.date));
}

export type JourneyStats = {
  total: number;
  completed: number;
  upcoming: number;
  progress: number;
  byFilter: { id: JourneyFilterId; label: string; done: number; total: number }[];
};

export function getJourneyStats(events: CareEvent[]): JourneyStats {
  const completed = events.filter((e) => e.status === "completed").length;
  const upcoming = events.filter((e) => e.status === "upcoming").length;
  const total = events.length;
  return {
    total,
    completed,
    upcoming,
    progress: total === 0 ? 0 : Math.round((completed / total) * 100),
    byFilter: JOURNEY_FILTERS.filter((f) => f.id !== "all").map((f) => {
      const scoped = events.filter((e) => f.matches(e.type));
      return {
        id: f.id,
        label: f.label,
        done: scoped.filter((e) => e.status === "completed").length,
        total: scoped.length,
      };
    }),
  };
}

export function splitJourney(events: CareEvent[]): {
  upcoming: CareEvent[];
  completed: CareEvent[];
} {
  return {
    upcoming: sortEventsChronological(events.filter((e) => e.status === "upcoming")),
    completed: sortEventsChronological(events.filter((e) => e.status === "completed")),
  };
}

export function formatEventDate(iso: string): { day: string; month: string; full: string } {
  const d = new Date(iso + "T00:00:00");
  const day = d.getDate().toString().padStart(2, "0");
  const month = d.toLocaleDateString("en-US", { month: "short" });
  const full = d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return { day, month, full };
}

export type JourneyAnswer = {
  answer: string;
  relatedEventIds: string[];
};

const CAPABILITIES_FALLBACK =
  "I can recall your organized journey: past visits, uploaded documents, saved questions, and upcoming follow-ups. Try asking about your last appointment, saved questions, or next follow-up.";

function latestCompletedVisit(events: CareEvent[]): CareEvent | undefined {
  return sortEventsChronological(
    events.filter(
      (e) =>
        e.status === "completed" && (e.type === "consultation" || e.type === "appointment")
    )
  ).pop();
}

function nextFollowUp(events: CareEvent[]): CareEvent | undefined {
  return sortEventsChronological(
    events.filter(
      (e) =>
        e.status === "upcoming" &&
        (e.type === "follow-up" || e.type === "reminder" || e.type === "appointment")
    )
  )[0];
}

/**
 * Deterministic "Ask my journey" — answers ONLY from structured data.
 */
export function answerJourneyQuestion(
  question: string,
  events: CareEvent[]
): JourneyAnswer {
  const q = question.toLowerCase();

  if (q.includes("last appointment") || (q.includes("last") && q.includes("visit"))) {
    const last = latestCompletedVisit(events);
    if (!last) return { answer: "No completed visits are recorded in your journey yet.", relatedEventIds: [] };
    return {
      answer: `Your last recorded visit was "${last.title}" on ${formatEventDate(last.date).full}. ${last.description}`,
      relatedEventIds: [last.id],
    };
  }

  if (q.includes("question")) {
    const saved = mockQuestions.map((item) => `• ${item.text}`).join("\n");
    const prepared = events.filter((e) => e.type === "question");
    return {
      answer: `You have ${mockQuestions.length} saved questions:\n${saved}\n\n${prepared.length > 0 ? `"${prepared[0].title}" is marked for ${formatEventDate(prepared[0].date).full}. Starred questions flow into your Doctor Visit Brief.` : ""}`,
      relatedEventIds: prepared.map((e) => e.id),
    };
  }

  if (q.includes("next") && (q.includes("follow") || q.includes("appointment") || q.includes("visit") || q.includes("when"))) {
    const next = nextFollowUp(events);
    if (!next) return { answer: "Nothing upcoming is scheduled in your journey right now.", relatedEventIds: [] };
    return {
      answer: `Your next scheduled step is "${next.title}" on ${formatEventDate(next.date).full}. ${next.description}`,
      relatedEventIds: [next.id],
    };
  }

  if (q.includes("document") || q.includes("upload") || q.includes("slip")) {
    const docs = events.filter((e) => e.type === "document");
    if (docs.length === 0) return { answer: "No documents are filed in your journey yet.", relatedEventIds: [] };
    return {
      answer: `You have ${docs.length} organized document${docs.length > 1 ? "s" : ""}:\n${docs.map((d) => `• ${d.title} — ${formatEventDate(d.date).full}`).join("\n")}\n\nEach was turned into plain next-step actions. I never interpret medical content.`,
      relatedEventIds: docs.map((d) => d.id),
    };
  }

  if (q.includes("progress") || q.includes("how am i") || q.includes("summary") || q.includes("journey")) {
    const stats = getJourneyStats(events);
    return {
      answer: `Your journey has ${stats.total} events: ${stats.completed} completed, ${stats.upcoming} upcoming (${stats.progress}% complete). You're currently preparing for your October doctor visit.`,
      relatedEventIds: [],
    };
  }

  return { answer: CAPABILITIES_FALLBACK, relatedEventIds: [] };
}

export const JOURNEY_SUGGESTIONS = [
  "What was my last appointment?",
  "What questions have I saved?",
  "When is my next follow-up?",
] as const;
