import { Check } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/Card";
import { mockQuestions, seedCareEvents } from "@/lib/mock-data";
import { seedDocuments, DOC_TYPE_LABELS } from "@/lib/documents/types";
import { formatEventDate } from "@/lib/journey/memory";
import { cn } from "@/lib/utils";

/** Fine-grained pickers — choose exactly which items travel in the passport. */
export function SelectionPickers({
  questionIds,
  eventIds,
  documentIds,
  onQuestion,
  onEvent,
  onDocument,
}: {
  questionIds: string[];
  eventIds: string[];
  documentIds: string[];
  onQuestion: (id: string) => void;
  onEvent: (id: string) => void;
  onDocument: (id: string) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <PickerCard title="Questions" hint="Tick to include">
        {mockQuestions.map((q, i) => (
          <PickerRow
            key={q.id}
            on={questionIds.includes(q.id)}
            onToggle={() => onQuestion(q.id)}
            title={`Q${i + 1}. ${q.text}`}
          />
        ))}
      </PickerCard>
      <PickerCard title="Care events" hint="Completed history">
        {seedCareEvents
          .filter((e) => e.status === "completed")
          .map((e) => (
            <PickerRow
              key={e.id}
              on={eventIds.includes(e.id)}
              onToggle={() => onEvent(e.id)}
              title={e.title}
              sub={formatEventDate(e.date).full}
            />
          ))}
      </PickerCard>
      <PickerCard title="Documents" hint="Organized papers">
        {seedDocuments.map((d) => (
          <PickerRow
            key={d.id}
            on={documentIds.includes(d.id)}
            onToggle={() => onDocument(d.id)}
            title={d.name}
            sub={DOC_TYPE_LABELS[d.docType]}
          />
        ))}
      </PickerCard>
    </div>
  );
}

function PickerCard({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="!p-4">
      <div className="flex items-center justify-between">
        <CardTitle className="!text-[15px]">{title}</CardTitle>
        <span className="text-xs text-navy-600">{hint}</span>
      </div>
      <ul className="mt-2.5 space-y-1.5">{children}</ul>
    </Card>
  );
}

function PickerRow({
  on,
  onToggle,
  title,
  sub,
}: {
  on: boolean;
  onToggle: () => void;
  title: string;
  sub?: string;
}) {
  return (
    <li>
      <button
        onClick={onToggle}
        role="checkbox"
        aria-checked={on}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-xl border px-3 py-2 text-left transition",
          on ? "border-teal-soft-200 bg-teal-soft-50" : "border-navy-100/70 bg-white"
        )}
      >
        <span
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2",
            on ? "border-teal-soft-500 bg-teal-soft-500 text-white" : "border-navy-200 bg-white"
          )}
          aria-hidden
        >
          {on && <Check className="h-3.5 w-3.5" />}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[13px] font-medium text-navy-800">{title}</span>
          {sub && <span className="block text-xs text-navy-600">{sub}</span>}
        </span>
      </button>
    </li>
  );
}
