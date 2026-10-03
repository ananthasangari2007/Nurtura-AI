"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_SCOPE,
  type AuditEvent,
  type HandoffPassport,
  type ShareScope,
} from "@/lib/handoff/types";

/**
 * useHandoff — patient-side passport state.
 * Scope + item selection stay local until the patient generates;
 * passports/audit round-trip the API vault with an offline fallback.
 */
export function useHandoff() {
  const [scope, setScope] = useState<ShareScope>(DEFAULT_SCOPE);
  const [questionIds, setQuestionIds] = useState<string[]>(["q1", "q2"]);
  const [eventIds, setEventIds] = useState<string[]>(["e1", "e2", "e3"]);
  const [documentIds, setDocumentIds] = useState<string[]>(["doc1", "doc2"]);
  const [consentOpen, setConsentOpen] = useState(false);
  const [passports, setPassports] = useState<HandoffPassport[]>([]);
  const [audit, setAudit] = useState<AuditEvent[]>([]);
  const [activeToken, setActiveToken] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [acting, setActing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/handoff/passports", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as {
        passports: HandoffPassport[];
        audit: AuditEvent[];
      };
      setPassports(data.passports);
      setAudit(data.audit);
    } catch {
      // Offline demo — local state remains the source of truth.
    }
  }, []);

  useEffect(() => {
    // Initial vault sync is an external-system subscription, not render cascading.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  const toggleScope = useCallback((key: keyof ShareScope) => {
    setScope((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  function toggleIn(list: string[], id: string, set: (v: string[]) => void) {
    set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  }
  const toggleQuestion = useCallback(
    (id: string) => toggleIn(questionIds, id, setQuestionIds),
    [questionIds]
  );
  const toggleEvent = useCallback(
    (id: string) => toggleIn(eventIds, id, setEventIds),
    [eventIds]
  );
  const toggleDocument = useCallback(
    (id: string) => toggleIn(documentIds, id, setDocumentIds),
    [documentIds]
  );

  const active = passports.find((p) => p.token === activeToken) ?? passports[0] ?? null;

  const generate = useCallback(async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/handoff/passports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope, items: { questionIds, eventIds, documentIds } }),
      });
      const data = (await res.json()) as {
        passport?: HandoffPassport;
        audit?: AuditEvent[];
        error?: string;
      };
      if (!res.ok || !data.passport) throw new Error(data.error ?? "create failed");
      setActiveToken(data.passport.token);
      await refresh();
      setConsentOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create passport.");
      // Offline fallback: fully local demo passport.
      const now = Date.now();
      const local: HandoffPassport = {
        token: `ntr_local_${now.toString(36)}`,
        createdAt: new Date(now).toISOString(),
        expiresAt: new Date(now + 24 * 3_600_000).toISOString(),
        scope: { ...scope },
        items: { questionIds: [...questionIds], eventIds: [...eventIds], documentIds: [...documentIds] },
        status: "active",
        viewCount: 0,
      };
      setPassports((prev) => [local, ...prev]);
      setAudit((prev) => [
        { id: `audit-local-${now}`, token: local.token, at: local.createdAt, kind: "created", detail: "Created offline (demo)." },
        ...prev,
      ]);
      setActiveToken(local.token);
      setConsentOpen(false);
    } finally {
      setGenerating(false);
    }
  }, [scope, questionIds, eventIds, documentIds, refresh]);

  const act = useCallback(
    async (token: string, action: "revoke" | "expire") => {
      setActing(true);
      try {
        await fetch(`/api/handoff/passports/${token}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        });
      } catch {
        if (action === "revoke") {
          setPassports((prev) =>
            prev.map((p) => (p.token === token ? { ...p, status: "revoked" as const } : p))
          );
        }
      } finally {
        await refresh();
        setActing(false);
      }
    },
    [refresh]
  );

  return {
    scope,
    toggleScope,
    questionIds,
    toggleQuestion,
    eventIds,
    toggleEvent,
    documentIds,
    toggleDocument,
    consentOpen,
    setConsentOpen,
    passports,
    audit,
    active,
    setActiveToken,
    generating,
    acting,
    error,
    generate,
    revoke: (t: string) => act(t, "revoke"),
    expireDemo: (t: string) => act(t, "expire"),
  };
}

export type HandoffState = ReturnType<typeof useHandoff>;
