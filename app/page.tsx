import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  FileText,
  HeartHandshake,
  Mic,
  ShieldCheck,
  Users,
  FolderOpen,
  Route,
  BellRing,
  IdCard,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { SafetyBanner } from "@/components/ui/SafetyBanner";

const JOURNEY_STEPS = [
  {
    icon: HeartHandshake,
    tone: "bg-blush-100 text-blush-600",
    title: "1. I need a doctor",
    text: "Say it in your own words — voice or text, in your language.",
  },
  {
    icon: Route,
    tone: "bg-lavender-100 text-lavender-600",
    title: "2. Organize my questions",
    text: "Turn worries into a clear, visit-ready question list.",
  },
  {
    icon: FileText,
    tone: "bg-sky-soft-100 text-sky-soft-600",
    title: "3. Doctor Visit Brief",
    text: "Approve a one-page brief to carry into the visit.",
  },
  {
    icon: BellRing,
    tone: "bg-teal-soft-100 text-teal-soft-700",
    title: "4. Know my next step",
    text: "Leave with actions, reminders, and continuity.",
  },
];

const MODULES = [
  {
    href: "/care-journey",
    icon: Route,
    tone: "bg-lavender-100 text-lavender-600",
    title: "Care Journey",
    text: "Questions, appointments & memory in one timeline.",
  },
  {
    href: "/doctor-brief",
    icon: FileText,
    tone: "bg-sky-soft-100 text-sky-soft-600",
    title: "Doctor Visit Brief",
    text: "Patient-approved summary for the visit.",
  },
  {
    href: "/documents",
    icon: FolderOpen,
    tone: "bg-teal-soft-100 text-teal-soft-700",
    title: "Documents → Actions",
    text: "Slips & papers become plain next steps.",
  },
  {
    href: "/voice",
    icon: Mic,
    tone: "bg-blush-100 text-blush-600",
    title: "Voice Companion",
    text: "Multilingual help using mic or keyboard.",
  },
  {
    href: "/handoff",
    icon: IdCard,
    tone: "bg-lavender-100 text-lavender-600",
    title: "Care Handoff Passport",
    text: "Share only what you choose, when you choose.",
  },
  {
    href: "/caregivers",
    icon: Users,
    tone: "bg-sky-soft-100 text-sky-soft-600",
    title: "Caregivers",
    text: "Coordinate with your trusted circle.",
  },
];

export default function LandingPage() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="overflow-hidden rounded-[1.75rem] border border-white bg-white shadow-soft">
        <div className="grid gap-6 p-6 sm:p-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="blush">Maternal & child health</Badge>
              <Badge tone="navy">Assistive · Not a doctor</Badge>
            </div>
            <h1 className="mt-4 font-display text-[32px] leading-[1.08] font-semibold text-navy-800 sm:text-5xl">
              From “I need a doctor” to{" "}
              <span className="text-lavender-500">“I know my next step.”</span>
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-navy-600 sm:text-base">
              Nurtura AI is your care-journey companion. It helps you prepare
              questions, organize appointments, build a Doctor Visit Brief,
              turn documents into clear actions, and stay connected — without
              ever diagnosing or prescribing.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/dashboard">
                <Button size="lg">
                  Open my dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/voice">
                <Button size="lg" variant="soft">
                  <Mic className="h-4 w-4" /> Try voice companion
                </Button>
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-navy-600">
              <span className="inline-flex items-center gap-1.5">
                <CalendarCheck className="h-4 w-4 text-teal-soft-600" /> Works
                offline-first demo
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-teal-soft-600" /> Consent
                controlled sharing
              </span>
            </div>
          </div>

          {/* Visual card — no robot imagery, calm care illustration via CSS */}
          <div className="grid gap-3">
            <div className="rounded-3xl bg-gradient-to-br from-blush-100 via-lavender-50 to-sky-soft-100 p-5">
              <p className="font-display text-sm font-semibold text-navy-800">
                Today · Ananya&apos;s journey (demo)
              </p>
              <div className="mt-3 space-y-2.5">
                {[
                  { dot: "bg-blush-400", text: "Antenatal checkup · Oct 10, 10:30 AM" },
                  { dot: "bg-lavender-400", text: "2 questions ready for Doctor Brief" },
                  { dot: "bg-teal-soft-500", text: "Visit folder packed · ID + slips" },
                ].map((row) => (
                  <div
                    key={row.text}
                    className="flex items-center gap-2.5 rounded-2xl bg-white/90 px-3.5 py-2.5 text-[13px] font-medium text-navy-700 shadow-soft"
                  >
                    <span className={`h-2 w-2 rounded-full ${row.dot}`} />
                    {row.text}
                  </div>
                ))}
              </div>
            </div>
            <SafetyBanner compact />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section>
        <h2 className="font-display text-xl font-semibold text-navy-800">
          How Nurtura walks with you
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {JOURNEY_STEPS.map((s) => (
            <Card key={s.title}>
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-2xl ${s.tone}`}
              >
                <s.icon className="h-5 w-5" aria-hidden />
              </span>
              <CardTitle className="mt-3">{s.title}</CardTitle>
              <CardDescription>{s.text}</CardDescription>
            </Card>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section>
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-display text-xl font-semibold text-navy-800">
            Everything in one calm place
          </h2>
          <Link
            href="/dashboard"
            className="hidden font-display text-sm font-medium text-lavender-600 sm:inline-flex sm:items-center sm:gap-1"
          >
            Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m) => (
            <Link key={m.href} href={m.href} className="group">
              <Card className="h-full transition group-hover:-translate-y-0.5 group-hover:shadow-lift">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl ${m.tone}`}
                >
                  <m.icon className="h-5 w-5" aria-hidden />
                </span>
                <CardTitle className="mt-3">{m.title}</CardTitle>
                <CardDescription>{m.text}</CardDescription>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <SafetyBanner />
    </div>
  );
}
