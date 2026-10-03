/**
 * Data-provider centralization — demo mode vs Supabase.
 *
 * Single rule for the whole app: if no Supabase URL (+ key) is configured,
 * every module serves local/mock data with identical shapes and the UI
 * shows its "Mock connected" state. No feature may crash for lack of
 * backend config — graceful fallback everywhere.
 *
 * Env naming (Vercel-safe):
 * - NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are the
 *   primary names. The anon key is designed to be public (RLS enforces
 *   access) so NEXT_PUBLIC_ exposure is safe and intended.
 * - SUPABASE_URL / SUPABASE_ANON_KEY are accepted as server-side fallbacks
 *   for existing installs. Service-role keys are NEVER read anywhere in
 *   this codebase and must never use a NEXT_PUBLIC_ prefix.
 */

export type DataProvider = "mock" | "supabase";

export function supabaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? ""
  );
}

export function supabaseAnonKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    ""
  );
}

export function getDataProvider(): DataProvider {
  return supabaseUrl() ? "supabase" : "mock";
}

export function isDemoMode(): boolean {
  return getDataProvider() === "mock";
}

/** Human-readable status line for settings / health surfaces. */
export function providerLabel(provider: DataProvider): string {
  return provider === "supabase" ? "Supabase connected" : "Mock connected";
}
