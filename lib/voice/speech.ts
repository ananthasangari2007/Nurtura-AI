"use client";

/** Browser Web Speech helpers — recognition + synthesis, integration-ready. */

export type RecInstance = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult:
    | ((
        e: {
          resultIndex: number;
          results: ArrayLike<{ isFinal: boolean } & ArrayLike<{ transcript: string }>>;
        }
      ) => void)
    | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

export function getSpeechRecognition(): (new () => RecInstance) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => RecInstance;
    webkitSpeechRecognition?: new () => RecInstance;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function isVoiceSupported(): boolean {
  return getSpeechRecognition() !== null;
}

export function isTtsSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** Speak a reply in the matching voice where the browser provides one. */
export function speakReply(text: string, locale: string) {
  if (!isTtsSupported()) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = locale;
  const prefix = locale.slice(0, 2).toLowerCase();
  const voices = synth.getVoices();
  const match =
    voices.find((v) => v.lang.toLowerCase().startsWith(prefix)) ??
    voices.find((v) => v.lang.toLowerCase().startsWith("en"));
  if (match) utterance.voice = match;
  synth.speak(utterance);
}

export function stopSpeaking() {
  if (isTtsSupported()) window.speechSynthesis.cancel();
}
