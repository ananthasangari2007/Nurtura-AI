"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  DEFAULT_CONSENT,
  loadConsentLocal,
  saveConsentLocal,
  type ConsentCategory,
  type ConsentState,
} from "@/lib/privacy/consent";

type ConsentContextValue = {
  consent: ConsentState;
  toggle: (category: ConsentCategory) => void;
  reset: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

/** App-wide patient consent record — every sharing surface reads this. */
export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>(() =>
    typeof window === "undefined" ? loadConsentFallback() : loadConsentLocal()
  );

  const toggle = useCallback((category: ConsentCategory) => {
    setConsent((prev) => {
      const next = { ...prev, [category]: !prev[category] };
      saveConsentLocal(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setConsent({ ...DEFAULT_CONSENT });
    saveConsentLocal({ ...DEFAULT_CONSENT });
  }, []);

  const value = useMemo(() => ({ consent, toggle, reset }), [consent, toggle, reset]);
  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

function loadConsentFallback(): ConsentState {
  // Server prerender: privacy-first defaults.
  return { ...DEFAULT_CONSENT };
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used inside ConsentProvider.");
  return ctx;
}
