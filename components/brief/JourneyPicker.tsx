import { Check, History } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { formatEventDate } from "@/lib/journey/memory";
import { seedCareEvents } from "@/lib/mock-data";
import { EVENT_META } from "@/components/journey/JourneyMeta";
import { cn } from "@/lib/utils";

/** Previous journey events selection — reference, don't repeat, your history. */
export function JourneyPicker({
  selectedIds,
  onToggle,
}: {
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  const past = seedCareEvents.filter((e) => e.status === "completed");
  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <div>
          <CardTitle className="flex items-center gap-2">
            <History className="h-4 w-4 text-lavender-500" aria-hidden />
            Relevant journey events
          </CardTitle>
          <CardDescription>
            Reference past steps so the doctor sees your organized history.
          </CardDescription>
        </div>
        <Badge tone="lavender">{selectedIds.length} linked</Badge>
      </div>
      <ul className="mt-4 space-y-2">
        {past.map((e) => {
          const meta = EVENT_META[e.type];
          const on = selectedIds.includes(e.id);
          return (
            <li key={e.id}>
              <button
                onClick={() => onToggle(e.id)}
                aria-pressed={on}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border px-3.5 py-2.5 text-left transition hover:shadow-soft",
                  on
                    ? "border-lavender-300 bg-lavender-50"
                    : "border-navy-100/70 bg-white"
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2",
                    on
                      ? "border-lavender-500 bg-lavender-500 text-white"
                      : "border-navy-100 text-navy-600"
                  )}
                >
                  {on ? (
                    <Check className="h-4 w-4" aria-hidden />
                  ) : (
                    <span className={cn("h-2 w-2 rounded-full", meta.dot)} />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-navy-800">
                    {e.title}
                  </span>
                  <span className="block truncate text-xs text-navy-600">
                    {meta.label} · {formatEventDate(e.date).full}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
