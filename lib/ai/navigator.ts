/**
 * AI Care Navigator — service abstraction.
 *
 * Exposes: classifyIntent() · generateNavigationResponse() ·
 * summarizePatientInput(), plus the clinical-boundary guard.
 *
 * Client-safe: pure deterministic logic only — no environment or
 * secret access, so VoiceScreen's offline fallback can import it.
 * A real LLM can replace `providerRespond()` server-side later
 * without changing routes or screens.
 */

export type VoiceLang = "en" | "ta" | "hi";

export const VOICE_LANGUAGES: {
  id: VoiceLang;
  label: string;
  native: string;
  locale: string;
}[] = [
  { id: "en", label: "English", native: "English", locale: "en-IN" },
  { id: "ta", label: "Tamil", native: "தமிழ்", locale: "ta-IN" },
  { id: "hi", label: "Hindi", native: "हिन्दी", locale: "hi-IN" },
];

export type NavigatorIntent =
  | "NEED_DOCTOR"
  | "PREPARE_VISIT"
  | "VIEW_APPOINTMENT"
  | "VIEW_QUESTIONS"
  | "VIEW_DOCUMENTS"
  | "FOLLOW_UP"
  | "CARE_PASSPORT"
  | "CAREGIVER"
  | "GENERAL_NAVIGATION";

export const INTENT_DESTINATIONS: Record<
  NavigatorIntent,
  { route: string; action: Record<VoiceLang, string> }
> = {
  NEED_DOCTOR: {
    route: "/doctor-brief",
    action: { en: "Start care request", ta: "பராமரிப்பு கோரிக்கையைத் தொடங்குக", hi: "देखभाल अनुरोध शुरू करें" },
  },
  PREPARE_VISIT: {
    route: "/doctor-brief",
    action: { en: "Open visit brief", ta: "வருகை சுருக்கத்தைத் திற", hi: "विज़िट ब्रीफ़ खोलें" },
  },
  VIEW_APPOINTMENT: {
    route: "/dashboard",
    action: { en: "See next appointment", ta: "அடுத்த சந்திப்பைப் பார்க்க", hi: "अगली अपॉइंटमेंट देखें" },
  },
  VIEW_QUESTIONS: {
    route: "/care-journey",
    action: { en: "See saved questions", ta: "சேமித்த கேள்விகளைப் பார்க்க", hi: "सहेजे गए प्रश्न देखें" },
  },
  VIEW_DOCUMENTS: {
    route: "/documents",
    action: { en: "Open documents", ta: "ஆவணங்களைத் திற", hi: "दस्तावेज़ खोलें" },
  },
  FOLLOW_UP: {
    route: "/follow-ups",
    action: { en: "View follow-ups", ta: "பின்தொடர்தல்களைப் பார்க்க", hi: "फॉलो-अप देखें" },
  },
  CARE_PASSPORT: {
    route: "/handoff",
    action: { en: "Open care passport", ta: "பராமரிப்பு கடவுச்சீட்டைத் திற", hi: "केयर पासपोर्ट खोलें" },
  },
  CAREGIVER: {
    route: "/caregivers",
    action: { en: "Open caregivers", ta: "பராமரிப்பாளர்களைத் திற", hi: "देखभालकर्ता खोलें" },
  },
  GENERAL_NAVIGATION: {
    route: "/dashboard",
    action: { en: "Open dashboard", ta: "டாஷ்போர்டைத் திற", hi: "डैशबोर्ड खोलें" },
  },
};

export const SAFE_BOUNDARY =
  "I can help organize your care journey or prepare questions for your healthcare professional, but I can't diagnose or provide treatment advice.";

const CLINICAL_PATTERNS: RegExp[] = [
  /diagnos/i,
  /disease/i,
  /medicine|medication|tablet|pill\b|dose|dosage|syrup|injection/i,
  /treatment|cure|therap|remedy/i,
  /interpret|what does .*mean|is .*normal|worried about .*report/i,
  /predict|risk|chance.*(baby|pregnan|birth)/i,
  /should i (take|stop|eat|drink|avoid)/i,
  /prescri/i,
  /நோய்|மருந்து|சிகிச்சை|கண்டறி/i,
  /बीमारी|दवा|इलाज|निदान|गोली/i,
];

/** True when the request seeks clinical advice — must trigger the boundary. */
export function isClinicalRequest(text: string): boolean {
  return CLINICAL_PATTERNS.some((re) => re.test(text));
}

type Rule = { intent: NavigatorIntent; patterns: RegExp[] };

const RULES: Rule[] = [
  // Preparation wins over generic "need" phrasing ("I need to prepare…").
  {
    intent: "PREPARE_VISIT",
    patterns: [
      /prepar/i,
      /get ready|ready for/i,
      /brief/i,
      /தயார்/i,
      /तैयार/i,
    ],
  },
  {
    intent: "NEED_DOCTOR",
    patterns: [
      /need (a |the )?(doctor|consultation)/i,
      /talk to (my|the) (doctor|clinic)/i,
      /see (a|my|the) doctor/i,
      /want to consult/i,
      /i need.*(checkup|check-up)/i,
      /டாக்டர|மருத்துவர/i,
      /डॉक्टर|चिकित्सक/i,
      /\bdaktar\b/i,
    ],
  },
  {
    intent: "VIEW_APPOINTMENT",
    patterns: [
      /appointment|next visit|my visit|when is|slot|schedule/i,
      /அப்பாயிண்ட்மெண்ட்|சந்திப்பு|நேரம்/i,
      /अपॉइंटमेंट|मुलाकात|समय/i,
    ],
  },
  {
    intent: "VIEW_QUESTIONS",
    patterns: [
      /question/i,
      /what should i ask|what to ask/i,
      /கேள்வி/i,
      /सवाल|प्रश्न/i,
    ],
  },
  {
    intent: "VIEW_DOCUMENTS",
    patterns: [/document|slip|prescription|upload|file|paper/i, /ஆவணம்|சீட்டு/i, /दस्तावेज़|पर्ची/i],
  },
  {
    intent: "FOLLOW_UP",
    patterns: [
      /follow.?up|remind|next step|after (my|the) visit/i,
      /நினைவு|பின்தொடர்/i,
      /याद|रिमाइंडर|अगला कदम|फॉलो/i,
    ],
  },
  {
    intent: "CARE_PASSPORT",
    patterns: [/passport|handoff|hand.?off|share my|carry (my|the)/i, /பகிர்|கடவுச்சீட்டு/i, /साझा|पासपोर्ट/i],
  },
  {
    intent: "CAREGIVER",
    patterns: [/caregiver|family|mother|asha|helper|care circle/i, /குடும்பம்|பராமரிப்பாளர்/i, /परिवार|आशा/i],
  },
];

export function classifyIntent(text: string): { intent: NavigatorIntent; confidence: number } {
  for (const rule of RULES) {
    if (rule.patterns.some((re) => re.test(text))) {
      return { intent: rule.intent, confidence: 0.85 };
    }
  }
  return { intent: "GENERAL_NAVIGATION", confidence: 0.5 };
}

const RESPONSES: Record<NavigatorIntent, Record<VoiceLang, string>> = {
  NEED_DOCTOR: {
    en: "I'll help you start a care request — who to contact, visit type, your questions, and papers to carry. Open the Doctor Visit Brief to begin.",
    ta: "உங்கள் பராமரிப்பு கோரிக்கையைத் தொடங்க உதவுகிறேன் — யாரைத் தொடர்புகொள்வது, சந்திப்பு வகை, உங்கள் கேள்விகள், எடுத்துச் செல்ல வேண்டிய ஆவணங்கள். தொடங்க மருத்துவ வருகை சுருக்கத்தைத் திறக்கவும்.",
    hi: "मैं आपका देखभाल अनुरोध शुरू करने में मदद करूँगा — किससे संपर्क करें, विज़िट का प्रकार, आपके प्रश्न और साथ ले जाने वाले कागज़ात। शुरू करने के लिए डॉक्टर विज़िट ब्रीफ़ खोलें।",
  },
  PREPARE_VISIT: {
    en: "Let's get you visit-ready: shortlist 2–3 questions, pack ID + slips, and confirm your slot. Your brief keeps it all on one page.",
    ta: "உங்களை சந்திப்புக்குத் தயாராக்குவோம்: 2–3 கேள்விகளைத் தேர்ந்தெடுங்கள், அடையாள அட்டை + சீட்டுகளை எடுத்துச் செல்லுங்கள், நேரத்தை உறுதிப்படுத்துங்கள்.",
    hi: "आइए आपको विज़िट के लिए तैयार करें: 2–3 प्रश्न चुनें, आईडी + पर्चियाँ साथ रखें और स्लॉट की पुष्टि करें।",
  },
  VIEW_APPOINTMENT: {
    en: "Your next appointment is the antenatal checkup on Friday, Oct 10 at 10:30 AM — City Care Clinic, Room 4. Open your dashboard for the full card.",
    ta: "உங்கள் அடுத்த சந்திப்பு அக்டோபர் 10, வெள்ளிக்கிழமை காலை 10:30 — சிட்டி கேர் கிளினிக், அறை 4. முழு விவரத்திற்கு டாஷ்போர்டைத் திறக்கவும்.",
    hi: "आपकी अगली अपॉइंटमेंट शुक्रवार, 10 अक्टूबर को सुबह 10:30 बजे है — सिटी केयर क्लिनिक, कमरा 4। पूरी जानकारी के लिए डैशबोर्ड खोलें।",
  },
  VIEW_QUESTIONS: {
    en: "You have 2 saved questions ready for your visit. Open your care journey to review, star, or add more.",
    ta: "உங்கள் சந்திப்புக்கு 2 கேள்விகள் தயாராக உள்ளன. மதிப்பாய்வு செய்ய உங்கள் பராமரிப்புப் பயணத்தைத் திறக்கவும்.",
    hi: "आपकी विज़िट के लिए 2 प्रश्न तैयार हैं। समीक्षा के लिए अपनी देखभाल यात्रा खोलें।",
  },
  VIEW_DOCUMENTS: {
    en: "Your document library holds slips and cards, each organized into plain next steps. Open documents to upload or review.",
    ta: "உங்கள் ஆவண நூலகத்தில் சீட்டுகள் தெளிவான அடுத்த படிகளாக ஒழுங்கமைக்கப்பட்டுள்ளன.",
    hi: "आपकी दस्तावेज़ लाइब्रेरी में पर्चियाँ स्पष्ट अगले चरणों में व्यवस्थित हैं।",
  },
  FOLLOW_UP: {
    en: "Continuity check: confirm your Oct 10 slot, pack your folder the night before, and share your summary after the visit. Open follow-ups to manage reminders.",
    ta: "தொடர்ச்சி நினைவூட்டல்: அக்டோபர் 10 நேரத்தை உறுதிப்படுத்துங்கள், முந்தைய இரவே கோப்பைத் தயார் செய்யுங்கள்.",
    hi: "निरंतरता जांच: 10 अक्टूबर के स्लॉट की पुष्टि करें और पिछली रात फ़ोल्डर तैयार रखें।",
  },
  CARE_PASSPORT: {
    en: "Your Care Handoff Passport shares only what you approve — visits, brief, and caregivers. Open it to review consent field by field.",
    ta: "உங்கள் பராமரிப்பு கடவுச்சீட்டு நீங்கள் அனுமதித்ததை மட்டுமே பகிரும்.",
    hi: "आपका केयर पासपोर्ट केवल वही साझा करता है जिसे आप मंज़ूर करें।",
  },
  CAREGIVER: {
    en: "Your trusted circle — Asha, Rahul, and your ASHA worker — can see only what you allow. Open caregivers to manage permissions.",
    ta: "நீங்கள் அனுமதித்ததை மட்டுமே உங்கள் நம்பிக்கை வட்டம் காண முடியும்.",
    hi: "आपका विश्वसनीय दायरा केवल वही देख सकता है जिसकी आप अनुमति दें।",
  },
  GENERAL_NAVIGATION: {
    en: "I can take you to your dashboard, journey, brief, documents, or reminders. Tell me what you'd like to organize next.",
    ta: "உங்கள் டாஷ்போர்டு, பயணம், சுருக்கம், ஆவணங்கள் அல்லது நினைவூட்டல்களுக்கு அழைத்துச் செல்ல முடியும்.",
    hi: "मैं आपको डैशबोर्ड, यात्रा, ब्रीफ़, दस्तावेज़ या रिमाइंडर तक ले जा सकता हूँ।",
  },
};

/**
 * Deterministic navigation reply. Journey mentions route to the journey;
 * everything else uses the intent destination.
 */
export function generateNavigationResponse(
  text: string,
  intent: NavigatorIntent,
  lang: VoiceLang
): { reply: string; route: string } {
  if (intent === "GENERAL_NAVIGATION" && /journey|memory|பயணம்|यात्रा/i.test(text)) {
    return {
      reply:
        lang === "ta"
          ? "உங்கள் பராமரிப்புப் பயண நினைவகம் — சந்திப்புகள், ஆவணங்கள், கேள்விகள் அனைத்தும் ஒரே காலவரிசையில்."
          : lang === "hi"
            ? "आपकी देखभाल यात्रा स्मृति — मुलाकातें, दस्तावेज़ और प्रश्न, सब एक ही टाइमलाइन में।"
            : "Your Care Journey Memory — visits, documents, and questions on one timeline. Open it to walk through your story.",
      route: "/care-journey",
    };
  }
  return { reply: RESPONSES[intent][lang], route: INTENT_DESTINATIONS[intent].route };
}

/** Deterministic recap of what the patient expressed — no inference added. */
export function summarizePatientInput(text: string, lang: VoiceLang): string {
  const clean = text.trim().replace(/\s+/g, " ");
  const words = clean === "" ? 0 : clean.split(" ").length;
  const excerpt = clean.length > 140 ? `${clean.slice(0, 140)}…` : clean;
  if (lang === "ta") return `நீங்கள் பகிர்ந்தது (${words} சொற்கள்): “${excerpt}” — மருத்துவ விவரங்கள் சேர்க்காமல் அப்படியே குறித்துக்கொண்டேன்.`;
  if (lang === "hi") return `आपने जो साझा किया (${words} शब्द): “${excerpt}” — बिना कोई चिकित्सीय विवरण जोड़े नोट कर लिया।`;
  return `You shared (${words} words): “${excerpt}” — noted as-is, with nothing medical added.`;
}

/**
 * Client-safe engine label. API keys are resolved server-side only
 * (see POST /api/navigate) so secrets never enter the client bundle.
 */
export function getNavigatorEngine(): "deterministic" {
  return "deterministic";
}
