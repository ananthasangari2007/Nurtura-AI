import { CalendarPlus, SearchX } from "lucide-react";
import { Button } from "@/components/ui/Button";

/** Empty states for a filtered (or brand-new) journey. */
export function JourneyEmptyState({
  filterLabel,
  onAdd,
  onClear,
}: {
  filterLabel: string;
  onAdd: () => void;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col items-center rounded-[1.25rem] border border-dashed border-lavender-200 bg-lavender-50/60 px-6 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-soft">
        <SearchX className="h-6 w-6 text-lavender-500" aria-hidden />
      </span>
      <h3 className="mt-4 font-display text-lg font-semibold text-navy-800">
        No {filterLabel.toLowerCase()} memories yet
      </h3>
      <p className="mt-1 max-w-sm text-sm leading-relaxed text-navy-600">
        Your journey only holds what you add — visits, papers, questions, and
        reminders. Nothing clinical is ever inferred or stored.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2.5">
        <Button size="sm" onClick={onAdd}>
          <CalendarPlus className="h-4 w-4" aria-hidden />
          Add journey event
        </Button>
        <Button size="sm" variant="soft" onClick={onClear}>
          Show everything
        </Button>
      </div>
    </div>
  );
}
