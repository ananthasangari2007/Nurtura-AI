import { cn } from "@/lib/utils";
import { JOURNEY_FILTERS, type JourneyFilterId } from "@/lib/journey/memory";
import type { CareEvent } from "@/lib/mock-data";

const COUNT_TONE: Record<JourneyFilterId, string> = {
  all: "bg-navy-800 text-white",
  visits: "bg-blush-100 text-blush-600",
  documents: "bg-teal-soft-100 text-teal-soft-700",
  questions: "bg-lavender-100 text-lavender-600",
  followups: "bg-sky-soft-100 text-sky-soft-600",
};

/** Filter pills: All · Visits · Documents · Questions · Follow-ups. */
export function JourneyFilters({
  active,
  onChange,
  events,
}: {
  active: JourneyFilterId;
  onChange: (id: JourneyFilterId) => void;
  events: CareEvent[];
}) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="tablist"
      aria-label="Filter journey events"
    >
      {JOURNEY_FILTERS.map((f) => {
        const count =
          f.id === "all"
            ? events.length
            : events.filter((e) => f.matches(e.type)).length;
        const selected = active === f.id;
        return (
          <button
            key={f.id}
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(f.id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-display text-[13px] font-medium transition",
              selected
                ? "bg-navy-800 text-white shadow-soft"
                : "bg-white text-navy-600 shadow-soft hover:text-navy-800 hover:shadow-lift"
            )}
          >
            {f.label}
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[11px] font-semibold",
                selected ? "bg-white/20 text-white" : COUNT_TONE[f.id]
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
