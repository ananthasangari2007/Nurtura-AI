"use client";

import { ArrowRight, CalendarPlus, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import { SafetyBanner } from "@/components/ui/SafetyBanner";
import { FlowNext } from "@/components/ui/FlowNext";
import { SectionHeading } from "@/components/ui/Section";
import { useJourneyMemory } from "@/lib/journey/use-journey-memory";
import { JOURNEY_FILTERS } from "@/lib/journey/memory";
import type { CareEvent } from "@/lib/mock-data";
import { formatEventDate } from "@/lib/journey/memory";
import { JourneyFilters } from "./JourneyFilters";
import { JourneyTimeline } from "./JourneyTimeline";
import { JourneyEmptyState } from "./JourneyEmptyState";
import { JourneyProgress } from "./JourneyProgress";
import { AddEventModal } from "./AddEventModal";
import { EventDetailPanel } from "./EventDetailPanel";
import { AskJourney } from "./AskJourney";

/**
 * JourneyMemoryScreen — the complete Care Journey Memory module.
 * Longitudinal timeline + filters + add/detail + progress + recall.
 */
export function JourneyMemoryScreen({ seed }: { seed: CareEvent[] }) {
  const journey = useJourneyMemory(seed);
  const {
    visible,
    stats,
    upcoming,
    completed,
    filter,
    setFilter,
    selected,
    setSelectedId,
    modalOpen,
    setModalOpen,
    saving,
    addEvent,
  } = journey;

  const activeLabel =
    JOURNEY_FILTERS.find((f) => f.id === filter)?.label ?? "All";
  const nextUp = upcoming.slice(0, 2);
  const recentDone = completed.slice(-2).reverse();

  return (
    <div className="space-y-5">
      <SectionHeading
        eyebrow="Care Journey Memory"
        title="Your care, remembered."
        description="A longitudinal memory of visits, papers, questions, and nudges — organized, never clinical. Mock-backed now, Supabase-ready later."
        action={
          <Button onClick={() => setModalOpen(true)}>
            <CalendarPlus className="h-4 w-4" aria-hidden />
            Add journey event
          </Button>
        }
      />

      {/* Progress + up next */}
      <div className="animate-fade-up grid gap-4 md:grid-cols-2">
        <JourneyProgress stats={stats} />
        <Card>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blush-500" aria-hidden />
              Up next
            </CardTitle>
            <Badge tone="blush">{upcoming.length} upcoming</Badge>
          </div>
          {nextUp.length === 0 ? (
            <p className="mt-3 text-sm text-navy-600">
              Nothing upcoming — your journey is all caught up.
            </p>
          ) : (
            <ul className="mt-3 space-y-2.5">
              {nextUp.map((e) => (
                <li key={e.id}>
                  <button
                    onClick={() => setSelectedId(e.id)}
                    className="flex w-full items-center gap-3 rounded-2xl border border-navy-100/70 px-3.5 py-3 text-left transition hover:border-lavender-200 hover:shadow-soft"
                  >
                    <span className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-2xl bg-blush-50 font-display leading-none">
                      <span className="text-sm font-semibold text-navy-800">
                        {formatEventDate(e.date).day}
                      </span>
                      <span className="text-[10px] font-medium text-navy-600">
                        {formatEventDate(e.date).month}
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-navy-800">
                        {e.title}
                      </span>
                      <span className="block truncate text-xs text-navy-600">
                        {formatEventDate(e.date).full}
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-lavender-500" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-3 flex items-center gap-1.5 text-[13px] text-navy-600">
            <CheckCircle2 className="h-4 w-4 text-teal-soft-600" aria-hidden />
            {stats.completed} memories completed · {stats.progress}% journey ready
          </div>
        </Card>
      </div>

      {/* Timeline + recall */}
      <div className="grid items-start gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <section
          className="animate-fade-up min-w-0 space-y-4"
          style={{ animationDelay: "80ms" }}
          aria-label="Journey timeline"
        >
          <JourneyFilters active={filter} onChange={setFilter} events={journey.events} />
          {visible.length === 0 ? (
            <JourneyEmptyState
              filterLabel={activeLabel}
              onAdd={() => setModalOpen(true)}
              onClear={() => setFilter("all")}
            />
          ) : (
            <JourneyTimeline
              events={visible}
              selectedId={selected?.id ?? null}
              onSelect={setSelectedId}
            />
          )}
        </section>

        <div
          className="animate-fade-up min-w-0 space-y-4"
          style={{ animationDelay: "140ms" }}
        >
          <AskJourney
            events={journey.events}
            onHighlight={(id) => setSelectedId(id)}
          />
          <Card>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-teal-soft-600" aria-hidden />
                Recently completed
              </CardTitle>
              <Badge tone="teal">{completed.length} done</Badge>
            </div>
            <ul className="mt-3 space-y-2">
              {recentDone.map((e) => (
                <li key={e.id}>
                  <button
                    onClick={() => setSelectedId(e.id)}
                    className="block w-full truncate rounded-2xl bg-teal-soft-50/70 px-3.5 py-2.5 text-left text-sm text-navy-700 transition hover:bg-teal-soft-50"
                  >
                    <span className="font-medium">{e.title}</span>
                    <span className="block text-xs text-navy-600">
                      {formatEventDate(e.date).full} · {e.source}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <div className="animate-fade-up" style={{ animationDelay: "200ms" }}>
        <FlowNext from="/care-journey" />
      </div>

      <div className="animate-fade-up" style={{ animationDelay: "220ms" }}>
        <SafetyBanner />
      </div>

      <AddEventModal
        open={modalOpen}
        saving={saving}
        onClose={() => setModalOpen(false)}
        onSubmit={(input) => void addEvent(input)}
      />
      {selected && (
        <EventDetailPanel event={selected} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}
