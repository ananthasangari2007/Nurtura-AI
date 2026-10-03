import type { Metadata } from "next";
import { mockDb } from "@/lib/db/client";
import { JourneyMemoryScreen } from "@/components/journey/JourneyMemoryScreen";

export const metadata: Metadata = { title: "Care Journey" };

export default async function CareJourneyPage() {
  const seed = await mockDb.listCareEvents();
  return <JourneyMemoryScreen seed={seed} />;
}
