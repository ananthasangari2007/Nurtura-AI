import { NextResponse } from "next/server";
import { getAiProvider, mockAssist } from "@/lib/ai/client";
import { validateAIResponse } from "@/lib/safety/policy";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { prompt?: string; lang?: string };
    const prompt = (body.prompt ?? "").toString().slice(0, 1000);
    if (!prompt.trim()) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }
    const provider = getAiProvider();
    // Phase 1: always use the safe mock responder so the demo works with no keys.
    const raw = await mockAssist(prompt);
    // Central safety gate: every AI output passes validation before delivery.
    const verdict = validateAIResponse(raw);
    return NextResponse.json({
      reply: verdict.reply,
      provider,
      lang: body.lang ?? "en-IN",
      safeMode: true,
      safetyFlags: verdict.flags,
    });
  } catch {
    return NextResponse.json({ error: "Could not process request." }, { status: 500 });
  }
}
