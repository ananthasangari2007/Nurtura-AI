/**
 * Supabase client stub — server-side only.
 *
 * Returns null when env is missing (demo mode). When configured, returns
 * the project coordinates; swap in @supabase/supabase-js here later —
 * the per-module repository abstractions already isolate every call site.
 * NEVER import this (or any key) from client components.
 */

import { getDataProvider } from "@/lib/db/provider";

export type SupabaseConfig = {
  url: string;
  anonKey: string;
};

export function getSupabaseConfig(): SupabaseConfig | null {
  if (getDataProvider() === "mock") return null;
  const url = process.env.SUPABASE_URL ?? "";
  const anonKey = process.env.SUPABASE_ANON_KEY ?? "";
  if (!url || !anonKey) return null;
  return { url, anonKey };
}
