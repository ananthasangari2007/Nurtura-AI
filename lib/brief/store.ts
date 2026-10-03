"use client";

import { useCallback, useMemo, useState } from "react";
import { mockQuestions, seedCareEvents } from "@/lib/mock-data";
import {
  DEMO_CARE_FLOW,
  demoBriefDocuments,
  loadSavedBrief,
  saveBriefLocal,
  type BriefDocument,
  type BriefQuestion,
  type BriefStepId,
  type CareRequest,
  type PatientBrief,
} from "@/lib/brief/types";

/**
 * useBriefBuilder — state for the "I Need a Doctor" → Visit Brief workflow.
 * Persists the approved brief to localStorage (mock persistence;
 * Supabase `visit_briefs` table later without changing the screen).
 */
export function useBriefBuilder() {
  // Restore a previously approved brief via lazy initializers (no effects).
  const [initial] = useState(() =>
    typeof window === "undefined" ? null : loadSavedBrief()
  );
  const [step, setStep] = useState<BriefStepId>("intake");
  const [request, setRequest] = useState<CareRequest>(() => ({
    reason: initial?.reason ?? "",
    provider: initial?.provider ?? "",
    kind: initial?.kind ?? "",
    notes: initial?.notes ?? "",
  }));
  const [questions, setQuestions] = useState<BriefQuestion[]>(
    () =>
      initial?.questions ??
      mockQuestions.map((q) => ({ id: q.id, text: q.text, discussed: false }))
  );
  const [documents, setDocuments] = useState<BriefDocument[]>(
    () => initial?.documents ?? demoBriefDocuments
  );
  const [eventIds, setEventIds] = useState<string[]>(
    () => initial?.eventIds ?? ["e1", "e2", "e3"]
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [approvedAt, setApprovedAt] = useState<string | null>(
    () => initial?.generatedAt ?? null
  );

  const setField = useCallback(
    (field: keyof CareRequest, value: string) =>
      setRequest((prev) => ({ ...prev, [field]: value })),
    []
  );

  const intakeDone = request.reason.trim() !== "" && request.provider !== "" && request.kind !== "";

  const addQuestion = useCallback((text: string) => {
    const clean = text.trim().slice(0, 200);
    if (!clean) return;
    setQuestions((prev) => [
      ...prev,
      { id: `bq-${Date.now()}`, text: clean, discussed: false },
    ]);
  }, []);

  const updateQuestion = useCallback((id: string, text: string) => {
    const clean = text.trim().slice(0, 200);
    if (!clean) return;
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, text: clean } : q)));
    setEditingId(null);
  }, []);

  const removeQuestion = useCallback((id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }, []);

  const toggleDiscussed = useCallback((id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, discussed: !q.discussed } : q))
    );
  }, []);

  const toggleDocument = useCallback((id: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, selected: !d.selected } : d))
    );
  }, []);

  const toggleEvent = useCallback((id: string) => {
    setEventIds((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]));
  }, []);

  const selectedEvents = useMemo(
    () => seedCareEvents.filter((e) => eventIds.includes(e.id)),
    [eventIds]
  );

  /** One-tap demo flow from the brief: previous-visit follow-up. */
  const loadDemoFlow = useCallback(() => {
    setRequest({ ...DEMO_CARE_FLOW.request });
    const base = mockQuestions.map((q) => ({
      id: q.id,
      text: q.text,
      discussed: false,
    }));
    const extra = DEMO_CARE_FLOW.questions.map((text, i) => ({
      id: `demo-q${i}`,
      text,
      discussed: false,
    }));
    setQuestions([...base, ...extra]);
    setDocuments((prev) =>
      prev.map((d) => ({ ...d, selected: DEMO_CARE_FLOW.documentIds.includes(d.id) }))
    );
    setEventIds(["e1", "e2", "e3", "e5"]);
    setApprovedAt(null);
    setStep("preview");
  }, []);

  const brief: PatientBrief = useMemo(
    () => ({
      reason: request.reason,
      provider: request.provider,
      kind: request.kind,
      questions,
      documents: documents.filter((d) => d.selected),
      eventIds,
      appointment: {
        title: "Antenatal checkup",
        date: "Friday, Oct 10",
        time: "10:30 AM",
        location: "City Care Clinic, Room 4",
      },
      notes: request.notes,
      generatedAt: approvedAt ?? new Date().toISOString(),
      discussedCount: questions.filter((q) => q.discussed).length,
    }),
    [request, questions, documents, eventIds, approvedAt]
  );

  const approveBrief = useCallback(() => {
    const stamp = new Date().toISOString();
    setApprovedAt(stamp);
    saveBriefLocal({ ...brief, generatedAt: stamp });
  }, [brief]);

  const markAllDiscussed = useCallback(() => {
    setQuestions((prev) => prev.map((q) => ({ ...q, discussed: true })));
  }, []);

  const resetDiscussed = useCallback(() => {
    setQuestions((prev) => prev.map((q) => ({ ...q, discussed: false })));
  }, []);

  return {
    step,
    setStep,
    request,
    setField,
    intakeDone,
    questions,
    addQuestion,
    updateQuestion,
    removeQuestion,
    toggleDiscussed,
    editingId,
    setEditingId,
    documents,
    toggleDocument,
    eventIds,
    toggleEvent,
    selectedEvents,
    brief,
    approvedAt,
    approveBrief,
    markAllDiscussed,
    resetDiscussed,
    loadDemoFlow,
  };
}

export type BriefBuilder = ReturnType<typeof useBriefBuilder>;
