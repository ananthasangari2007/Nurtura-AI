import { NextResponse } from "next/server";
import { mockDb } from "@/lib/db/client";

export async function GET() {
  const [questions, appointments, actions, followUps] = await Promise.all([
    mockDb.listQuestions(),
    mockDb.listAppointments(),
    mockDb.listActions(),
    mockDb.listFollowUps(),
  ]);
  return NextResponse.json({ questions, appointments, actions, followUps });
}
