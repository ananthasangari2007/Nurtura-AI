/**
 * Centralized AI safety layer — Nurtura AI.
 *
 * EVERY AI-generated or AI-shaped output must pass through
 * validateAIResponse() before reaching the patient. Deterministic
 * template/recall helpers should call it too (it is pure and runs
 * on server and client).
 *
 * Blocks: diagnosis · treatment recommendation · prescription ·
 * clinical risk scoring · medical interpretation · autonomous
 * clinical decisions.
 *
 * Allows: care navigation · organization · summarization of
 * patient-provided NON-CLINICAL information · appointment
 * preparation · reminders · question organization · administrative
 * document extraction · multilingual interaction.
 */

export const SAFE_BOUNDARY_RESPONSE =
  "I can help organize your care journey or prepare questions for your healthcare professional, but I can't diagnose or provide treatment advice.";

export const ALLOWED_USES = [
  "care navigation",
  "organization",
  "summarization of patient-provided non-clinical information",
  "appointment preparation",
  "reminders",
  "question organization",
  "document administrative extraction",
  "multilingual interaction",
] as const;

const BLOCKED_PATTERNS: { flag: string; re: RegExp }[] = [
  { flag: "diagnosis", re: /\bdiagno(s|sed|sing|stic)|you have ([a-z ]{0,40}(disease|syndrome|disorder|diabetes|anemia|preeclampsia))/i },
  { flag: "treatment", re: /\b(treatment|you should (take|start|stop|continue|avoid)|recommended (dose|therapy|regimen)|course of treatment|cure for)\b/i },
  { flag: "prescription", re: /\bprescri(b|bed|ption)|take \d+\s?(mg|ml|tablet|pill|dose)|twice (a )?daily (dose)?|dosage of/i },
  { flag: "risk-scoring", re: /\brisk score|risk of [a-z ]{3,30} is \d|high.?risk pregnancy|low.?risk pregnancy|probability of/i },
  { flag: "interpretation", re: /\byour (report|scan|ultrasound|blood ?test|lab|labs|results?) (shows|means|indicates|suggests)|interpret(ation|ed|s)? (of )?(your|the|this)/i },
  { flag: "clinical-decision", re: /\b(no need to see|don't need to see|skip (your|the) (visit|appointment|doctor)|safe to deliver at home|emergency|go to (the )?ER)\b/i },
  { flag: "clinical-ta", re: /நோய் (உள்ளது|இருக்கிறது)|மருந்து (எடுத்துக்கொள்|சாப்பிடு)|சிகிச்சை (தேவை|செய்)/i },
  { flag: "clinical-hi", re: /तुम्हें .* (बीमारी|रोग) है|दवा (लो|खाओ|ले लो)|इलाज (करो|चाहिए)/i },
];

export type SafetyVerdict = {
  allowed: boolean;
  reply: string;
  flags: string[];
};

/**
 * Nurtura's own safety disclaimers ("doesn't diagnose or prescribe",
 * "never diagnoses…") contain clinical vocabulary in negated form.
 * Strip them before scanning so the gate never flags its own guardrails.
 */
const OWN_DISCLAIMERS: RegExp[] = [
  /doesn.?t diagnose or prescri(be|ption)[^.]*\.?/gi,
  /never diagnos(es|e|ing)[^.]*\.?/gi,
  /can.?t diagnose or provide treatment advice\.?/gi,
  /clinical (decisions|assessment) remains? with [^.]*\.?/gi,
  /not a (doctor|medical device)[^.]*\.?/gi,
];

export function stripOwnDisclaimers(text: string): string {
  return OWN_DISCLAIMERS.reduce((acc, re) => acc.replace(re, " "), text);
}

/**
 * Gate every AI output. Returns the original text when clean;
 * otherwise substitutes the safe boundary and reports flags.
 */
export function validateAIResponse(text: string): SafetyVerdict {
  const input = text ?? "";
  const scannable = stripOwnDisclaimers(input);
  const flags = BLOCKED_PATTERNS.filter((p) => p.re.test(scannable)).map((p) => p.flag);
  if (flags.length > 0) {
    return { allowed: false, reply: SAFE_BOUNDARY_RESPONSE, flags };
  }
  return { allowed: true, reply: input, flags: [] };
}

/** Prompt-side guard: refuse to even send clinical requests to a provider. */
export function isProhibitedRequest(text: string): boolean {
  return validateAIResponse(text).allowed === false;
}
