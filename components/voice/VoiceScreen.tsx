"use client";

import { useState } from "react";
import { MicOff } from "lucide-react";
import { SafetyBanner } from "@/components/ui/SafetyBanner";
import { FlowNext } from "@/components/ui/FlowNext";
import { SectionHeading } from "@/components/ui/Section";
import {
  VOICE_LANGUAGES,
  classifyIntent,
  generateNavigationResponse,
  isClinicalRequest,
  SAFE_BOUNDARY,
  summarizePatientInput,
  type NavigatorIntent,
  type VoiceLang,
} from "@/lib/ai/navigator";
import { validateAIResponse } from "@/lib/safety/policy";
import { isVoiceSupported, speakReply, stopSpeaking } from "@/lib/voice/speech";
import { useMounted } from "@/lib/client/use-mounted";
import { MicButton } from "./MicButton";
import { LanguageSelector } from "./LanguageSelector";
import { TranscriptCard } from "./TranscriptCard";
import { NavigatorPanel, type NavMessage } from "./NavigatorPanel";

const GREETINGS: Record<VoiceLang, string> = {
  en: "Hello! I'm Nurtura — tell me what you need, and I'll guide you to the right place. I organize care journeys; I never diagnose.",
  ta: "வணக்கம்! நான் நர்துரா — உங்களுக்கு என்ன தேவை என்று சொல்லுங்கள், சரியான இடத்திற்கு வழிகாட்டுகிறேன்.",
  hi: "नमस्ते! मैं नर्चुरा हूँ — आपको क्या चाहिए बताइए, मैं आपको सही जगह ले चलूँगा।",
};

const STARTERS = [
  { text: "I need to prepare for my doctor's appointment.", hint: "Routes to Doctor Brief" },
  { text: "I want to see my next appointment.", hint: "Routes to appointments" },
  { text: "Show my care journey.", hint: "Routes to Care Journey" },
];

let msgId = 0;
const nextId = () => `msg-${Date.now()}-${msgId++}`;

/** VoiceScreen — multilingual voice + AI Care Navigator. */
export function VoiceScreen() {
  const mounted = useMounted();
  const [lang, setLang] = useState<VoiceLang>("en");
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [messages, setMessages] = useState<NavMessage[]>([
    { id: "greet", role: "assistant", text: GREETINGS.en },
  ]);

  const locale = VOICE_LANGUAGES.find((l) => l.id === lang)?.locale ?? "en-IN";

  /** Offline-safe fallback: same deterministic engine, run locally. */
  function localNavigate(text: string): {
    intent: NavigatorIntent;
    reply: string;
    route: string;
    boundary: boolean;
    summary: string;
  } {
    if (isClinicalRequest(text)) {
      return {
        intent: "GENERAL_NAVIGATION",
        reply: SAFE_BOUNDARY,
        route: "/doctor-brief",
        boundary: true,
        summary: summarizePatientInput(text, lang),
      };
    }
    const { intent } = classifyIntent(text);
    const { reply, route } = generateNavigationResponse(text, intent, lang);
    // Offline fallback still passes the central safety gate.
    const verdict = validateAIResponse(reply);
    return { intent, reply: verdict.reply, route, boundary: !verdict.allowed, summary: summarizePatientInput(text, lang) };
  }

  async function send(text?: string) {
    const clean = (text ?? transcript).trim();
    if (!clean || thinking) return;
    stopSpeaking();
    setSpeakingId(null);
    setTranscript("");
    setInterim("");
    setMessages((m) => [...m, { id: nextId(), role: "user", text: clean }]);
    setThinking(true);
    try {
      const res = await fetch("/api/navigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: clean, lang }),
      });
      if (!res.ok) throw new Error("navigate failed");
      const data = (await res.json()) as {
        intent: NavigatorIntent;
        reply: string;
        route: string;
        boundaryHit: boolean;
        summary: string;
      };
      const id = nextId();
      setMessages((m) => [
        ...m,
        { id, role: "assistant", text: data.reply, intent: data.intent, route: data.route, boundary: data.boundaryHit, summary: data.summary },
      ]);
      setSpeakingId(id);
      speakReply(data.reply, locale);
    } catch {
      const local = localNavigate(clean);
      const id = nextId();
      setMessages((m) => [
        ...m,
        { id, role: "assistant", text: local.reply, intent: local.intent, route: local.route, boundary: local.boundary, summary: local.summary },
      ]);
    } finally {
      setThinking(false);
    }
  }

  function toggleSpeak(id: string, text: string) {
    if (speakingId === id) {
      stopSpeaking();
      setSpeakingId(null);
      return;
    }
    stopSpeaking();
    setSpeakingId(id);
    speakReply(text, locale);
    // Reset the badge when the utterance naturally ends.
    setTimeout(() => setSpeakingId((cur) => (cur === id ? null : cur)), Math.min(15000, 3000 + text.length * 60));
  }

  return (
    <div className="space-y-5">
      <SectionHeading
        eyebrow="Voice + Care Navigator"
        title="Tell Nurtura what you need."
        description="Speak or type in English, தமிழ், or हिन्दी — Nurtura understands your need and walks you to the right place. Care navigation only, never diagnosis."
      />

      <div className="grid items-start gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Mic + language + transcript */}
        <div className="space-y-4">
          <div className="animate-fade-up flex flex-col items-center rounded-[1.75rem] border border-white bg-white px-6 py-8 text-center shadow-soft">
            <MicButton
              locale={locale}
              listening={listening}
              onListeningChange={setListening}
              onInterim={setInterim}
              onFinal={(t) => setTranscript((prev) => (prev ? `${prev} ${t}` : t))}
              onUnsupported={() =>
                setMessages((m) => [
                  ...m,
                  {
                    id: nextId(),
                    role: "assistant",
                    text: "This browser doesn't share its microphone with me yet — please type below instead. Your words still reach the same navigator.",
                  },
                ])
              }
            />
            <p className="mt-4 font-display text-lg font-semibold text-navy-800">
              {listening ? "Listening… speak now" : "Tell Nurtura what you need."}
            </p>
            <p className="mt-1 max-w-xs text-[13px] text-navy-600">
              {listening
                ? "Your words appear below — pause, and I'll stop."
                : "One tap, then speak naturally. Review the transcript before sending."}
            </p>
            {mounted && !isVoiceSupported() && (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-navy-50 px-3 py-1.5 text-xs font-medium text-navy-600">
                <MicOff className="h-3.5 w-3.5" aria-hidden />
                Mic unavailable here — typing works fully
              </p>
            )}
          </div>

          <div className="animate-fade-up rounded-[1.25rem] border border-white bg-white p-5 shadow-soft" style={{ animationDelay: "80ms" }}>
            <LanguageSelector value={lang} onChange={setLang} />
          </div>

          <div className="animate-fade-up" style={{ animationDelay: "140ms" }}>
            <TranscriptCard
              transcript={transcript}
              interim={interim}
              listening={listening}
              sending={thinking}
              onEdit={setTranscript}
              onSend={() => void send()}
              onClear={() => {
                setTranscript("");
                setInterim("");
              }}
            />
          </div>
        </div>

        {/* Assistant */}
        <div className="animate-fade-up min-w-0" style={{ animationDelay: "100ms" }}>
          <NavigatorPanel
            messages={messages}
            lang={lang}
            thinking={thinking}
            onSpeak={toggleSpeak}
            speakingId={speakingId}
            starters={STARTERS}
            onStarter={(t) => void send(t)}
          />
        </div>
      </div>

      <FlowNext from="/voice" />

      <SafetyBanner />
    </div>
  );
}
