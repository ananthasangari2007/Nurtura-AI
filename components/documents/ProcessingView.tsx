import { Check, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PROCESS_STEPS } from "@/lib/documents/use-documents";
import { cn } from "@/lib/utils";

/** Processing animation: "Organizing your document..." with staged steps. */
export function ProcessingView({ step }: { step: number }) {
  return (
    <div
      className="rounded-[1.25rem] border border-lavender-200 bg-white p-5 shadow-soft sm:p-6"
      role="status"
      aria-live="polite"
      aria-label="Organizing your document"
    >
      <div className="flex items-center gap-3">
        <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-lavender-100">
          <FolderOpen className="h-5 w-5 text-lavender-600" aria-hidden />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="absolute h-full w-full animate-ping rounded-full bg-blush-400 opacity-60" />
            <span className="h-4 w-4 rounded-full bg-blush-500" />
          </span>
        </span>
        <div>
          <h2 className="font-display text-[17px] font-semibold text-navy-800">
            Organizing your document…
          </h2>
          <p className="text-[13px] text-navy-600">
            Reading admin details only — medical content is never interpreted.
          </p>
        </div>
      </div>
      <ol className="mt-4 space-y-2">
        {PROCESS_STEPS.map((label, i) => {
          const done = i < step;
          const current = i === step;
          return (
            <li
              key={label}
              className={cn(
                "flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-sm transition",
                done
                  ? "bg-teal-soft-50 text-navy-700"
                  : current
                    ? "bg-lavender-50 text-navy-800"
                    : "bg-navy-50/60 text-navy-600/60"
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                  done
                    ? "bg-teal-soft-500 text-white"
                    : current
                      ? "bg-lavender-500 text-white"
                      : "bg-navy-100 text-navy-600/60"
                )}
              >
                {done ? (
                  <Check className="h-3.5 w-3.5" aria-hidden />
                ) : (
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full bg-current",
                      current && "animate-pulse"
                    )}
                  />
                )}
              </span>
              {label}
            </li>
          );
        })}
      </ol>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-navy-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blush-300 via-lavender-300 to-teal-soft-200 transition-all duration-500"
          style={{ width: `${((step + 1) / PROCESS_STEPS.length) * 100}%` }}
        />
      </div>
    </div>
  );
}

/** Empty states for the library (no docs at all / no search matches). */
export function DocumentsEmptyState({
  searching,
  onClear,
}: {
  searching: boolean;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col items-center rounded-[1.25rem] border border-dashed border-lavender-200 bg-lavender-50/60 px-6 py-10 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-soft">
        <FolderOpen className="h-6 w-6 text-lavender-500" aria-hidden />
      </span>
      <h3 className="mt-4 font-display text-lg font-semibold text-navy-800">
        {searching ? "No documents match" : "No documents yet"}
      </h3>
      <p className="mt-1 max-w-sm text-sm leading-relaxed text-navy-600">
        {searching
          ? "Try a different name or document type — your uploads stay organized here."
          : "Upload your first slip or card above. Nurtura will organize it into plain next steps."}
      </p>
      {searching && (
        <div className="mt-4">
          <Button size="sm" variant="soft" onClick={onClear}>
            Clear search & filters
          </Button>
        </div>
      )}
    </div>
  );
}
