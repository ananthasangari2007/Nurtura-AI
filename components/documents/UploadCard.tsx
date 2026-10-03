"use client";

import { useRef, useState } from "react";
import { FileUp, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Input";
import { DOC_TYPE_OPTIONS, type DocType } from "@/lib/documents/types";
import { cn } from "@/lib/utils";

/** Upload UI — prototype supports PDF + image, with drag & drop. */
export function UploadCard({
  onUpload,
  disabled,
  error,
}: {
  onUpload: (file: File, docType: DocType) => void;
  disabled: boolean;
  error: string | null;
}) {
  const [docType, setDocType] = useState<DocType>("appointment-slip");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0 || disabled) return;
    void onUpload(files[0], docType);
  }

  return (
    <div className="rounded-[1.25rem] border border-white bg-white p-5 shadow-soft sm:p-6">
      <h2 className="font-display text-[17px] font-semibold text-navy-800">
        Upload a care document
      </h2>
      <p className="mt-1 text-sm text-navy-600">
        Slip, card, or form — PDF or photo. Only admin details are organized;
        medical content is never read.
      </p>

      <div className="mt-4">
        <Label htmlFor="upload-doctype">What kind of document is this?</Label>
        <select
          id="upload-doctype"
          value={docType}
          onChange={(e) => setDocType(e.target.value as DocType)}
          disabled={disabled}
          className="h-11 w-full rounded-2xl border border-navy-100 bg-white px-3 text-sm text-navy-800 shadow-soft outline-none focus:border-lavender-300 disabled:opacity-50"
        >
          {DOC_TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "mt-3 flex w-full flex-col items-center rounded-3xl border-2 border-dashed px-6 py-8 text-center transition",
          dragging
            ? "border-lavender-400 bg-lavender-50"
            : "border-navy-100 bg-navy-50/50 hover:border-lavender-300 hover:bg-lavender-50/60",
          disabled && "cursor-wait opacity-60"
        )}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-soft">
          <FileUp className="h-6 w-6 text-lavender-500" aria-hidden />
        </span>
        <span className="mt-3 font-display text-sm font-semibold text-navy-800">
          {disabled ? "Organizing your document…" : "Drop a PDF or photo here"}
        </span>
        <span className="mt-1 inline-flex items-center gap-1.5 text-[13px] text-navy-600">
          <ImagePlus className="h-4 w-4" aria-hidden />
          or browse files · PDF / JPG / PNG · up to 10 MB
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,image/*"
        className="hidden"
        aria-label="Choose a document file"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      {error && (
        <p role="alert" className="mt-2 text-[13px] font-medium text-blush-600">
          {error}
        </p>
      )}
      <div className="mt-3 flex justify-end">
        <Button size="sm" variant="soft" disabled={disabled} onClick={() => inputRef.current?.click()}>
          <FileUp className="h-4 w-4" aria-hidden /> Choose file
        </Button>
      </div>
    </div>
  );
}
