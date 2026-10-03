"use client";

import { SafetyBanner } from "@/components/ui/SafetyBanner";
import { FlowNext } from "@/components/ui/FlowNext";
import { SectionHeading } from "@/components/ui/Section";
import { useDocuments } from "@/lib/documents/use-documents";
import { UploadCard } from "./UploadCard";
import { DocumentCard } from "./DocumentCard";
import { LibraryFilters } from "./LibraryFilters";
import { ProcessingView, DocumentsEmptyState } from "./ProcessingView";
import { ExtractionReview } from "./ExtractionReview";
import { DocumentPreview } from "./DocumentPreview";
import { ContinuityPanel } from "./ContinuityPanel";

/** DocumentsScreen — upload → organize → review → confirm pipeline. */
export function DocumentsScreen() {
  const d = useDocuments();
  const searching = d.query.trim() !== "" || d.typeFilter !== "all";

  return (
    <div className="space-y-5">
      <SectionHeading
        eyebrow="Documents"
        title="Papers become plain next steps."
        description="Upload a slip or card — Nurtura organizes admin details (dates, places, packing lists) into care actions. Medical content is never read."
      />

      <div className="grid items-start gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="animate-fade-up min-w-0">
          <UploadCard onUpload={(f, t) => void d.upload(f, t)} disabled={d.processing} error={d.uploadError} />
        </div>
        <div className="animate-fade-up min-w-0" style={{ animationDelay: "80ms" }}>
          {d.processing && <ProcessingView step={d.processStep} />}
          {!d.processing && d.review && d.reviewDoc && (
            <ExtractionReview
              doc={d.reviewDoc}
              actions={d.review.actions}
              confirming={d.confirming}
              onConfirm={() => void d.confirmReview()}
              onDiscard={d.discardReview}
            />
          )}
          {!d.processing && !d.review && (
            <ContinuityPanel reminders={d.reminders} prep={d.prep} onTogglePrep={d.togglePrep} />
          )}
        </div>
      </div>

      <section aria-label="Document library" className="space-y-3">
        <h2 className="font-display text-[17px] font-semibold text-navy-800">
          Document library
        </h2>
        <LibraryFilters
          query={d.query}
          onQuery={d.setQuery}
          active={d.typeFilter}
          onChange={d.setTypeFilter}
        />
        {d.visible.length === 0 ? (
          <DocumentsEmptyState
            searching={searching}
            onClear={() => {
              d.setQuery("");
              d.setTypeFilter("all");
            }}
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {d.visible.map((doc) => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                active={d.previewDoc?.id === doc.id}
                onPreview={d.setPreviewId}
              />
            ))}
          </div>
        )}
      </section>

      <FlowNext from="/documents" />

      <SafetyBanner />

      {d.previewDoc && (
        <DocumentPreview doc={d.previewDoc} onClose={() => d.setPreviewId(null)} />
      )}
    </div>
  );
}
