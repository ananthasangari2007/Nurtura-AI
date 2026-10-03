import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatEventDate } from "@/lib/journey/memory";
import type { CareEvent } from "@/lib/mock-data";
import { EVENT_META } from "./JourneyMeta";

/**
 * JourneyTimeline — longitudinal memory timeline.
 * Mobile-first single rail; on sm+ screens a date badge column appears.
 */
export function JourneyTimeline({
  events,
  selectedId,
  onSelect,
}: {
  events: CareEvent[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <ol className="relative">
      {events.map((event, i) => {
        const meta = EVENT_META[event.type];
        const Icon = meta.icon;
        const last = i === events.length - 1;
        const done = event.status === "completed";
        const { day, month, full } = formatEventDate(event.date);
        const active = selectedId === event.id;
        return (
          <li key={event.id} className="relative flex gap-3 pb-5 last:pb-0 sm:gap-4">
            {/* Rail */}
            {!last && (
              <span
                aria-hidden
                className={cn(
                  "absolute top-12 bottom-0 left-[22px] w-0.5 rounded-full sm:left-[27px]",
                  done ? "bg-teal-soft-200" : "bg-navy-100"
                )}
              />
            )}

            {/* Date badge */}
            <div className="flex w-11 shrink-0 flex-col items-center rounded-2xl bg-white py-2 shadow-soft sm:w-[54px]">
              <span className="font-display text-base leading-none font-semibold text-navy-800">
                {day}
              </span>
              <span className="mt-0.5 text-[11px] font-medium text-navy-600">
                {month}
              </span>
            </div>

            {/* Node */}
            <span
              aria-hidden
              className={cn(
                "z-10 mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 bg-white",
                done
                  ? "border-teal-soft-500 text-teal-soft-600"
                  : "border-blush-400 text-blush-500"
              )}
            >
              {done ? (
                <Check className="h-4 w-4" aria-hidden />
              ) : (
                <Icon className="h-4 w-4" aria-hidden />
              )}
            </span>

            {/* Card */}
            <button
              onClick={() => onSelect(event.id)}
              aria-label={`Open details for ${event.title}, ${full}`}
              className={cn(
                "group min-w-0 flex-1 rounded-2xl border bg-white p-4 text-left shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-lift",
                active ? "border-lavender-300 ring-4 ring-lavender-100" : "border-white"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-display text-[11px] font-semibold tracking-wide uppercase",
                    meta.tone
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
                  {meta.label}
                </span>
                <span className="shrink-0 text-xs font-medium text-navy-600">
                  {full}
                </span>
              </div>
              <span className="mt-1.5 block truncate font-display text-[15px] font-semibold text-navy-800">
                {event.title}
              </span>
              <span className="mt-0.5 line-clamp-2 block text-[13px] leading-relaxed text-navy-600">
                {event.description}
              </span>
              <span className="mt-2 inline-flex items-center gap-1 font-display text-xs font-medium text-lavender-600">
                {done ? "View memory" : "View plan"}
                <ChevronRight
                  className="h-3.5 w-3.5 transition group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
