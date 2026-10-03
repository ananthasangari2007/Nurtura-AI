"use client";

import { SafetyBanner } from "@/components/ui/SafetyBanner";
import { SectionHeading } from "@/components/ui/Section";
import { getNextCareStep } from "@/lib/continuity/types";
import { useFollowUps } from "@/lib/continuity/use-follow-ups";
import { FollowUpCard } from "./FollowUpCard";
import { NextCareStep } from "./NextCareStep";

/** FollowUpsScreen — Upcoming · Due soon · Completed continuity dashboard. */
export function FollowUpsScreen() {
  const f = useFollowUps();
  const step = getNextCareStep(f.items);

  const columns = [
    { id: "dueSoon", title: "Due soon", items: f.buckets.dueSoon },
    { id: "upcoming", title: "Upcoming", items: f.buckets.upcoming },
    { id: "completed", title: "Completed", items: f.buckets.completed },
  ] as const;

  return (
    <div className="space-y-5">
      <SectionHeading
        eyebrow="Follow-up & Continuity"
        title="Nothing falls through the cracks."
        description="Visit logistics, packing, and confirmations — linked to your Care Journey Memory. Preparation only, never medical advice."
      />

      <div className="animate-fade-up">
        <NextCareStep step={step} />
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-3">
        {columns.map((col, ci) => (
          <section
            key={col.id}
            aria-label={col.title}
            className="animate-fade-up min-w-0 space-y-3"
            style={{ animationDelay: `${(ci + 1) * 80}ms` }}
          >
            <h2 className="flex items-center justify-between font-display text-[15px] font-semibold text-navy-800">
              {col.title}
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-navy-600 shadow-soft">
                {col.items.length}
              </span>
            </h2>
            {col.items.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-navy-100 bg-white/60 px-4 py-6 text-center text-[13px] text-navy-600">
                {col.id === "completed"
                  ? "Nothing completed yet — tick steps as you go."
                  : "Nothing here right now."}
              </p>
            ) : (
              col.items.map((item) => (
                <FollowUpCard
                  key={item.id}
                  item={item}
                  reminderSent={f.reminderSent === item.id}
                  onComplete={() => f.markComplete(item.id)}
                  onReopen={() => f.reopen(item.id)}
                  onSnooze={() => f.snooze(item.id)}
                  onReschedule={(date) => f.reschedule(item.id, date)}
                  onTogglePrep={(prepId) => f.togglePrep(item.id, prepId)}
                  onSendReminder={() => f.sendReminder(item.id)}
                />
              ))
            )}
          </section>
        ))}
      </div>

      <SafetyBanner />
    </div>
  );
}
