import { NextResponse } from "next/server";
import { getJourneyRepository, type NewCareEventInput } from "@/lib/journey/api";

const VALID_TYPES = [
  "consultation",
  "appointment",
  "document",
  "follow-up",
  "question",
  "reminder",
  "care_instruction",
];

export async function GET() {
  const repo = getJourneyRepository();
  const events = await repo.listEvents();
  return NextResponse.json({ events });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<NewCareEventInput>;
    const { type, date, title, description, source, status, relatedDocumentId } = body;

    if (
      !type ||
      !VALID_TYPES.includes(type) ||
      !date ||
      !title?.trim() ||
      !description?.trim() ||
      (status !== "completed" && status !== "upcoming")
    ) {
      return NextResponse.json(
        { error: "type, date, title, description and status are required." },
        { status: 400 }
      );
    }

    const repo = getJourneyRepository();
    const event = await repo.createEvent({
      type,
      date,
      title: title.trim().slice(0, 80),
      description: description.trim().slice(0, 400),
      source: source?.trim() || "Patient added",
      status,
      ...(relatedDocumentId ? { relatedDocumentId } : {}),
    });
    return NextResponse.json({ event }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not save event." }, { status: 500 });
  }
}
