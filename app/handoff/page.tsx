import type { Metadata } from "next";
import { HandoffScreen } from "@/components/handoff/HandoffScreen";

export const metadata: Metadata = { title: "Care Handoff Passport" };

export default function HandoffPage() {
  return <HandoffScreen />;
}
