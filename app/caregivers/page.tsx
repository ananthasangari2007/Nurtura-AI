import type { Metadata } from "next";
import { CaregiversScreen } from "@/components/caregivers/CaregiversScreen";

export const metadata: Metadata = { title: "Caregivers" };

export default function CaregiversPage() {
  return <CaregiversScreen />;
}
