/**
 * AI provider abstraction — reads config from env, falls back to a safe mock.
 *
 * Safety: this companion NEVER diagnoses, prescribes, scores risk,
 * interprets reports, or replaces a clinician. The mock responder
 * only returns navigation / organization help.
 */

export type AiProvider = "mock" | "openai" | "anthropic" | "custom";

export function getAiProvider(): AiProvider {
  const raw = (process.env.AI_PROVIDER ?? "mock").toLowerCase();
  if (raw === "openai" || raw === "anthropic" || raw === "custom") return raw;
  return "mock";
}

export async function mockAssist(prompt: string): Promise<string> {
  const clean = prompt.slice(0, 280);
  return `Here's how to organize that (demo response):\n\n1. Clarify your goal for “${clean || "your next visit"}”.\n2. Add 2–3 questions to your Doctor Visit Brief.\n3. Pack documents + ID the night before.\n\nNurtura AI doesn't diagnose or prescribe — it helps you prepare, organize, and follow through.`;
}
