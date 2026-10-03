"use client";

import { Languages } from "lucide-react";
import { VOICE_LANGUAGES, type VoiceLang } from "@/lib/ai/navigator";
import { cn } from "@/lib/utils";

/** Language selector — English · தமிழ் · हिन्दी. */
export function LanguageSelector({
  value,
  onChange,
}: {
  value: VoiceLang;
  onChange: (lang: VoiceLang) => void;
}) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 font-display text-[13px] font-semibold text-navy-700">
        <Languages className="h-4 w-4" aria-hidden />
        Language · மொழி · भाषा
      </p>
      <div
        className="grid grid-cols-3 gap-1 rounded-2xl bg-navy-50 p-1"
        role="radiogroup"
        aria-label="Response language"
      >
        {VOICE_LANGUAGES.map((l) => {
          const active = value === l.id;
          return (
            <button
              key={l.id}
              role="radio"
              aria-checked={active}
              onClick={() => onChange(l.id)}
              className={cn(
                "rounded-xl px-2 py-2 text-center transition",
                active ? "bg-navy-800 text-white shadow-soft" : "text-navy-600 hover:text-navy-800"
              )}
            >
              <span className="block font-display text-[13px] font-semibold">{l.native}</span>
              <span className={cn("block text-[11px]", active ? "text-white/70" : "text-navy-600/70")}>
                {l.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
