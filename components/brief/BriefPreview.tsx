"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Check,
  Eye,
  FileDown,
  HeartHandshake,
  Pencil,
  RotateCcw,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatEventDate } from "@/lib/journey/memory";
import { seedCareEvents } from "@/lib/mock-data";
import {
  BRIEF_DISCLAIMER,
  type BriefStepId,
  type PatientBrief,
} from "@/lib/brief/types";
import { cn } from "@/lib/utils";

/**
 * BriefPreview — beautiful document-like PATIENT VISIT BRIEF.
 * Preview · approve · print/download · "Show to Doctor" mode ·
 * mark-as-discussed after the appointment.
 */
export function BriefPreview({
  brief,
  approvedAt,
  onApprove,
  onToggleDiscussed,
  onMarkAllDiscussed,
  onResetDiscussed,
  onEdit,
}: {
  brief: PatientBrief;
  approvedAt: string | null;
  onApprove: () => void;
  onToggleDiscussed: (id: string) => void;
  onMarkAllDiscussed: () => void;
  onResetDiscussed: () => void;
  onEdit: (step: BriefStepId) => void;
}) {
  const [doctorMode, setDoctorMode] = useState(false);
  const events = seedCareEvents.filter((e) => brief.eventIds.includes(e.id));
  const discussed = brief.questions.filter((q) => q.discussed).length;
  const total = brief.questions.length;
  const allDiscussed = total > 0 && discussed === total;

  return (
    <div className="space-y-4">
      {/* Toolbar (screen only) */}
      <div className="print:hidden flex flex-wrap items-center gap-2">
        <Badge tone={approvedAt ? "teal" : "lavender"}>
          {approvedAt ? "Patient-approved brief" : "Draft — review & approve"}
        </Badge>
        <span className="flex-1" />
        <Button size="sm" variant="soft" onClick={() => setDoctorMode(true)}>
          <Eye className="h-4 w-4" aria-hidden /> Show to Doctor
        </Button>
        <Button size="sm" variant="soft" onClick={() => window.print()}>
          <FileDown className="h-4 w-4" aria-hidden /> Print / Save PDF
        </Button>
        {!approvedAt && (
          <Button size="sm" onClick={onApprove}>
            <BadgeCheck className="h-4 w-4" aria-hidden /> Approve brief
          </Button>
        )}
      </div>

      {/* The document */}
      <article
        id="visit-brief"
        aria-label="Patient visit brief document"
        className="overflow-hidden rounded-[1.5rem] border border-navy-100 bg-white shadow-soft"
      >
        {/* Letterhead */}
        <div className="border-b-2 border-navy-800 px-6 py-5 sm:px-8">
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 font-display text-sm font-semibold text-navy-800">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-navy-800 text-white">
                <HeartHandshake className="h-4 w-4" aria-hidden />
              </span>
              Nurtura AI
            </p>
            <p className="text-xs font-medium text-navy-600">
              {new Date(brief.generatedAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-navy-800 sm:text-[28px]">
            PATIENT VISIT BRIEF
          </h2>
          <p className="mt-1 text-sm text-navy-600">
            Prepared by Ananya · {brief.kind === "follow-up" ? "Follow-up visit" : brief.kind === "new" ? "New consultation" : "Visit"} · {brief.provider}
          </p>
        </div>

        <div className="space-y-6 px-6 py-6 sm:px-8">
          <BriefSection n="1" title="Reason for visit" onEdit={() => onEdit("intake")}>
            <p className="text-[15px] leading-relaxed text-navy-800">{brief.reason || "—"}</p>
          </BriefSection>

          <BriefSection
            n="2"
            title={`Patient's questions (${discussed}/${total} discussed)`}
            onEdit={() => onEdit("questions")}
          >
            {total === 0 ? (
              <p className="text-sm text-navy-600">No questions added yet.</p>
            ) : (
              <ol className="space-y-2">
                {brief.questions.map((q, i) => (
                  <li
                    key={q.id}
                    className="flex items-start gap-2.5 rounded-2xl bg-navy-50 px-3.5 py-2.5"
                  >
                    <button
                      onClick={() => onToggleDiscussed(q.id)}
                      aria-pressed={q.discussed}
                      aria-label={`Mark question ${i + 1} as discussed`}
                      className={cn(
                        "print:hidden mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition",
                        q.discussed
                          ? "border-teal-soft-500 bg-teal-soft-500 text-white"
                          : "border-navy-200 bg-white"
                      )}
                    >
                      {q.discussed && <Check className="h-3.5 w-3.5" aria-hidden />}
                    </button>
                    <span
                      className={cn(
                        "text-sm leading-relaxed",
                        q.discussed ? "text-navy-600 line-through" : "text-navy-800"
                      )}
                    >
                      <span className="mr-1.5 font-display font-semibold">Q{i + 1}.</span>
                      {q.text}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </BriefSection>

          <BriefSection n="3" title="Relevant care journey events" onEdit={() => onEdit("journey")}>
            {events.length === 0 ? (
              <p className="text-sm text-navy-600">No journey events linked.</p>
            ) : (
              <ul className="space-y-1.5">
                {events.map((e) => (
                  <li key={e.id} className="flex items-baseline gap-2 text-sm text-navy-800">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lavender-400" aria-hidden />
                    <span>
                      <span className="font-medium">{e.title}</span>
                      <span className="text-navy-600"> — {formatEventDate(e.date).full}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </BriefSection>

          <BriefSection n="4" title="Selected documents" onEdit={() => onEdit("documents")}>
            {brief.documents.length === 0 ? (
              <p className="text-sm text-navy-600">No documents selected.</p>
            ) : (
              <ul className="grid gap-2 sm:grid-cols-2">
                {brief.documents.map((d) => (
                  <li
                    key={d.id}
                    className="rounded-2xl border border-navy-100 px-3.5 py-2.5"
                  >
                    <p className="text-sm font-medium text-navy-800">☐ {d.name}</p>
                    <p className="text-xs text-navy-600">{d.detail}</p>
                  </li>
                ))}
              </ul>
            )}
          </BriefSection>

          <BriefSection n="5" title="Appointment information" onEdit={() => onEdit("intake")}>
            <dl className="grid gap-2 rounded-2xl bg-navy-800 p-4 text-sm text-white sm:grid-cols-2">
              <div>
                <dt className="text-xs text-white/60">Visit</dt>
                <dd className="font-medium">{brief.appointment.title}</dd>
              </div>
              <div>
                <dt className="text-xs text-white/60">When</dt>
                <dd className="font-medium">
                  {brief.appointment.date} · {brief.appointment.time}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-white/60">Where</dt>
                <dd className="font-medium">{brief.appointment.location}</dd>
              </div>
            </dl>
          </BriefSection>

          {brief.notes && (
            <BriefSection n="6" title="Patient notes" onEdit={() => onEdit("intake")}>
              <p className="text-sm leading-relaxed text-navy-800">{brief.notes}</p>
            </BriefSection>
          )}

          {/* Disclaimer */}
          <p className="rounded-2xl border border-teal-soft-100 bg-teal-soft-50 px-4 py-3 text-[13px] leading-relaxed font-medium text-teal-soft-700">
            {BRIEF_DISCLAIMER}
          </p>

          <div className="flex items-center justify-between gap-3 pt-1 text-sm">
            <p className="text-navy-600">
              {approvedAt
                ? `Approved by patient · ${new Date(approvedAt).toLocaleDateString("en-US", { day: "numeric", month: "short" })}`
                : "Awaiting patient approval"}
            </p>
            <p className="font-display font-semibold text-navy-800">Ananya ✍</p>
          </div>
        </div>
      </article>

      {/* After-appointment */}
      <div className="print:hidden rounded-[1.25rem] border border-white bg-white p-5 shadow-soft">
        <h3 className="font-display text-[15px] font-semibold text-navy-800">
          After your appointment
        </h3>
        <p className="mt-0.5 text-[13px] text-navy-600">
          Tick questions as you discuss them. When everything is covered, close
          the loop on this visit.
        </p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-navy-100">
          <div
            className="animate-progress-fill h-full rounded-full bg-teal-soft-500"
            style={{ width: `${total === 0 ? 0 : Math.round((discussed / total) * 100)}%` }}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" onClick={onMarkAllDiscussed} disabled={allDiscussed}>
            <Check className="h-4 w-4" aria-hidden />
            {allDiscussed ? "All discussed ✓" : "Mark all discussed"}
          </Button>
          <Button size="sm" variant="soft" onClick={onResetDiscussed}>
            <RotateCcw className="h-4 w-4" aria-hidden /> Reset
          </Button>
        </div>
      </div>

      {/* Show to Doctor mode */}
      {doctorMode && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-navy-900/60 p-4 backdrop-blur-sm sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Show to doctor mode"
          onClick={() => setDoctorMode(false)}
        >
          <div
            className="animate-slide-up mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-lift sm:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-display text-xs font-semibold tracking-widest text-navy-600 uppercase">
                Please show your doctor
              </p>
              <button
                onClick={() => setDoctorMode(false)}
                aria-label="Exit show to doctor mode"
                className="print:hidden flex h-10 w-10 items-center justify-center rounded-full bg-navy-50 text-navy-700"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <h2 className="mt-2 font-display text-2xl leading-snug font-semibold text-navy-800 sm:text-3xl">
              {brief.reason}
            </h2>
            <p className="mt-1 text-base text-navy-600">
              {brief.provider} · {brief.appointment.date}
            </p>
            <h3 className="mt-6 font-display text-lg font-semibold text-navy-800">
              My questions
            </h3>
            <ol className="mt-2 space-y-2.5">
              {brief.questions.map((q, i) => (
                <li
                  key={q.id}
                  className="rounded-2xl bg-navy-50 px-4 py-3 text-lg leading-relaxed text-navy-800"
                >
                  <span className="font-display font-semibold">Q{i + 1}. </span>
                  {q.text}
                </li>
              ))}
            </ol>
            <h3 className="mt-6 font-display text-lg font-semibold text-navy-800">
              Documents I brought
            </h3>
            <p className="mt-1 text-base text-navy-700">
              {brief.documents.map((d) => d.name).join(" · ") || "—"}
            </p>
            <p className="mt-6 rounded-2xl bg-teal-soft-50 px-4 py-3 text-sm font-medium text-teal-soft-700">
              {BRIEF_DISCLAIMER}
            </p>
            <Button className="print:hidden mt-5 w-full" onClick={() => window.print()}>
              Print this view
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function BriefSection({
  n,
  title,
  onEdit,
  children,
}: {
  n: string;
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display text-[15px] font-semibold text-navy-800">
          <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-lavender-100 text-[11px] text-lavender-600">
            {n}
          </span>
          {title}
        </h3>
        <button
          onClick={onEdit}
          className="print:hidden inline-flex items-center gap-1 text-xs font-medium text-lavender-600 hover:text-lavender-500"
        >
          <Pencil className="h-3 w-3" aria-hidden /> Edit
        </button>
      </div>
      <div className="mt-2.5">{children}</div>
    </section>
  );
}
