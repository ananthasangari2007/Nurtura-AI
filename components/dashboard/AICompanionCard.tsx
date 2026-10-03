"use client";

import { useState } from "react";
import Link from "next/link";
import { HeartHandshake, Send, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * AICompanionCard — floating "AI Care Navigator" assistant.
 * Designed as a care-guide panel (suggestion chips + guided help),
 * not a generic chatbot window.
 */
const SUGGESTIONS = [
  "Prepare my next visit",
  "Organize my documents",
  "What should I ask?",
];

export function AICompanionCard() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [reply, setReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function ask(text: string) {
    const prompt = text.trim();
    if (!prompt || loading) return;
    setLoading(true);
    setReply(null);
    try {
      const res = await fetch("/api/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = (await res.json()) as { reply?: string };
      setReply(data.reply ?? "I couldn't organize that just now — please try again.");
    } catch {
      setReply("Demo mode: I'm offline right now. Your visit brief and checklist are still available.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating launcher */}
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? "Close care navigator" : "Open care navigator"}
        className={cn(
          "fixed right-4 bottom-24 z-40 flex items-center gap-2.5 rounded-full py-2 pr-5 pl-2 shadow-lift transition hover:-translate-y-0.5 sm:right-6 lg:bottom-8",
          open ? "bg-navy-800 text-white" : "bg-white text-navy-800 ring-1 ring-navy-100"
        )}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blush-200 via-lavender-200 to-teal-soft-100 text-navy-800">
          {open ? (
            <X className="h-5 w-5" aria-hidden />
          ) : (
            <HeartHandshake className="h-5 w-5" aria-hidden />
          )}
        </span>
        <span className="text-left leading-tight">
          <span className="flex items-center gap-1 font-display text-[13px] font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-blush-500" aria-hidden />
            Care Navigator
          </span>
          <span className={cn("block text-[11px]", open ? "text-white/70" : "text-navy-600")}>
            {open ? "Close panel" : "How can I help?"}
          </span>
        </span>
      </button>

      {/* Assistant panel */}
      {open && (
        <section
          aria-label="AI Care Navigator"
          className="animate-slide-up fixed right-4 bottom-40 z-40 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-3xl border border-white bg-white shadow-lift sm:right-6 lg:bottom-24"
        >
          <div className="bg-navy-800 px-5 py-4 text-white">
            <p className="flex items-center gap-1.5 font-display text-sm font-semibold">
              <HeartHandshake className="h-4 w-4" aria-hidden />
              AI Care Navigator
            </p>
            <p className="mt-0.5 text-[13px] text-white/75">
              How can I help with your care journey?
            </p>
          </div>
          <div className="space-y-3 px-5 py-4">
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => void ask(s)}
                  disabled={loading}
                  className="rounded-full bg-lavender-50 px-3 py-1.5 text-xs font-medium text-navy-700 transition hover:bg-lavender-100 disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
            {loading && (
              <p className="text-[13px] text-navy-600">
                Organizing your next step…
              </p>
            )}
            {reply && (
              <p className="max-h-40 overflow-y-auto rounded-2xl bg-navy-50 px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-line text-navy-700">
                {reply}
              </p>
            )}
            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                setInput("");
                void ask(input);
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about visits, prep…"
                aria-label="Ask the care navigator"
                className="h-10 min-w-0 flex-1 rounded-full border border-navy-100 bg-white px-3.5 text-[13px] text-navy-800 outline-none placeholder:text-navy-600/50 focus:border-lavender-300"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-800 text-white transition hover:bg-navy-900 disabled:opacity-40"
              >
                <Send className="h-4 w-4" aria-hidden />
              </button>
            </form>
            <Link
              href="/voice"
              className="block text-center font-display text-xs font-medium text-lavender-600"
            >
              Open full voice companion →
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
