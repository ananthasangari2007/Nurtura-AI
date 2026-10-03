"use client";

import { useState } from "react";
import { Check, Lock } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { CONSENT_META } from "@/lib/privacy/consent";
import { useConsent } from "@/lib/privacy/ConsentProvider";
import { cn } from "@/lib/utils";

/** Global consent dashboard — patient-controlled sharing toggles. */
export function PrivacyControls() {
  const { consent, toggle, reset } = useConsent();
  const on = CONSENT_META.filter((m) => consent[m.id]).length;
  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-teal-soft-600" aria-hidden />
            Consent controls
          </CardTitle>
          <CardDescription>
            You control every share. Changes apply instantly across passports,
            caregivers, and reminders.
          </CardDescription>
        </div>
        <span className="shrink-0 font-display text-xs font-medium text-navy-600">
          {on}/{CONSENT_META.length} on
        </span>
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {CONSENT_META.map((m) => {
          const granted = consent[m.id];
          return (
            <li key={m.id}>
              <button
                onClick={() => toggle(m.id)}
                role="switch"
                aria-checked={granted}
                aria-label={`${granted ? "Revoke" : "Grant"} consent: ${m.label}`}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-2xl border p-3 text-left transition",
                  granted ? "border-teal-soft-200 bg-teal-soft-50" : "border-navy-100/70 bg-white"
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2",
                    granted ? "border-teal-soft-500 bg-teal-soft-500 text-white" : "border-navy-200 bg-white"
                  )}
                  aria-hidden
                >
                  {granted && <Check className="h-3.5 w-3.5" />}
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-medium text-navy-800">{m.label}</span>
                  <span className="block truncate text-xs text-navy-600">{m.detail}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <button
        onClick={reset}
        className="mt-3 font-display text-[13px] font-medium text-lavender-600"
      >
        Reset to privacy-first defaults
      </button>
    </Card>
  );
}

/** Slim demo notice — no real patient data, prototype only. */
export function DemoPrivacyNotice({ onDismiss }: { onDismiss: () => void }) {
  const [leaving, setLeaving] = useState(false);
  return (
    <div
      role="note"
      aria-label="Demo privacy notice"
      className="flex items-center gap-2.5 border-b border-navy-100/70 bg-navy-800 px-4 py-2 text-white sm:px-6"
    >
      <Lock className="h-3.5 w-3.5 shrink-0 text-teal-soft-200" aria-hidden />
      <p className="min-w-0 flex-1 truncate text-xs">
        <span className="font-display font-semibold">Demo prototype — </span>
        <span className="text-white/75">
          sample data only. Do not enter real patient information.
        </span>
      </p>
      <button
        onClick={() => {
          setLeaving(true);
          setTimeout(onDismiss, 150);
        }}
        aria-label="Dismiss demo notice"
        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium text-white/70 transition hover:text-white ${leaving ? "opacity-0" : ""}`}
      >
        Dismiss
      </button>
    </div>
  );
}
