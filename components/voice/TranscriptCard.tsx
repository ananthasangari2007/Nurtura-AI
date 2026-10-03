"use client";

import { Eraser, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";

/** Transcript display — live interim line + editable final transcript + send. */
export function TranscriptCard({
  transcript,
  interim,
  listening,
  sending,
  onEdit,
  onSend,
  onClear,
}: {
  transcript: string;
  interim: string;
  listening: boolean;
  sending: boolean;
  onEdit: (text: string) => void;
  onSend: () => void;
  onClear: () => void;
}) {
  return (
    <div className="rounded-[1.25rem] border border-white bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-[15px] font-semibold text-navy-800">
          Your words
        </h2>
        <span className="text-xs font-medium text-navy-600">
          {listening ? "Listening…" : "Editable — fix anything before sending"}
        </span>
      </div>

      {interim && (
        <p aria-live="polite" className="mt-2 rounded-2xl bg-lavender-50 px-3.5 py-2.5 text-sm text-navy-700 italic">
          {interim}…
        </p>
      )}

      <Textarea
        value={transcript}
        onChange={(e) => onEdit(e.target.value)}
        placeholder="Tap the mic and speak — or type here in English, தமிழ், or हिन्दी…"
        aria-label="Editable transcript"
        className="mt-2 min-h-[96px]"
        maxLength={1000}
      />

      <div className="mt-3 flex items-center gap-2">
        <Button onClick={onSend} disabled={sending || !transcript.trim()} className="flex-1">
          <Send className="h-4 w-4" aria-hidden />
          {sending ? "Asking Nurtura…" : "Send to Nurtura"}
        </Button>
        <Button variant="soft" size="icon" onClick={onClear} aria-label="Clear transcript">
          <Eraser className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </div>
  );
}
