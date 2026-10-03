import type { Metadata } from "next";
import { VoiceScreen } from "@/components/voice/VoiceScreen";

export const metadata: Metadata = { title: "Voice Companion" };

export default function VoicePage() {
  return <VoiceScreen />;
}
