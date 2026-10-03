import type { Metadata } from "next";
import { FollowUpsScreen } from "@/components/continuity/FollowUpsScreen";

export const metadata: Metadata = { title: "Follow-ups" };

export default function FollowUpsPage() {
  return <FollowUpsScreen />;
}
