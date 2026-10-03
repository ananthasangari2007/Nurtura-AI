"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { demoAppointment } from "@/lib/mock-data";
import { extractDocumentCareActions } from "@/lib/documents/extract";
import {
  seedDocuments,
  todayISO,
  type CareDocument,
  type DocReminder,
  type DocType,
  type ExtractedCareActions,
} from "@/lib/documents/types";

export const PROCESS_STEPS = [
  "Reading document pages…",
  "Finding dates, names & places…",
  "Building care actions…",
] as const;

export type PrepCheck = { id: string; label: string; done: boolean };

const MAX_BYTES = 10 * 1024 * 1024;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function kindOf(file: File): CareDocument["fileKind"] | null {
  if (file.type === "application/pdf") return "pdf";
  if (file.type.startsWith("image/")) return "image";
  return null;
}

/**
 * useDocuments — upload → organize → review → confirm pipeline.
 * Confirmation is the ONLY path that touches the journey, reminders,
 * or the preparation checklist. Discard removes the upload.
 */
export function useDocuments() {
  const [library, setLibrary] = useState<CareDocument[]>(seedDocuments);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | DocType>("all");
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [processStep, setProcessStep] = useState(0);
  const [review, setReview] = useState<{
    docId: string;
    actions: ExtractedCareActions;
  } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [reminders, setReminders] = useState<DocReminder[]>([
    { id: "seed-r1", title: "Confirm Oct 10 clinic slot", due: "Oct 8" },
  ]);
  const [prep, setPrep] = useState<PrepCheck[]>(() =>
    demoAppointment.prep.map((p) => ({ ...p }))
  );
  const cancelled = useRef(false);
  useEffect(() => () => {
    cancelled.current = true;
  }, []);

  const processing = activeDocId !== null;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return library.filter((d) => {
      const matchesType = typeFilter === "all" || d.docType === typeFilter;
      const matchesQuery = q === "" || d.name.toLowerCase().includes(q);
      return matchesType && matchesQuery;
    });
  }, [library, query, typeFilter]);

  const previewDoc = useMemo(
    () => library.find((d) => d.id === previewId) ?? null,
    [library, previewId]
  );
  const reviewDoc = useMemo(
    () => library.find((d) => d.id === review?.docId) ?? null,
    [library, review]
  );

  const upload = useCallback(async (file: File, docType: DocType) => {
    setUploadError(null);
    const kind = kindOf(file);
    if (!kind) {
      setUploadError("Prototype supports PDF and image files only.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setUploadError("Please choose a file under 10 MB for this prototype.");
      return;
    }
    const id = `up-${Date.now()}`;
    const doc: CareDocument = {
      id,
      name: file.name.replace(/\.[^.]+$/, "").slice(0, 60) || "Untitled document",
      fileKind: kind,
      docType,
      dateAdded: todayISO(),
      status: "processing",
      previewUrl: kind === "image" ? URL.createObjectURL(file) : undefined,
    };
    setLibrary((prev) => [doc, ...prev]);
    setReview(null);
    setActiveDocId(id);

    // Processing animation: staged, cancellable.
    for (let i = 0; i < PROCESS_STEPS.length; i++) {
      setProcessStep(i);
      await sleep(850);
      if (cancelled.current) return;
    }

    // Extraction via API seam, deterministic local fallback.
    let actions: ExtractedCareActions | null = null;
    try {
      const res = await fetch("/api/documents/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: doc.name, docType, fileKind: kind }),
      });
      if (res.ok) {
        const data = (await res.json()) as { actions: ExtractedCareActions };
        actions = data.actions;
      }
    } catch {
      actions = null;
    }
    if (!actions) {
      actions = await extractDocumentCareActions({
        name: doc.name,
        docType,
        fileKind: kind,
      });
    }
    if (cancelled.current) return;
    setLibrary((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "review" as const } : d))
    );
    setActiveDocId(null);
    setReview({ docId: id, actions });
  }, []);

  /** User-confirmed: journey event + reminders + checklist. Nothing auto-added. */
  const confirmReview = useCallback(async () => {
    if (!review || !reviewDoc) return;
    setConfirming(true);
    const { actions } = review;
    const summary = [
      `Upcoming appointment: ${actions.appointmentDate}.`,
      `Bring: ${actions.bringItems.join(", ") || "nothing flagged"}.`,
      actions.followUpRequired
        ? `Follow-up: required (${actions.followUpDate}).`
        : "Follow-up: none flagged.",
    ].join(" ");
    try {
      const res = await fetch("/api/journey/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "document",
          date: reviewDoc.dateAdded,
          title: `${reviewDoc.name} organized`,
          description: `${actions.documentType} filed. ${summary}`,
          source: "Document organizer",
          status: "completed",
          relatedDocumentId: reviewDoc.id,
        }),
      });
      const eventId = res.ok
        ? ((await res.json()) as { event: { id: string } }).event.id
        : `local-${Date.now()}`;
      setLibrary((prev) =>
        prev.map((d) =>
          d.id === reviewDoc.id
            ? { ...d, status: "organized" as const, relatedEventId: eventId }
            : d
        )
      );
    } catch {
      setLibrary((prev) =>
        prev.map((d) =>
          d.id === reviewDoc.id ? { ...d, status: "organized" as const } : d
        )
      );
    }
    setReminders((prev) => {
      const titles = new Set(prev.map((r) => r.title));
      const fresh = actions.reminders.filter((r) => !titles.has(r.title));
      return [...prev, ...fresh];
    });
    setPrep((prev) => {
      const labels = new Set(prev.map((p) => p.label.toLowerCase()));
      const fresh = actions.prepItems
        .filter((label) => !labels.has(label.toLowerCase()))
        .map((label) => ({ id: `prep-${Date.now()}-${label}`, label, done: false }));
      return [...prev, ...fresh];
    });
    setReview(null);
    setConfirming(false);
  }, [review, reviewDoc]);

  const discardReview = useCallback(() => {
    if (!review) return;
    setLibrary((prev) => prev.filter((d) => d.id !== review.docId));
    setReview(null);
  }, [review]);

  const togglePrep = useCallback((id: string) => {
    setPrep((prev) => prev.map((p) => (p.id === id ? { ...p, done: !p.done } : p)));
  }, []);

  return {
    library,
    visible,
    query,
    setQuery,
    typeFilter,
    setTypeFilter,
    previewDoc,
    setPreviewId,
    processing,
    processStep,
    activeDocId,
    review,
    reviewDoc,
    uploadError,
    upload,
    confirming,
    confirmReview,
    discardReview,
    reminders,
    prep,
    togglePrep,
  };
}

export type DocumentsState = ReturnType<typeof useDocuments>;
