"use client";

import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import {
  JOURNEY_SUGGESTIONS,
  answerJourneyQuestion,
} from "@/lib/journey/memory";
import { validateAIResponse } from "@/lib/safety/policy";
import type { CareEvent } from "@/lib/mock-data";

/**
 * AskJourney — "Ask my journey" recall interface.
 * Answers are computed from structured demo data only; nothing is invented.
 */
export function AskJourney({
  events,
  onHighlight,
}: {
  events: CareEvent[];
  onHighlight: (id: string) => void;
}) {
  const [input, setInput] = useState("");
  const [asked, setAsked] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(
    "Ask me about your visits, documents, saved questions, or what's next — I'll recall it from your organized journey."
  );
  const [related, setRelated] = useState<string[]>([]);

  function ask(text: string) {
    const prompt = text.trim();
    if (!prompt) return;
    const result = answerJourneyQuestion(prompt, events);
    // Every recall passes the central safety gate before display.
    const verdict = validateAIResponse(result.answer);
    setAsked(prompt);
    setAnswer(verdict.reply);
    setRelated(verdict.allowed ? result.relatedEventIds : []);
    setInput("");
  }

  return (
    <Card>
      <CardTitle className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-blush-500" aria-hidden />
        Ask my journey
      </CardTitle>
      <CardDescription>
        Recall from your organized memory — never invented, never clinical.
      </CardDescription>

      <div className="mt-3 flex flex-wrap gap-2">
        {JOURNEY_SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => ask(s)}
            className="rounded-full bg-lavender-50 px-3 py-1.5 text-xs font-medium text-navy-700 transition hover:bg-lavender-100"
          >
            {s}
          </button>
        ))}
      </div>

      {asked && (
        <p className="mt-3 rounded-2xl bg-navy-800 px-3.5 py-2.5 text-[13px] font-medium text-white">
          {asked}
        </p>
      )}
      {answer && (
        <p className="mt-2 rounded-2xl bg-navy-50 px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-line text-navy-700">
          {answer}
        </p>
      )}
      {related.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {related.map((id) => {
            const ev = events.find((e) => e.id === id);
            if (!ev) return null;
            return (
              <button
                key={id}
                onClick={() => onHighlight(id)}
                className="rounded-full border border-lavender-200 bg-white px-3 py-1 text-xs font-medium text-lavender-600 transition hover:bg-lavender-50"
              >
                Open: {ev.title} →
              </button>
            );
          })}
        </div>
      )}

      <form
        className="mt-3 flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. What was my last appointment?"
          aria-label="Ask about your journey"
          className="h-10 min-w-0 flex-1 rounded-full border border-navy-100 bg-white px-3.5 text-[13px] text-navy-800 outline-none placeholder:text-navy-600/50 focus:border-lavender-300"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          aria-label="Ask"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-800 text-white transition hover:bg-navy-900 disabled:opacity-40"
        >
          <Send className="h-4 w-4" aria-hidden />
        </button>
      </form>
    </Card>
  );
}
