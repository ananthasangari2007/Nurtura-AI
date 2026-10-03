import type { Metadata } from "next";
import { BriefBuilderScreen } from "@/components/brief/BriefBuilderScreen";

export const metadata: Metadata = { title: "Doctor Visit Brief" };

export default function DoctorBriefPage() {
  return <BriefBuilderScreen />;
}
