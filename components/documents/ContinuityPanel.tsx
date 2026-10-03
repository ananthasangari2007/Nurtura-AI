import { BellRing, Circle, CircleCheck, ListChecks } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardTitle } from "@/components/ui/Card";
import type { PrepCheck } from "@/lib/documents/use-documents";
import type { DocReminder } from "@/lib/documents/types";

/** Continuity panel — reminders + preparation checklist updated by confirmations. */
export function ContinuityPanel({
  reminders,
  prep,
  onTogglePrep,
}: {
  reminders: DocReminder[];
  prep: PrepCheck[];
  onTogglePrep: (id: string) => void;
}) {
  const done = prep.filter((p) => p.done).length;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BellRing className="h-4 w-4 text-blush-500" aria-hidden />
            Reminders from documents
          </CardTitle>
          <Badge tone="blush">{reminders.length}</Badge>
        </div>
        <ul className="mt-3 space-y-2">
          {reminders.map((r) => (
            <li
              key={r.id}
              className="rounded-2xl bg-blush-50 px-3.5 py-2.5 text-sm text-navy-800"
            >
              <span className="font-medium">{r.title}</span>
              <span className="block text-xs text-navy-600">Due {r.due}</span>
            </li>
          ))}
        </ul>
      </Card>
      <Card>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-teal-soft-600" aria-hidden />
            Preparation checklist
          </CardTitle>
          <Badge tone="teal">
            {done}/{prep.length} ready
          </Badge>
        </div>
        <ul className="mt-3 space-y-2">
          {prep.map((p) => (
            <li key={p.id}>
              <button
                onClick={() => onTogglePrep(p.id)}
                aria-pressed={p.done}
                className="flex w-full items-center gap-2.5 rounded-2xl px-3 py-2 text-left text-sm transition hover:bg-navy-50"
              >
                {p.done ? (
                  <CircleCheck className="h-5 w-5 shrink-0 text-teal-soft-600" aria-hidden />
                ) : (
                  <Circle className="h-5 w-5 shrink-0 text-navy-200" aria-hidden />
                )}
                <span className={p.done ? "text-navy-600/60 line-through" : "font-medium text-navy-800"}>
                  {p.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
