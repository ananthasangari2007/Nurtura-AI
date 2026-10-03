/**
 * Data-provider centralization — demo mode vs Supabase.
 *
 * Single rule for the whole app: if SUPABASE_URL (+ key) is missing,
 * every module serves local/mock data with identical shapes and the UI
 * shows its "Mock connected" state. No feature may crash for lack of
 * backend config — graceful fallback everywhere.
 */

export type DataProvider = "mock" | "supabase";

export function getDataProvider(): DataProvider {
  return process.env.SUPABASE_URL ? "supabase" : "mock";
}

export function isDemoMode(): boolean {
  return getDataProvider() === "mock";
}

/** Human-readable status line for settings / health surfaces. */
export function providerLabel(provider: DataProvider): string {
  return provider === "supabase" ? "Supabase connected" : "Mock connected";
}
