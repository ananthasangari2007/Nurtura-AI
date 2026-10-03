"use client";

import { useSyncExternalStore } from "react";

/**
 * Hydration-safe mounted flag. Server renders `false`, client hydrates
 * `false` first (no mismatch), then flips to `true`. Use it to gate
 * browser-only branches (Web Speech support, persisted banners).
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
