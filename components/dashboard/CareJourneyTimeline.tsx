import { Check, Circle, Loader } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { TimelineEvent } from "@/lib/mock-data";

/**
 * CareJourneyTimeline — vertical patient journey:
 * First Visit → Document Added → Follow-up → Doctor Visit → Next Care Step.
 */
export function CareJourneyTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <CardTitle>Care Journey Timeline</CardTitle>
        <span className="font-display text-xs font-medium text-navy-600">
          {events.filter((e) => e.status === "done").length} of {events.length}{" "}
          complete
        </span>
      </div>
      <CardDescription>
        Where you&apos;ve been — and what comes next.
      </CardDescription>

      <ol className="mt-5 space-y-0">
        {events.map((event, i) => {
          const last = i === events.length - 1;
          return (
            <li key={event.id} className="relative flex gap-3.5 pb-6 last:pb-0">
              {/* Connector */}
              {!last && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-9 left-[17px] h-[calc(100%-2rem)] w-0.5 rounded-full",
                    event.status === "done"
                      ? "bg-teal-soft-200"
                      : "bg-navy-100"
                  )}
                />
              )}
              {/* Node */}
              <span
                className={cn(
                  "z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2",
                  event.status === "done" &&
                    "border-teal-soft-500 bg-teal-soft-500 text-white",
                  event.status === "current" &&
                    "border-blush-500 bg-white text-blush-500",
                  event.status === "upcoming" &&
                    "border-navy-100 bg-white text-navy-200"
                )}
                aria-label={`${event.title}: ${event.status}`}
              >
                {event.status === "done" && (
                  <Check className="h-4 w-4" aria-hidden />
                )}
                {event.status === "current" && (
                  <Loader className="h-4 w-4 animate-spin [animation-duration:3s]" aria-hidden />
                )}
                {event.status === "upcoming" && (
                  <Circle className="h-4 w-4" aria-hidden />
                )}
              </span>
              <div
                className={cn(
                  "min-w-0 flex-1 rounded-2xl px-3.5 py-2.5",
                  event.status === "current"
                    ? "bg-blush-50 ring-1 ring-blush-200"
                    : event.status === "done"
                      ? "bg-teal-soft-50/70"
                      : "bg-navy-50/70"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-display text-sm font-semibold text-navy-800">
                    {event.title}
                  </p>
                  <span className="shrink-0 text-xs font-medium text-navy-600">
                    {event.date}
                  </span>
                </div>
                <p className="mt-0.5 text-[13px] leading-relaxed text-navy-600">
                  {event.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
