/**
 * Journey repository abstraction — Supabase-ready.
 *
 * The app talks only to `JourneyRepository`. Today it is backed by the
 * mock DB (works with zero external services). To go live, implement this
 * interface with Supabase (`care_events` table) and return it from
 * `getJourneyRepository()` when `SUPABASE_URL` is set. No call-site changes.
 */

import { mockDb } from "@/lib/db/client";
import type { CareEvent } from "@/lib/mock-data";

export type NewCareEventInput = Omit<CareEvent, "id" | "createdAt">;

export interface JourneyRepository {
  listEvents(): Promise<CareEvent[]>;
  createEvent(input: NewCareEventInput): Promise<CareEvent>;
}

export const mockJourneyRepository: JourneyRepository = {
  listEvents: () => mockDb.listCareEvents(),
  createEvent: (input) => mockDb.createCareEvent(input),
};

export function getJourneyRepository(): JourneyRepository {
  // Future: `if (process.env.SUPABASE_URL) return supabaseJourneyRepository;`
  return mockJourneyRepository;
}
