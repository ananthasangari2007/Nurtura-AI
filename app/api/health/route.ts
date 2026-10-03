import { NextResponse } from "next/server";
import { getDbStatus, mockDb } from "@/lib/db/client";
import { CARE_FLOW, getDemoSnapshot } from "@/lib/store/snapshot";

export async function GET() {
  const status = await getDbStatus();
  const snapshot = getDemoSnapshot();
  const [questions, appointments, actions, followUps] = await Promise.all([
    mockDb.listQuestions(),
    mockDb.listAppointments(),
    mockDb.listActions(),
    mockDb.listFollowUps(),
  ]);

  return NextResponse.json({
    ok: true,
    db: status,
    counts: {
      questions: questions.length,
      appointments: appointments.length,
      actions: actions.length,
      followUps: followUps.length,
    },
    // Shared data layer: whole-app snapshot + module flow (additive).
    snapshot: snapshot.counts,
    flow: CARE_FLOW.map((n) => ({ href: n.href, label: n.label, nextHref: n.nextHref })),
    safety:
      "Nurtura AI is assistive only — never diagnoses, prescribes, scores risk, or interprets reports.",
  });
}
