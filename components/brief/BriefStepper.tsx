import { Check } from "lucide-react";
import { BRIEF_STEPS, type BriefStepId } from "@/lib/brief/types";
import { cn } from "@/lib/utils";

/** Step indicator for the brief builder workflow. */
export function BriefStepper({
  step,
  onGo,
}: {
  step: BriefStepId;
  onGo: (step: BriefStepId) => void;
}) {
  const idx = BRIEF_STEPS.findIndex((s) => s.id === step);
  return (
    <ol className="flex items-center gap-1 sm:gap-2" aria-label="Brief builder steps">
      {BRIEF_STEPS.map((s, i) => {
        const done = i < idx;
        const current = i === idx;
        return (
          <li key={s.id} className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2">
            <button
              onClick={() => onGo(s.id)}
              aria-current={current ? "step" : undefined}
              className={cn(
                "flex min-w-0 flex-1 items-center gap-2 rounded-full px-2 py-1.5 text-left transition sm:px-3",
                current ? "bg-navy-800 text-white shadow-soft" : "hover:bg-white"
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-display text-[11px] font-semibold",
                  done
                    ? "bg-teal-soft-500 text-white"
                    : current
                      ? "bg-white/20 text-white"
                      : "bg-navy-100 text-navy-600"
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" aria-hidden /> : i + 1}
              </span>
              <span
                className={cn(
                  "hidden truncate font-display text-xs font-medium md:block",
                  current ? "text-white" : "text-navy-600"
                )}
              >
                {s.label}
              </span>
            </button>
            {i < BRIEF_STEPS.length - 1 && (
              <span aria-hidden className="h-px w-2 shrink-0 bg-navy-100 sm:w-4" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
