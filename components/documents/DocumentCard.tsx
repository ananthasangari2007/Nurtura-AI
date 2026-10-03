import { FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { DOC_TYPE_LABELS, type CareDocument, type DocStatus } from "@/lib/documents/types";
import { cn } from "@/lib/utils";

const STATUS_BADGE: Record<DocStatus, { tone: "navy" | "lavender" | "blush" | "teal"; label: string }> = {
  new: { tone: "navy", label: "New" },
  processing: { tone: "lavender", label: "Organizing…" },
  review: { tone: "blush", label: "Needs review" },
  organized: { tone: "teal", label: "Organized" },
};

/** Single document card: name · date added · type · status. */
export function DocumentCard({
  doc,
  active,
  onPreview,
}: {
  doc: CareDocument;
  active: boolean;
  onPreview: (id: string) => void;
}) {
  const status = STATUS_BADGE[doc.status];
  return (
    <button
      onClick={() => onPreview(doc.id)}
      aria-label={`Preview ${doc.name}`}
      className={cn(
        "group flex w-full items-start gap-3 rounded-2xl border bg-white p-4 text-left shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-lift",
        active ? "border-lavender-300 ring-4 ring-lavender-100" : "border-white"
      )}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-soft-100 text-teal-soft-700">
        {doc.fileKind === "pdf" ? (
          <FileText className="h-5 w-5" aria-hidden />
        ) : (
          <ImageIcon className="h-5 w-5" aria-hidden />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-display text-sm font-semibold text-navy-800">
          {doc.name}
        </span>
        <span className="mt-0.5 block text-xs text-navy-600">
          {DOC_TYPE_LABELS[doc.docType]} · Added{" "}
          {new Date(doc.dateAdded + "T00:00:00").toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
          })}
        </span>
        <span className="mt-1.5 block">
          <Badge tone={status.tone}>
            {doc.status === "processing" && (
              <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
            )}
            {status.label}
          </Badge>
        </span>
      </span>
    </button>
  );
}
