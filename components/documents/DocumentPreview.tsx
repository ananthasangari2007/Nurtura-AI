"use client";

import Link from "next/link";
import { FileText, Image as ImageIcon, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { DOC_TYPE_LABELS, type CareDocument } from "@/lib/documents/types";

/** Document preview — modal with file render + admin metadata. */
export function DocumentPreview({
  doc,
  onClose,
}: {
  doc: CareDocument;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-navy-900/40 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={`Preview ${doc.name}`}
      onClick={onClose}
    >
      <div
        className="animate-slide-up max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-5 shadow-lift sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold text-navy-800">
              {doc.name}
            </h2>
            <p className="mt-0.5 text-[13px] text-navy-600">
              {DOC_TYPE_LABELS[doc.docType]} · Added{" "}
              {new Date(doc.dateAdded + "T00:00:00").toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close preview"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-700 transition hover:bg-navy-100"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="mt-4 flex h-56 items-center justify-center overflow-hidden rounded-2xl bg-navy-50">
          {doc.previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={doc.previewUrl}
              alt={`Uploaded preview of ${doc.name}`}
              className="h-full w-full object-cover"
            />
          ) : doc.fileKind === "pdf" ? (
            <span className="flex flex-col items-center gap-2 text-navy-600">
              <FileText className="h-10 w-10 text-lavender-500" aria-hidden />
              <span className="text-xs font-medium">PDF · stored on your device for this demo</span>
            </span>
          ) : (
            <span className="flex flex-col items-center gap-2 text-navy-600">
              <ImageIcon className="h-10 w-10 text-lavender-500" aria-hidden />
              <span className="text-xs font-medium">Demo library item · no file attached</span>
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge tone={doc.status === "organized" ? "teal" : "navy"}>
            {doc.status === "organized" ? "Organized into care actions" : `Status: ${doc.status}`}
          </Badge>
          {doc.relatedEventId && (
            <Link
              href="/care-journey"
              className="font-display text-[13px] font-medium text-lavender-600"
            >
              View in Care Journey →
            </Link>
          )}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-navy-600/80">
          Previews show the file as-is. Nurtura only organizes admin details
          (dates, places, packing lists) — it never reads medical content.
        </p>
      </div>
    </div>
  );
}
