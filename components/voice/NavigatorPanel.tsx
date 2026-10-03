"use client";

import Link from "next/link";
import { ArrowRight, HeartHandshake, Navigation, ShieldAlert, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { NavigatorIntent, VoiceLang } from "@/lib/ai/navigator";
import { INTENT_DESTINATIONS } from "@/lib/ai/navigator";
import { cn } from "@/lib/utils";

export type NavMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  intent?: NavigatorIntent;
  route?: string;
  boundary?: boolean;
  summary?: string;
};

/** AI assistant interface — intent-labeled replies with routing actions. */
export function NavigatorPanel({
  messages,
  lang,
  thinking,
  onSpeak,
  speakingId,
  starters,
  onStarter,
}: {
  messages: NavMessage[];
  lang: VoiceLang;
  thinking: boolean;
  onSpeak: (id: string, text: string) => void;
  speakingId: string | null;
  starters: { text: string; hint: string }[];
  onStarter: (text: string) => void;
}) {
  return (
    <div className="flex min-h-[480px] flex-col overflow-hidden rounded-[1.25rem] border border-white bg-white shadow-soft">
      <div className="flex items-center justify-between border-b border-navy-100/70 px-5 py-3.5">
        <p className="flex items-center gap-2 font-display text-sm font-semibold text-navy-800">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blush-200 via-lavender-200 to-teal-soft-100">
            <HeartHandshake className="h-4 w-4 text-navy-800" aria-hidden />
          </span>
          AI Care Navigator
        </p>
        <Badge tone="teal">Care navigation only</Badge>
      </div>

      <div className="max-h-[380px] flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {messages.map((m) =>
          m.role === "user" ? (
            <div key={m.id} className="flex justify-end">
              <p className="max-w-[85%] rounded-2xl bg-navy-800 px-3.5 py-2.5 text-sm leading-relaxed text-white">
                {m.text}
              </p>
            </div>
          ) : (
            <div key={m.id} className="flex justify-start">
              <div className="max-w-[90%] space-y-2 rounded-2xl bg-navy-50 px-3.5 py-2.5 text-sm leading-relaxed text-navy-700">
                <p className="flex flex-wrap items-center gap-1.5">
                  {m.boundary ? (
                    <Badge tone="blush">
                      <ShieldAlert className="h-3 w-3" aria-hidden />
                      Care boundary
                    </Badge>
                  ) : (
                    m.intent && (
                      <Badge tone="lavender">
                        <Navigation className="h-3 w-3" aria-hidden />
                        {m.intent}
                      </Badge>
                    )
                  )}
                </p>
                <p className="whitespace-pre-line">{m.text}</p>
                {m.summary && (
                  <p className="rounded-xl bg-white/80 px-2.5 py-1.5 text-xs text-navy-600 italic">
                    {m.summary}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  {m.route && (
                    <Link
                      href={m.route}
                      className="inline-flex items-center gap-1 rounded-full bg-navy-800 px-3.5 py-1.5 font-display text-xs font-medium text-white transition hover:bg-navy-900"
                    >
                      {m.intent
                        ? INTENT_DESTINATIONS[m.intent].action[lang]
                        : "Open"}{" "}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                  )}
                  <button
                    onClick={() => onSpeak(m.id, m.text)}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-medium transition",
                      speakingId === m.id
                        ? "bg-blush-100 text-blush-600"
                        : "text-navy-600 hover:bg-white"
                    )}
                    aria-label={speakingId === m.id ? "Stop reading aloud" : "Read reply aloud"}
                  >
                    <Volume2 className="h-3.5 w-3.5" aria-hidden />
                    {speakingId === m.id ? "Playing…" : "Listen"}
                  </button>
                </div>
              </div>
            </div>
          )
        )}
        {thinking && <p className="text-sm text-navy-600">Understanding your need…</p>}
      </div>

      <div className="border-t border-navy-100/70 px-5 py-3.5">
        <p className="mb-2 font-display text-xs font-semibold tracking-wide text-navy-600 uppercase">
          Try saying
        </p>
        <div className="flex flex-wrap gap-2">
          {starters.map((s) => (
            <button
              key={s.text}
              onClick={() => onStarter(s.text)}
              title={s.hint}
              className="rounded-full bg-lavender-50 px-3 py-1.5 text-left text-xs font-medium text-navy-700 transition hover:bg-lavender-100"
            >
              “{s.text}”
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
