"use client";

import { ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SCOPE_META, type ShareScope } from "@/lib/handoff/types";

/** Consent screen — explicit patient approval before anything is generated. */
export function ConsentScreen({
  open,
  scope,
  counts,
  generating,
  error,
  onClose,
  onConfirm,
}: {
  open: boolean;
  scope: ShareScope;
  counts: { events: number; questions: number; documents: number };
  generating: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  const enabled = SCOPE_META.filter((s) => scope[s.id]);
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-navy-900/40 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Consent to share"
      onClick={onClose}
    >
      <div
        className="animate-slide-up w-full max-w-lg rounded-3xl bg-white p-5 shadow-lift sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-soft-100">
            <ShieldCheck className="h-6 w-6 text-teal-soft-700" aria-hidden />
          </span>
          <button
            onClick={onClose}
            aria-label="Close consent"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-50 text-navy-700 transition hover:bg-navy-100"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <h2 className="mt-4 font-display text-xl font-semibold text-navy-800">
          You choose what to share.
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-navy-600">
          This passport opens for 24 hours and only contains what you ticked
          below. You can revoke it at any moment. Prototype demo — not
          production medical interoperability.
        </p>
        <ul className="mt-4 space-y-1.5">
          {enabled.map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between rounded-2xl bg-teal-soft-50 px-3.5 py-2.5 text-sm"
            >
              <span className="font-medium text-navy-800">{s.label}</span>
              <span className="text-xs text-navy-600">
                {s.id === "questions" && `${counts.questions} selected`}
                {s.id === "timeline" && `${counts.events} selected`}
                {s.id === "documents" && `${counts.documents} selected`}
                {s.id === "appointments" && "Oct 10 visit"}
                {s.id === "followups" && "Reminders + next steps"}
              </span>
            </li>
          ))}
          {enabled.length === 0 && (
            <li className="rounded-2xl bg-blush-50 px-3.5 py-2.5 text-sm text-navy-700">
              Nothing selected — go back and tick at least one category.
            </li>
          )}
        </ul>
        {error && (
          <p role="alert" className="mt-2 text-[13px] font-medium text-blush-600">
            {error}
          </p>
        )}
        <div className="mt-4 flex gap-2.5">
          <Button onClick={onConfirm} disabled={generating || enabled.length === 0} className="flex-1">
            <ShieldCheck className="h-4 w-4" aria-hidden />
            {generating ? "Creating…" : "I consent — create passport"}
          </Button>
          <Button variant="soft" onClick={onClose}>
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
