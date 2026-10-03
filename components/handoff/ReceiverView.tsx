import { CalendarCheck, Clock, HeartHandshake, MapPin, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { demoAppointment, demoPatient, mockFollowUps, mockQuestions, seedCareEvents } from "@/lib/mock-data";
import { seedDocuments, DOC_TYPE_LABELS } from "@/lib/documents/types";
import { formatEventDate } from "@/lib/journey/memory";
import type { HandoffPassport } from "@/lib/handoff/types";
import { ExpiryCountdown } from "./ExpiryCountdown";

/**
 * ReceiverView — shows ONLY the patient-selected scope.
 * Anything unticked never leaves the vault.
 */
export function ReceiverView({ passport }: { passport: HandoffPassport }) {
  if (passport.status !== "active") {
    return (
      <div className="mx-auto max-w-lg py-10 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-blush-100">
          <ShieldAlert className="h-7 w-7 text-blush-600" aria-hidden />
        </span>
        <h1 className="mt-4 font-display text-2xl font-semibold text-navy-800">
          {passport.status === "revoked" ? "This passport was revoked." : "This passport has expired."}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-navy-600">
          {passport.status === "revoked"
            ? "The patient withdrew access. Please ask them to create a new passport if you still need it."
            : "The 24-hour share window has elapsed. Please ask the patient for a fresh passport."}
        </p>
        <p className="mt-3 font-mono text-xs text-navy-600/70">Token {passport.token}</p>
      </div>
    );
  }

  const { scope, items } = passport;
  const events = seedCareEvents.filter((e) => items.eventIds.includes(e.id));
  const questions = mockQuestions.filter((q) => items.questionIds.includes(q.id));
  const docs = seedDocuments.filter((d) => items.documentIds.includes(d.id));
  const followups = mockFollowUps.filter((f) => f.enabled);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-navy-800 text-white">
          <HeartHandshake className="h-7 w-7" aria-hidden />
        </span>
        <p className="mt-3 text-xs font-semibold tracking-widest text-navy-600 uppercase">
          Care Handoff Passport · shared by {demoPatient.name}
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-navy-800 sm:text-3xl">
          {demoPatient.name}&apos;s care summary
        </h1>
        <div className="mt-2 flex justify-center">
          <ExpiryCountdown expiresAt={passport.expiresAt} />
        </div>
      </div>

      <article id="passport-preview" className="overflow-hidden rounded-[1.5rem] border border-navy-100 bg-white shadow-soft">
        <div className="border-b-2 border-navy-800 px-6 py-4">
          <p className="font-display text-lg font-semibold text-navy-800">Shared care summary</p>
          <p className="text-[13px] text-navy-600">
            {demoPatient.weekNote} · prepared{" "}
            {new Date(passport.createdAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
            })}
          </p>
        </div>
        <div className="space-y-5 px-6 py-5">
          {scope.timeline && (
            <section>
              <h2 className="font-display text-[15px] font-semibold text-navy-800">Care timeline</h2>
              <ul className="mt-2 space-y-1.5">
                {events.map((e) => (
                  <li key={e.id} className="rounded-xl bg-lavender-50 px-3.5 py-2 text-sm">
                    <span className="font-medium text-navy-800">{e.title}</span>
                    <span className="block text-xs text-navy-600">
                      {formatEventDate(e.date).full} · {e.source}
                    </span>
                  </li>
                ))}
                {events.length === 0 && <EmptyNote />}
              </ul>
            </section>
          )}
          {scope.appointments && (
            <section>
              <h2 className="font-display text-[15px] font-semibold text-navy-800">Upcoming appointment</h2>
              <div className="mt-2 rounded-2xl bg-navy-800 p-4 text-sm text-white">
                <p className="font-medium">
                  {demoAppointment.title} · {demoAppointment.doctor}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-white/80">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  {demoAppointment.date} · {demoAppointment.time}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-white/80">
                  <MapPin className="h-3.5 w-3.5" aria-hidden />
                  {demoAppointment.location}
                </p>
              </div>
            </section>
          )}
          {scope.questions && (
            <section>
              <h2 className="font-display text-[15px] font-semibold text-navy-800">Patient&apos;s questions</h2>
              <ol className="mt-2 space-y-1.5">
                {questions.map((q, i) => (
                  <li key={q.id} className="rounded-xl bg-blush-50 px-3.5 py-2 text-sm text-navy-800">
                    <span className="font-display font-semibold">Q{i + 1}. </span>
                    {q.text}
                  </li>
                ))}
                {questions.length === 0 && <EmptyNote />}
              </ol>
            </section>
          )}
          {scope.documents && (
            <section>
              <h2 className="font-display text-[15px] font-semibold text-navy-800">Documents (organized)</h2>
              <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                {docs.map((d) => (
                  <li key={d.id} className="rounded-xl border border-navy-100 px-3.5 py-2 text-sm">
                    <span className="font-medium text-navy-800">{d.name}</span>
                    <span className="block text-xs text-navy-600">{DOC_TYPE_LABELS[d.docType]}</span>
                  </li>
                ))}
                {docs.length === 0 && <EmptyNote />}
              </ul>
            </section>
          )}
          {scope.followups && (
            <section>
              <h2 className="flex items-center gap-1.5 font-display text-[15px] font-semibold text-navy-800">
                <CalendarCheck className="h-4 w-4 text-teal-soft-600" aria-hidden />
                Follow-up information
              </h2>
              <ul className="mt-2 space-y-1.5">
                {followups.map((f) => (
                  <li key={f.id} className="rounded-xl bg-teal-soft-50 px-3.5 py-2 text-sm text-navy-800">
                    <span className="font-medium">{f.title}</span>
                    <span className="block text-xs text-navy-600">{f.due} · {f.channel}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <p className="rounded-2xl bg-teal-soft-50 px-4 py-3 text-[13px] font-medium text-teal-soft-700">
            Patient-generated information. Clinical assessment remains with the
            healthcare professional.
          </p>
        </div>
      </article>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Badge tone="navy">Prototype share · not medical interoperability</Badge>
      </div>
    </div>
  );
}

function EmptyNote() {
  return <li className="text-[13px] text-navy-600">Nothing selected in this section.</li>;
}
