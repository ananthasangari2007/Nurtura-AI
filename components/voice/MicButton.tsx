"use client";

import { useRef, useState } from "react";
import { Mic, Square } from "lucide-react";
import { getSpeechRecognition, type RecInstance } from "@/lib/voice/speech";
import { cn } from "@/lib/utils";

/** Large microphone button — Web Speech API with interim transcripts. */
export function MicButton({
  locale,
  listening,
  onListeningChange,
  onInterim,
  onFinal,
  onUnsupported,
}: {
  locale: string;
  listening: boolean;
  onListeningChange: (on: boolean) => void;
  onInterim: (text: string) => void;
  onFinal: (text: string) => void;
  onUnsupported: () => void;
}) {
  const recRef = useRef<RecInstance | null>(null);
  const [wobble, setWobble] = useState(false);

  function toggle() {
    if (listening) {
      try {
        recRef.current?.stop();
      } catch {
        // Stopping an idle recognizer — safe to ignore.
      }
      onListeningChange(false);
      onInterim("");
      return;
    }
    const Rec = getSpeechRecognition();
    if (!Rec) {
      onUnsupported();
      setWobble(true);
      setTimeout(() => setWobble(false), 600);
      return;
    }
    try {
      recRef.current?.abort();
    } catch {
      // No active session — safe to ignore.
    }
    const rec = new Rec();
    rec.lang = locale;
    rec.interimResults = true;
    rec.continuous = false;
    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i]?.[0]?.transcript ?? "";
        if (e.results[i]?.isFinal) {
          if (transcript.trim()) onFinal(transcript.trim());
        } else {
          interim += transcript;
        }
      }
      onInterim(interim);
    };
    rec.onend = () => {
      onListeningChange(false);
      onInterim("");
    };
    rec.onerror = () => {
      onListeningChange(false);
      onInterim("");
    };
    recRef.current = rec;
    try {
      rec.start();
      onListeningChange(true);
    } catch {
      onUnsupported();
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={listening ? "Stop listening" : "Start listening — tell Nurtura what you need"}
      aria-pressed={listening}
      className={cn(
        "relative flex h-24 w-24 items-center justify-center rounded-full shadow-lift transition active:scale-95",
        listening ? "bg-blush-500 text-white" : "bg-navy-800 text-white hover:bg-navy-900",
        wobble && "animate-[fade-up_0.5s_ease-out]"
      )}
    >
      {listening && (
        <>
          <span className="absolute inset-0 animate-ping rounded-full bg-blush-400 opacity-30" />
          <span className="absolute -inset-3 rounded-full border-2 border-blush-300 opacity-60" />
        </>
      )}
      {listening ? (
        <Square className="h-8 w-8" aria-hidden />
      ) : (
        <Mic className="h-9 w-9" aria-hidden />
      )}
    </button>
  );
}
