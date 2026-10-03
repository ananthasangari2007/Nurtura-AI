import { ShieldCheck } from "lucide-react";

export function SafetyBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border border-teal-soft-100 bg-teal-soft-50 text-teal-soft-700 ${
        compact ? "p-3 text-[13px]" : "p-4 text-sm"
      }`}
      role="note"
      aria-label="Safety notice"
    >
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white shadow-soft">
        <ShieldCheck className="h-4 w-4" aria-hidden />
      </span>
      <p className="leading-relaxed">
        <span className="font-display font-semibold">Nurtura is not a doctor. </span>
        Nurtura AI supports care navigation and organization. Clinical decisions
        remain with healthcare professionals — it never diagnoses, prescribes,
        or interprets medical reports.
      </p>
    </div>
  );
}
