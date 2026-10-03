import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { DOC_TYPE_LABELS, type DocType } from "@/lib/documents/types";
import { cn } from "@/lib/utils";

/** Search + document-type filter for the library. */
export function LibraryFilters({
  query,
  onQuery,
  active,
  onChange,
}: {
  query: string;
  onQuery: (q: string) => void;
  active: "all" | DocType;
  onChange: (t: "all" | DocType) => void;
}) {
  const pills: ("all" | DocType)[] = [
    "all",
    "appointment-slip",
    "referral-slip",
    "prescription",
    "report",
    "insurance",
  ];
  return (
    <div className="space-y-2.5">
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-navy-600/60"
          aria-hidden
        />
        <Input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search documents…"
          aria-label="Search documents"
          className="!pl-10"
        />
      </div>
      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filter by document type">
        {pills.map((p) => {
          const selected = active === p;
          return (
            <button
              key={p}
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(p)}
              className={cn(
                "rounded-full px-3 py-1.5 font-display text-xs font-medium transition",
                selected
                  ? "bg-navy-800 text-white shadow-soft"
                  : "bg-white text-navy-600 shadow-soft hover:text-navy-800"
              )}
            >
              {p === "all" ? "All" : DOC_TYPE_LABELS[p]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
