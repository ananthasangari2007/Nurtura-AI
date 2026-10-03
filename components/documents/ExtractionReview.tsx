import {
  Briefcase,
  CalendarCheck,
  Check,
  CircleAlert,
  Luggage,
  Repeat,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { CareDocument, ExtractedCareActions } from "@/lib/documents/types";

/**
 * ExtractionReview — "Care actions found" + mandatory user confirmation.
 * Nothing is added to the journey until [Add to Care Journey] is pressed.
 */
export function ExtractionReview({
  doc,
  actions,
  confirming,
  onConfirm,
  onDiscard,
}: {
  doc: CareDocument;
  actions: ExtractedCareActions;
  confirming: boolean;
  onConfirm: () => void;
  onDiscard: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-[1.25rem] border border-teal-soft-100 bg-white shadow-soft">
      <div className="bg-navy-800 px-5 py-4 text-white sm:px-6">
        <p className="flex items-center gap-2 font-display text-[17px] font-semibold">
          <Check className="h-5 w-5 text-teal-soft-200" aria-hidden />
          Care actions found
        </p>
        <p className="mt-0.5 text-[13px] text-white/75">
          From “{doc.name}” · admin details only — nothing clinical was read.
        </p>
      </div>

      <div className="grid gap-2.5 p-5 sm:grid-cols-2 sm:p-6">
        <InfoTile
          icon={<CalendarCheck className="h-5 w-5" aria-hidden />}
          tone="bg-blush-100 text-blush-600"
          label="Upcoming appointment"
          value={actions.appointmentDate}
        />
        <InfoTile
          icon={<Repeat className="h-5 w-5" aria-hidden />}
          tone="bg-sky-soft-100 text-sky-soft-600"
          label="Follow-up"
          value={
            actions.followUpRequired
              ? `Required · ${actions.followUpDate}`
              : "None flagged"
          }
        />
        <InfoTile
          icon={<Briefcase className="h-5 w-5" aria-hidden />}
          tone="bg-lavender-100 text-lavender-600"
          label="Provider · Location"
          value={`${actions.providerName} · ${actions.location}`}
        />
        <InfoTile
          icon={<Luggage className="h-5 w-5" aria-hidden />}
          tone="bg-teal-soft-100 text-teal-soft-700"
          label="Bring"
          value={actions.bringItems.join(" · ") || "Nothing flagged"}
        />
        {actions.adminInstructions.length > 0 && (
          <div className="rounded-2xl bg-navy-50 p-3.5 sm:col-span-2">
            <p className="font-display text-[13px] font-semibold text-navy-800">
              Administrative instructions
            </p>
            <ul className="mt-1.5 space-y-1">
              {actions.adminInstructions.map((line) => (
                <li key={line} className="flex items-start gap-2 text-[13px] text-navy-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lavender-400" aria-hidden />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        )}
        {actions.questionsMentioned.length > 0 && (
          <div className="rounded-2xl bg-blush-50 p-3.5 sm:col-span-2">
            <p className="font-display text-[13px] font-semibold text-navy-800">
              Patient questions mentioned
            </p>
            <ul className="mt-1 space-y-1">
              {actions.questionsMentioned.map((line) => (
                <li key={line} className="text-[13px] text-navy-700">
                  “{line}”
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-navy-100/70 px-5 py-4 sm:px-6">
        <p className="flex items-start gap-2 rounded-2xl bg-navy-50 px-3.5 py-2.5 text-[13px] font-medium text-navy-700">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-blush-500" aria-hidden />
          Review before adding — nothing joins your care journey, reminders, or
          checklist until you confirm.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Button onClick={onConfirm} disabled={confirming} className="flex-1">
            <ShieldCheck className="h-4 w-4" aria-hidden />
            {confirming ? "Adding…" : "Add to Care Journey"}
          </Button>
          <Button variant="soft" onClick={onDiscard} disabled={confirming}>
            <Trash2 className="h-4 w-4" aria-hidden /> Discard
          </Button>
        </div>
      </div>
    </div>
  );
}

function InfoTile({
  icon,
  tone,
  label,
  value,
}: {
  icon: React.ReactNode;
  tone: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-navy-100/70 p-3.5">
      <p className="flex items-center gap-2 text-xs font-medium tracking-wide text-navy-600 uppercase">
        <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${tone}`}>
          {icon}
        </span>
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-navy-800">{value}</p>
    </div>
  );
}
