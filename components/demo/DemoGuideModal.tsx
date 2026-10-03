"use client";

import { useState } from "react";
import Link from "next/link";
import { ClipboardCopy, MonitorPlay, X } from "lucide-react";
import { DEMO_PATIENT_NOTE, DEMO_STEPS } from "@/lib/demo/guide";

/** Demo Mode guide — the 13-step, 3-minute hackathon path. */
export function DemoGuideModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  if (!open) return null;
  const line = DEMO_STEPS[2].say ?? "";

  async function copyLine() {
    try {
      await navigator.clipboard.writeText(line);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-navy-900/40 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Demo mode guide"
      onClick={onClose}
    >
      <div
        className="animate-slide-up max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-5 shadow-lift sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full bg-blush-100 px-3 py-1 font-display text-[11px] font-semibold tracking-wide text-blush-600 uppercase">
              <MonitorPlay className="h-3.5 w-3.5" aria-hidden /> Demo mode · ~3 min
            </p>
            <h2 className="mt-2 font-display text-lg font-semibold text-navy-800">
              The guided journey
            </h2>
            <p className="mt-0.5 text-[13px] text-navy-600">{DEMO_PATIENT_NOTE}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close demo guide"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-700 transition hover:bg-navy-100"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <button
          onClick={copyLine}
          className="mt-3 flex w-full items-center gap-2 rounded-2xl bg-navy-800 px-3.5 py-2.5 text-left text-[13px] text-white transition hover:bg-navy-900"
          aria-label="Copy the demo phrase"
        >
          <ClipboardCopy className="h-4 w-4 shrink-0" aria-hidden />
          <span className="min-w-0 flex-1 truncate">“{line}”</span>
          <span className="shrink-0 text-xs text-white/70">{copied ? "Copied" : "Copy"}</span>
        </button>

        <ol className="mt-4 space-y-1.5">
          {DEMO_STEPS.map((s) => (
            <li key={s.n}>
              <Link
                href={s.href}
                onClick={onClose}
                className="group flex items-center gap-3 rounded-2xl px-3 py-2 transition hover:bg-navy-50"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lavender-100 font-display text-xs font-semibold text-lavender-600">
                  {s.n}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-sm font-semibold text-navy-800">
                    {s.title}
                  </span>
                  <span className="block truncate text-xs text-navy-600">{s.detail}</span>
                </span>
                <span className="shrink-0 font-display text-xs font-medium text-lavender-600 group-hover:underline">
                  {s.cta} →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
