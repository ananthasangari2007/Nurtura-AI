import { NextResponse } from "next/server";
import { createPassport, listAudit, listPassports } from "@/lib/handoff/vault";
import type { ShareScope, SharedItems } from "@/lib/handoff/types";

const SCOPE_KEYS: (keyof ShareScope)[] = [
  "timeline",
  "appointments",
  "questions",
  "documents",
  "followups",
];

/** GET /api/handoff/passports — list created passports (mock session). */
export async function GET() {
  return NextResponse.json({ passports: listPassports(), audit: listAudit() });
}

/** POST /api/handoff/passports — generate a 24h passport from scope + items. */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { scope?: ShareScope; items?: SharedItems };
    if (!body.scope || !SCOPE_KEYS.every((k) => typeof body.scope?.[k] === "boolean")) {
      return NextResponse.json({ error: "A full scope selection is required." }, { status: 400 });
    }
    if (!body.items || !Array.isArray(body.items.questionIds)) {
      return NextResponse.json({ error: "Shared item selections are required." }, { status: 400 });
    }
    if (!SCOPE_KEYS.some((k) => body.scope?.[k])) {
      return NextResponse.json(
        { error: "Select at least one category to share." },
        { status: 400 }
      );
    }
    const passport = createPassport(body.scope, {
      questionIds: body.items.questionIds.slice(0, 50),
      eventIds: body.items.eventIds.slice(0, 50),
      documentIds: body.items.documentIds.slice(0, 50),
    });
    return NextResponse.json({ passport, audit: listAudit(passport.token) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not create passport." }, { status: 500 });
  }
}
