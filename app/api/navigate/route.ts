import { NextResponse } from "next/server";
import {
  classifyIntent,
  generateNavigationResponse,
  isClinicalRequest,
  SAFE_BOUNDARY,
  summarizePatientInput,
  type VoiceLang,
} from "@/lib/ai/navigator";
import { getAiProvider } from "@/lib/ai/client";
import { validateAIResponse } from "@/lib/safety/policy";

const LANGS: VoiceLang[] = ["en", "ta", "hi"];

/** Server-side engine resolution — API keys never leave the server. */
function resolveEngine(): string {
  const provider = getAiProvider();
  if (provider === "mock") return "deterministic";
  if (typeof process.env.AI_API_KEY === "string" && process.env.AI_API_KEY !== "") {
    return provider;
  }
  return "deterministic";
}

/**
 * POST /api/navigate — intent classification + navigation reply seam.
 * Deterministic engine today (reliable demo, no key); a configured LLM
 * can implement the same contract later. Clinical requests always hit
 * the safe boundary — never medical advice. All replies pass the
 * central safety gate.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { text?: string; lang?: string };
    const text = (body.text ?? "").toString().slice(0, 1000);
    const lang: VoiceLang = LANGS.includes(body.lang as VoiceLang)
      ? (body.lang as VoiceLang)
      : "en";
    if (!text.trim()) {
      return NextResponse.json({ error: "Text is required." }, { status: 400 });
    }

    if (isClinicalRequest(text)) {
      return NextResponse.json({
        intent: "GENERAL_NAVIGATION",
        confidence: 1,
        boundaryHit: true,
        reply: SAFE_BOUNDARY,
        summary: summarizePatientInput(text, lang),
        route: "/doctor-brief",
        engine: resolveEngine(),
      });
    }

    const { intent, confidence } = classifyIntent(text);
    const { reply, route } = generateNavigationResponse(text, intent, lang);
    const verdict = validateAIResponse(reply);
    return NextResponse.json({
      intent,
      confidence,
      boundaryHit: !verdict.allowed,
      reply: verdict.reply,
      summary: summarizePatientInput(text, lang),
      route,
      engine: resolveEngine(),
      safetyFlags: verdict.flags,
    });
  } catch {
    return NextResponse.json({ error: "Could not navigate." }, { status: 500 });
  }
}
