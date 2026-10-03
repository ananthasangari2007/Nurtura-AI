"use client";

import { useRef, useState } from "react";
import { HeartHandshake, Mic, Send, Sparkles, Square } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PROVIDER_OPTIONS, type CareRequest } from "@/lib/brief/types";
import { cn } from "@/lib/utils";

type RecInstance = {
  lang: string;
  interimResults: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function getSpeechRecognition(): (new () => RecInstance) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => RecInstance;
    webkitSpeechRecognition?: new () => RecInstance;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const REASON_HINTS = [
  "I need to talk to my doctor about my previous visit.",
  "I want to prepare for a new consultation.",
  "I want help organizing a follow-up visit.",
];

/**
 * IntakeChat — simple conversational care-request intake.
 * Only non-clinical, care-navigation questions. No triage, no advice.
 */
export function IntakeChat({
  request,
  setField,
  onAddQuestion,
  onComplete,
  onDemo,
}: {
  request: CareRequest;
  setField: (field: keyof CareRequest, value: string) => void;
  onAddQuestion: (text: string) => void;
  onComplete: () => void;
  onDemo: () => void;
}) {
  const [phase, setPhase] = useState(0);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const recRef = useRef<RecInstance | null>(null);
  const voiceSupported = getSpeechRecognition() !== null;

  function toggleListening() {
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const Rec = getSpeechRecognition();
    if (!Rec) return;
    const rec = new Rec();
    rec.lang = "en-IN";
    rec.interimResults = false;
    rec.onresult = (e) => {
      const transcript = e.results[0]?.[0]?.transcript ?? "";
      if (transcript) setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    rec.onend = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  }

  function answer(text: string) {
    const clean = text.trim();
    if (!clean) return;
    if (phase === 0) setField("reason", clean);
    if (phase === 1) setField("provider", clean);
    if (phase === 3) onAddQuestion(clean);
    if (phase === 4) setField("notes", clean);
    setInput("");
    setPhase((p) => Math.min(p + 1, 5));
  }

  const prompts = [
    "What would you like help with today? Tell me in your own words.",
    "Which doctor or care provider do you want to contact?",
    "Is this a new consultation or a follow-up?",
    "What is one question you would like to discuss? (You can add more next.)",
    "Which documents would you like to bring? Name them, or pick from your list next.",
  ];

  const summaryRows: { label: string; value: string }[] = [
    { label: "Help with", value: request.reason },
    { label: "Provider", value: request.provider },
    { label: "Visit type", value: request.kind === "" ? "" : request.kind === "new" ? "New consultation" : "Follow-up" },
  ].filter((r) => r.value !== "");

  return (
    <Card className="!p-0">
      <div className="flex items-center justify-between gap-2 border-b border-navy-100/70 px-5 py-3.5">
        <p className="flex items-center gap-2 font-display text-sm font-semibold text-navy-800">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blush-200 via-lavender-200 to-teal-soft-100">
            <HeartHandshake className="h-4 w-4 text-navy-800" aria-hidden />
          </span>
          Care request intake
        </p>
        <span className="text-xs font-medium text-navy-600">
          {phase < 5 ? `Question ${phase + 1} of 5` : "Review"}
        </span>
      </div>

      <div className="space-y-3 px-5 py-4">
        <button
          onClick={onDemo}
          className="w-full rounded-2xl bg-lavender-50 px-3.5 py-2.5 text-left text-[13px] font-medium text-navy-700 transition hover:bg-lavender-100"
        >
          <span className="flex items-center gap-1.5 font-display font-semibold text-lavender-600">
            <Sparkles className="h-3.5 w-3.5" aria-hidden /> Try the demo flow
          </span>
          “I need to talk to my doctor about my previous visit.”
        </button>

        {phase < 5 ? (
          <div className="max-w-[90%] rounded-2xl bg-navy-50 px-3.5 py-2.5 text-sm leading-relaxed text-navy-700">
            {prompts[phase]}
          </div>
        ) : (
          <div className="rounded-2xl bg-teal-soft-50 px-4 py-3">
            <p className="font-display text-sm font-semibold text-navy-800">
              Your care request is ready to review:
            </p>
            <ul className="mt-1.5 space-y-1 text-[13px] text-navy-700">
              {summaryRows.map((r) => (
                <li key={r.label}>
                  <span className="font-medium">{r.label}: </span>
                  {r.value}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Answer shortcuts per phase */}
        {phase === 0 && (
          <div className="flex flex-wrap gap-2">
            {REASON_HINTS.map((h) => (
              <button
                key={h}
                onClick={() => answer(h)}
                className="rounded-full bg-white px-3 py-1.5 text-left text-xs font-medium text-navy-700 shadow-soft transition hover:shadow-lift"
              >
                {h}
              </button>
            ))}
          </div>
        )}
        {phase === 1 && (
          <div className="flex flex-wrap gap-2">
            {PROVIDER_OPTIONS.map((p) => (
              <button
                key={p}
                onClick={() => answer(p)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium shadow-soft transition hover:shadow-lift",
                  request.provider === p
                    ? "bg-navy-800 text-white"
                    : "bg-white text-navy-700"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        )}
        {phase === 2 && (
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { v: "new", t: "New consultation", d: "First time for this concern" },
                { v: "follow-up", t: "Follow-up", d: "Continuing previous care" },
              ] as const
            ).map((o) => (
              <button
                key={o.v}
                onClick={() => {
                  setField("kind", o.v);
                  setPhase(3);
                }}
                className={cn(
                  "rounded-2xl border p-3 text-left transition",
                  request.kind === o.v
                    ? "border-navy-800 bg-navy-800 text-white"
                    : "border-navy-100 bg-white hover:border-lavender-200"
                )}
              >
                <span className="block font-display text-sm font-semibold">{o.t}</span>
                <span className={cn("block text-xs", request.kind === o.v ? "text-white/70" : "text-navy-600")}>
                  {o.d}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Free-text / voice row */}
        {phase < 5 && phase !== 2 && (
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              answer(input);
            }}
          >
            <button
              type="button"
              onClick={toggleListening}
              disabled={!voiceSupported}
              title={voiceSupported ? "Dictate with voice" : "Voice input integration-ready — will enable with microphone support"}
              aria-label={listening ? "Stop listening" : "Dictate with voice"}
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-soft transition",
                listening
                  ? "bg-blush-500 text-white"
                  : "bg-white text-navy-700 hover:shadow-lift disabled:opacity-50"
              )}
            >
              {listening ? <Square className="h-4 w-4" aria-hidden /> : <Mic className="h-4 w-4" aria-hidden />}
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={listening ? "Listening…" : "Type or dictate your answer…"}
              aria-label="Your answer"
              className="h-10 min-w-0 flex-1 rounded-full border border-navy-100 bg-white px-3.5 text-[13px] text-navy-800 outline-none placeholder:text-navy-600/50 focus:border-lavender-300"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send answer"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-800 text-white transition hover:bg-navy-900 disabled:opacity-40"
            >
              <Send className="h-4 w-4" aria-hidden />
            </button>
          </form>
        )}
        {phase === 2 && (
          <p className="text-xs text-navy-600">Choose above to continue — no medical questions, ever.</p>
        )}

        {phase === 5 && (
          <Button
            onClick={onComplete}
            disabled={request.reason.trim() === "" || request.provider === "" || request.kind === ""}
            className="w-full"
          >
            Continue to questions →
          </Button>
        )}
        {!voiceSupported && (
          <p className="text-xs text-navy-600/80">
            Voice input is integration-ready: it activates automatically in browsers with microphone support.
          </p>
        )}
      </div>
    </Card>
  );
}
