import { CalendarCheck, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardTitle } from "@/components/ui/Card";
import { demoAppointment, demoPatient, mockQuestions, seedCareEvents } from "@/lib/mock-data";
import { seedDocuments, DOC_TYPE_LABELS } from "@/lib/documents/types";
import { formatEventDate } from "@/lib/journey/memory";
import { EVENT_META } from "@/components/journey/JourneyMeta";

/**
 * PassportDashboard — what the passport WILL contain:
 * display name · journey summary · upcoming appointment ·
 * selected questions / events / documents.
 */
export function PassportDashboard({
  questionIds,
  eventIds,
  documentIds,
}: {
  questionIds: string[];
  eventIds: string[];
  documentIds: string[];
}) {
  const questions = mockQuestions.filter((q) => questionIds.includes(q.id));
  const events = seedCareEvents.filter((e) => eventIds.includes(e.id));
  const docs = seedDocuments.filter((d) => documentIds.includes(d.id));

  return (
    <div className="space-y-4">
      {/* Patient + summary */}
      <Card className="!border-navy-800 bg-navy-800 text-white">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 font-display text-lg font-semibold">
            {demoPatient.avatarFallback}
          </span>
          <div>
            <p className="text-xs font-medium tracking-wide text-white/60 uppercase">
              Care Passport · Patient
            </p>
            <p className="font-display text-xl font-semibold">{demoPatient.name}</p>
          </div>
          <span className="ml-auto hidden rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/75 sm:block">
            {demoPatient.weekNote}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            { n: events.length, l: "Events" },
            { n: questions.length, l: "Questions" },
            { n: docs.length, l: "Documents" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl bg-white/10 px-2 py-2.5">
              <p className="font-display text-lg font-semibold">{s.n}</p>
              <p className="text-[11px] text-white/70">{s.l} selected</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Upcoming appointment */}
      <Card>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            <CalendarCheck className="h-4 w-4 text-blush-500" aria-hidden />
            Upcoming appointment
          </CardTitle>
          <Badge tone="blush">{demoAppointment.countdown}</Badge>
        </div>
        <p className="mt-2 text-sm font-medium text-navy-800">
          {demoAppointment.title} · {demoAppointment.doctor}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-[13px] text-navy-600">
          <Clock className="h-3.5 w-3.5" aria-hidden />
          {demoAppointment.date} · {demoAppointment.time}
        </p>
        <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-navy-600">
          <MapPin className="h-3.5 w-3.5" aria-hidden />
          {demoAppointment.location}
        </p>
      </Card>

      {/* Selections */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="!p-4">
          <CardTitle className="!text-[15px]">Selected questions</CardTitle>
          <ul className="mt-2 space-y-1.5">
            {questions.length === 0 && (
              <li className="text-[13px] text-navy-600">None selected.</li>
            )}
            {questions.map((q, i) => (
              <li key={q.id} className="rounded-xl bg-blush-50 px-3 py-2 text-[13px] text-navy-800">
                <span className="font-display font-semibold">Q{i + 1}. </span>
                {q.text}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="!p-4">
          <CardTitle className="!text-[15px]">Selected care events</CardTitle>
          <ul className="mt-2 space-y-1.5">
            {events.length === 0 && (
              <li className="text-[13px] text-navy-600">None selected.</li>
            )}
            {events.map((e) => (
              <li key={e.id} className="flex items-center gap-2 rounded-xl bg-lavender-50 px-3 py-2 text-[13px] text-navy-800">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${EVENT_META[e.type].dot}`} aria-hidden />
                <span className="min-w-0">
                  <span className="block truncate font-medium">{e.title}</span>
                  <span className="block text-xs text-navy-600">{formatEventDate(e.date).full}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="!p-4">
          <CardTitle className="!text-[15px]">Selected documents</CardTitle>
          <ul className="mt-2 space-y-1.5">
            {docs.length === 0 && (
              <li className="text-[13px] text-navy-600">None selected.</li>
            )}
            {docs.map((d) => (
              <li key={d.id} className="rounded-xl bg-teal-soft-50 px-3 py-2 text-[13px] text-navy-800">
                <span className="block truncate font-medium">{d.name}</span>
                <span className="block text-xs text-navy-600">{DOC_TYPE_LABELS[d.docType]}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
