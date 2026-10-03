/**
 * Database abstraction — Supabase/Postgres-ready, mock-backed for the hackathon prototype.
 *
 * Swap `mockDb` with a real Supabase client later without changing call sites:
 *   - keep the same function signatures
 *   - read connection config from env (see .env.example)
 */

import {
  mockActions,
  mockAppointments,
  mockFollowUps,
  mockQuestions,
  seedCareEvents,
  type CareEvent,
} from "@/lib/mock-data";

import { getDataProvider } from "@/lib/db/provider";

export type DbStatus = {
  provider: "mock" | "supabase";
  connected: boolean;
  latencyMs: number;
};

export async function getDbStatus(): Promise<DbStatus> {
  const provider = getDataProvider();
  return {
    provider,
    connected: true,
    latencyMs: provider === "mock" ? 4 : 40,
  };
}

export const mockDb = {
  async listQuestions() {
    return mockQuestions;
  },
  async listAppointments() {
    return mockAppointments;
  },
  async listActions() {
    return mockActions;
  },
  async listFollowUps() {
    return mockFollowUps;
  },
  async listCareEvents(): Promise<CareEvent[]> {
    return [...seedCareEvents];
  },
  async createCareEvent(
    input: Omit<CareEvent, "id" | "createdAt">
  ): Promise<CareEvent> {
    // Mock persistence: echo back with a generated id. A Supabase
    // implementation would insert into `care_events` and return the row.
    return {
      ...input,
      id: `e-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
  },
};
