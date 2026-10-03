import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  Circle,
  CircleCheck,
  FileText,
  FolderOpen,
  HeartPulse,
  IdCard,
  MessageCircle,
  Mic,
  Star,
  Stethoscope,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { SafetyBanner } from "@/components/ui/SafetyBanner";
import { ProgressCard } from "@/components/dashboard/ProgressCard";
import { AppointmentCard } from "@/components/dashboard/AppointmentCard";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { CareJourneyTimeline } from "@/components/dashboard/CareJourneyTimeline";
import { AICompanionCard } from "@/components/dashboard/AICompanionCard";
import {
  demoAppointment,
  demoJourneyStage,
  demoPatient,
  demoTimeline,
  mockActions,
  mockQuestions,
} from "@/lib/mock-data";

export const metadata: Metadata = { title: "Dashboard" };

const QUICK_ACTIONS = [
  {
    href: "/doctor-brief",
    icon: Stethoscope,
    title: "Prepare for Doctor",
    subtitle: "Review your visit brief",
    tone: "bg-blush-100 text-blush-600",
  },
  {
    href: "/documents",
    icon: FolderOpen,
    title: "My Documents",
    subtitle: "Slips become clear actions",
    tone: "bg-teal-soft-100 text-teal-soft-700",
  },
  {
    href: "/care-journey",
    icon: MessageCircle,
    title: "My Questions",
    subtitle: `${mockQuestions.length} saved for visits`,
    tone: "bg-lavender-100 text-lavender-600",
  },
  {
    href: "/handoff",
    icon: IdCard,
    title: "My Care Passport",
    subtitle: "Share only what you allow",
    tone: "bg-sky-soft-100 text-sky-soft-600",
  },
  {
    href: "/follow-ups",
    icon: BellRing,
    title: "Follow-ups",
    subtitle: "Reminders & continuity",
    tone: "bg-navy-100 text-navy-700",
  },
];

export default function DashboardPage() {
  const openActions = mockActions.filter((a) => !a.done);

  return (
    <div className="space-y-5">
      {/* 1 · Welcome */}
      <section
        className="animate-fade-up flex flex-wrap items-end justify-between gap-3"
        aria-label="Welcome"
      >
        <div>
          <Badge tone="lavender">{demoPatient.weekNote}</Badge>
          <h1 className="mt-2.5 font-display text-[26px] leading-tight font-semibold text-navy-800 sm:text-3xl">
            Good morning, {demoPatient.name} 👋
          </h1>
          <p className="mt-1 text-sm text-navy-600 sm:text-[15px]">
            {demoPatient.subtitle}
          </p>
        </div>
        <p className="hidden font-display text-xs font-medium text-navy-600/70 sm:block">
          Friday, October 3 · 7-day countdown to your visit
        </p>
      </section>

      {/* 3 · "I Need a Doctor" primary action */}
      <section
        className="animate-fade-up overflow-hidden rounded-[1.75rem] border border-white bg-white shadow-soft"
        style={{ animationDelay: "60ms" }}
        aria-label="Get care help"
      >
        <div className="flex flex-col gap-5 p-5 sm:p-7 lg:flex-row lg:items-center">
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-blush-100 text-blush-600">
              <HeartPulse className="h-7 w-7" aria-hidden />
            </span>
            <div>
              <h2 className="font-display text-lg font-semibold text-navy-800 sm:text-xl">
                Need care right now?
              </h2>
              <p className="mt-1 max-w-md text-sm leading-relaxed text-navy-600">
                Tell Nurtura what&apos;s happening in your own words — voice or
                text, in your language. We&apos;ll help you organize your next
                step.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2.5 sm:flex-row lg:ml-auto lg:flex-col xl:flex-row">
            <Link
              href="/voice"
              className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-blush-500 px-8 font-display text-[15px] font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-blush-600 hover:shadow-lift active:translate-y-0"
            >
              <Mic className="h-5 w-5" aria-hidden />I Need a Doctor
            </Link>
            <Link
              href="/doctor-brief"
              className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full border border-navy-100 bg-white px-8 font-display text-[15px] font-medium text-navy-800 shadow-soft transition hover:-translate-y-0.5 hover:border-lavender-200 hover:shadow-lift"
            >
              <FileText className="h-4 w-4" aria-hidden />
              Prepare instead
            </Link>
          </div>
        </div>
      </section>

      {/* Main grid */}
      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Left column */}
        <div className="min-w-0 space-y-5">
          <div className="animate-fade-up" style={{ animationDelay: "120ms" }}>
            <ProgressCard stage={demoJourneyStage} />
          </div>
          <div className="animate-fade-up" style={{ animationDelay: "180ms" }}>
            <AppointmentCard appointment={demoAppointment} />
          </div>
          <div className="animate-fade-up" style={{ animationDelay: "240ms" }}>
            <CareJourneyTimeline events={demoTimeline} />
          </div>
        </div>

        {/* Right column */}
        <div className="min-w-0 space-y-5">
          {/* 4 · Quick actions */}
          <section
            className="animate-fade-up"
            style={{ animationDelay: "140ms" }}
            aria-label="Quick actions"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-[17px] font-semibold text-navy-800">
                Quick actions
              </h2>
              <span className="font-display text-xs font-medium text-navy-600">
                {QUICK_ACTIONS.length} shortcuts
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {QUICK_ACTIONS.map((action) => (
                <QuickActionCard key={action.href + action.title} {...action} />
              ))}
              {/* Wide tile for voice, keeps grid balanced */}
              <Link href="/voice" className="group block h-full sm:col-span-2 lg:col-span-1 xl:col-span-2">
                <Card className="flex h-full items-center gap-3 !border-navy-800 !bg-navy-800 !p-4 text-white transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-lift">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 transition group-hover:scale-105">
                    <Mic className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-sm font-semibold">
                      Talk to Care Navigator
                    </span>
                    <span className="block truncate text-xs text-white/70">
                      Voice or text · 3 languages
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 transition group-hover:translate-x-0.5" aria-hidden />
                </Card>
              </Link>
            </div>
          </section>

          {/* Today's focus (preserved working functionality) */}
          <Card className="animate-fade-up" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center justify-between">
              <CardTitle>Today&apos;s focus</CardTitle>
              <Badge tone="teal">{openActions.length} open</Badge>
            </div>
            <ul className="mt-4 space-y-3">
              {mockActions.map((a) => (
                <li key={a.id} className="flex items-start gap-3 text-sm">
                  {a.done ? (
                    <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-soft-600" aria-hidden />
                  ) : (
                    <Circle className="mt-0.5 h-5 w-5 shrink-0 text-navy-200" aria-hidden />
                  )}
                  <div>
                    <p
                      className={
                        a.done
                          ? "font-medium text-navy-600/60 line-through"
                          : "font-medium text-navy-800"
                      }
                    >
                      {a.title}
                    </p>
                    <p className="text-[13px] text-navy-600">
                      {a.detail} · Due {a.due}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <Link
              href="/follow-ups"
              className="mt-4 inline-flex items-center gap-1.5 font-display text-sm font-medium text-lavender-600"
            >
              <BellRing className="h-4 w-4" aria-hidden /> Manage reminders
            </Link>
          </Card>

          {/* My questions (preserved working functionality) */}
          <Card className="animate-fade-up" style={{ animationDelay: "260ms" }}>
            <div className="flex items-center justify-between">
              <CardTitle>My questions</CardTitle>
              <Link
                href="/care-journey"
                className="inline-flex items-center gap-1 font-display text-[13px] font-medium text-lavender-600"
              >
                View all <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
            <ul className="mt-3 space-y-2.5">
              {mockQuestions.map((q) => (
                <li
                  key={q.id}
                  className="rounded-2xl bg-navy-50 px-3.5 py-2.5 text-sm text-navy-700"
                >
                  <span className="flex items-start gap-2">
                    {q.starred && (
                      <Star className="mt-0.5 h-4 w-4 shrink-0 fill-blush-300 text-blush-400" aria-hidden />
                    )}
                    {q.text}
                  </span>
                  <span className="mt-1 block text-xs text-navy-600/70">
                    {q.category} · for {q.forVisit}
                  </span>
                </li>
              ))}
            </ul>
            <CardDescription className="mt-3">
              Starred questions flow straight into your Doctor Visit Brief.
            </CardDescription>
          </Card>
        </div>
      </div>

      {/* 8 · Safety notice */}
      <div className="animate-fade-up" style={{ animationDelay: "300ms" }}>
        <SafetyBanner />
      </div>

      {/* 7 · AI Care Navigator floating assistant */}
      <AICompanionCard />
    </div>
  );
}
