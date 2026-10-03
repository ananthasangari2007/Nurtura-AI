"use client";

import { useCallback, useMemo, useState } from "react";
import type { CareEvent } from "@/lib/mock-data";
import type { NewCareEventInput } from "@/lib/journey/api";
import {
  filterEvents,
  getJourneyStats,
  sortEventsChronological,
  splitJourney,
  type JourneyFilterId,
} from "@/lib/journey/memory";

/**
 * useJourneyMemory — client state management for the Care Journey Memory module.
 * Seeds from server-provided events; additions POST to /api/journey/events
 * (mock-backed today, Supabase later) with a local fallback.
 */
export function useJourneyMemory(seed: CareEvent[]) {
  const [events, setEvents] = useState<CareEvent[]>(() => sortEventsChronological(seed));
  const [filter, setFilter] = useState<JourneyFilterId>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const visible = useMemo(() => filterEvents(events, filter), [events, filter]);
  const stats = useMemo(() => getJourneyStats(events), [events]);
  const { upcoming, completed } = useMemo(() => splitJourney(events), [events]);
  const selected = useMemo(
    () => events.find((e) => e.id === selectedId) ?? null,
    [events, selectedId]
  );

  const addEvent = useCallback(async (input: NewCareEventInput) => {
    setSaving(true);
    try {
      const res = await fetch("/api/journey/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("request failed");
      const data = (await res.json()) as { event: CareEvent };
      setEvents((prev) => sortEventsChronological([...prev, data.event]));
      setSelectedId(data.event.id);
      return data.event;
    } catch {
      // Offline/demo fallback: keep it local so the UI never breaks.
      const local: CareEvent = {
        ...input,
        id: `local-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setEvents((prev) => sortEventsChronological([...prev, local]));
      setSelectedId(local.id);
      return local;
    } finally {
      setSaving(false);
      setModalOpen(false);
    }
  }, []);

  return {
    events,
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
  };
}

export type JourneyMemory = ReturnType<typeof useJourneyMemory>;
