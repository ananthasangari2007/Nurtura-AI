import { Check, FolderOpen } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { BriefDocument } from "@/lib/brief/types";

/** Document selection — choose the carry-pack for the visit. */
export function DocumentPicker({
  documents,
  onToggle,
}: {
  documents: BriefDocument[];
  onToggle: (id: string) => void;
}) {
  const selected = documents.filter((d) => d.selected).length;
  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <div>
          <CardTitle>Documents to bring</CardTitle>
          <CardDescription>
            Papers become a packing list — never interpreted medically.
          </CardDescription>
        </div>
        <Badge tone="teal">{selected} selected</Badge>
      </div>
      <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {documents.map((d) => (
          <li key={d.id}>
            <button
              onClick={() => onToggle(d.id)}
              aria-pressed={d.selected}
              className={cn(
                "flex w-full items-start gap-3 rounded-2xl border p-3.5 text-left transition hover:shadow-soft",
                d.selected
                  ? "border-teal-soft-200 bg-teal-soft-50"
                  : "border-navy-100/70 bg-white"
              )}
            >
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
                  d.selected
                    ? "bg-teal-soft-500 text-white"
                    : "bg-navy-50 text-navy-600"
                )}
              >
                {d.selected ? (
                  <Check className="h-5 w-5" aria-hidden />
                ) : (
                  <FolderOpen className="h-5 w-5" aria-hidden />
                )}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-navy-800">
                  {d.name}
                </span>
                <span className="block text-xs text-navy-600">{d.detail}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
