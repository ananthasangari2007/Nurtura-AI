import { Check } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { SCOPE_META, type ShareScope } from "@/lib/handoff/types";
import { cn } from "@/lib/utils";

/** Sharing controls — the patient ticks exactly what may be shared. */
export function SharingControls({
  scope,
  onToggle,
}: {
  scope: ShareScope;
  onToggle: (key: keyof ShareScope) => void;
}) {
  const enabled = SCOPE_META.filter((s) => scope[s.id]).length;
  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <div>
          <CardTitle>Sharing controls</CardTitle>
          <CardDescription>You choose what to share — nothing is on by accident.</CardDescription>
        </div>
        <span className="font-display text-xs font-medium text-navy-600">
          {enabled} of {SCOPE_META.length} on
        </span>
      </div>
      <ul className="mt-4 space-y-2">
        {SCOPE_META.map((s) => {
          const on = scope[s.id];
          return (
            <li key={s.id}>
              <button
                onClick={() => onToggle(s.id)}
                role="checkbox"
                aria-checked={on}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition hover:shadow-soft",
                  on ? "border-teal-soft-200 bg-teal-soft-50" : "border-navy-100/70 bg-white"
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition",
                    on ? "border-teal-soft-500 bg-teal-soft-500 text-white" : "border-navy-200 bg-white"
                  )}
                  aria-hidden
                >
                  {on && <Check className="h-4 w-4" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-sm font-semibold text-navy-800">
                    {s.label}
                  </span>
                  <span className="block text-xs text-navy-600">{s.detail}</span>
                </span>
                <span className={cn("text-xs font-semibold", on ? "text-teal-soft-700" : "text-navy-600/50")}>
                  {on ? "Sharing" : "Hidden"}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
