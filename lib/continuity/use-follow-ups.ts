"use client";

import { useCallback, useMemo, useState } from "react";
import {
  bucketOf,
  loadFollowUpsLocal,
  saveFollowUpsLocal,
  seedFollowUps,
  sortFollowUps,
  type FollowUpItem,
} from "@/lib/continuity/types";

/**
 * useFollowUps — continuity state.
 * Complete · snooze (+3 days) · reschedule · prep toggles ·
 * reminder simulation. localStorage-backed (mock); Supabase later.
 */
export function useFollowUps() {
  const [initial] = useState(() =>
    typeof window === "undefined" ? null : loadFollowUpsLocal()
  );
  const [items, setItems] = useState<FollowUpItem[]>(() => initial ?? seedFollowUps);
  const [reminderSent, setReminderSent] = useState<string | null>(null);

  const persist = useCallback((next: FollowUpItem[]) => {
    setItems(next);
    saveFollowUpsLocal(next);
  }, []);

  const buckets = useMemo(() => {
    const sorted = sortFollowUps(items);
    return {
      upcoming: sorted.filter((i) => bucketOf(i) === "upcoming"),
      dueSoon: sorted.filter((i) => bucketOf(i) === "due-soon"),
      completed: sorted.filter((i) => bucketOf(i) === "completed"),
    };
  }, [items]);

  const markComplete = useCallback(
    (id: string) => {
      persist(
        items.map((i) =>
          i.id === id
            ? { ...i, completed: true, prep: i.prep.map((p) => ({ ...p, done: true })) }
            : i
        )
      );
    },
    [items, persist]
  );

  const reopen = useCallback(
    (id: string) => {
      persist(items.map((i) => (i.id === id ? { ...i, completed: false } : i)));
    },
    [items, persist]
  );

  const snooze = useCallback(
    (id: string, days = 3) => {
      persist(
        items.map((i) => {
          if (i.id !== id) return i;
          const d = new Date(i.date + "T00:00:00");
          d.setDate(d.getDate() + days);
          return { ...i, completed: false, date: d.toISOString().slice(0, 10) };
        })
      );
    },
    [items, persist]
  );

  const reschedule = useCallback(
    (id: string, date: string) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
      persist(items.map((i) => (i.id === id ? { ...i, completed: false, date } : i)));
    },
    [items, persist]
  );

  const togglePrep = useCallback(
    (itemId: string, prepId: string) => {
      persist(
        items.map((i) =>
          i.id === itemId
            ? { ...i, prep: i.prep.map((p) => (p.id === prepId ? { ...p, done: !p.done } : p)) }
            : i
        )
      );
    },
    [items, persist]
  );

  const sendReminder = useCallback((id: string) => {
    setReminderSent(id);
    setTimeout(() => setReminderSent((cur) => (cur === id ? null : cur)), 2500);
  }, []);

  return {
    items,
    buckets,
    markComplete,
    reopen,
    snooze,
    reschedule,
    togglePrep,
    sendReminder,
    reminderSent,
  };
}

export type FollowUpsState = ReturnType<typeof useFollowUps>;
