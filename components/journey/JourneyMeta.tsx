import {
  BellRing,
  CalendarCheck,
  ClipboardList,
  FileText,
  MessageCircle,
  RefreshCw,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { CareEventType } from "@/lib/mock-data";

/** Shared visual language for journey event types. */
export const EVENT_META: Record<
  CareEventType,
  { label: string; icon: LucideIcon; tone: string; dot: string }
> = {
  consultation: {
    label: "Consultation",
    icon: Stethoscope,
    tone: "bg-blush-100 text-blush-600",
    dot: "bg-blush-400",
  },
  appointment: {
    label: "Appointment",
    icon: CalendarCheck,
    tone: "bg-lavender-100 text-lavender-600",
    dot: "bg-lavender-400",
  },
  document: {
    label: "Document",
    icon: FileText,
    tone: "bg-teal-soft-100 text-teal-soft-700",
    dot: "bg-teal-soft-500",
  },
  "follow-up": {
    label: "Follow-up",
    icon: RefreshCw,
    tone: "bg-sky-soft-100 text-sky-soft-600",
    dot: "bg-sky-soft-500",
  },
  question: {
    label: "Question",
    icon: MessageCircle,
    tone: "bg-blush-100 text-blush-600",
    dot: "bg-blush-400",
  },
  reminder: {
    label: "Reminder",
    icon: BellRing,
    tone: "bg-navy-100 text-navy-700",
    dot: "bg-navy-200",
  },
  care_instruction: {
    label: "Care note",
    icon: ClipboardList,
    tone: "bg-lavender-100 text-lavender-600",
    dot: "bg-lavender-400",
  },
};

export const EVENT_TYPE_OPTIONS: { value: CareEventType; label: string }[] = (
  Object.keys(EVENT_META) as CareEventType[]
).map((value) => ({ value, label: EVENT_META[value].label }));

export function EventTypeBadge({ type }: { type: CareEventType }) {
  const meta = EVENT_META[type];
  const Icon = meta.icon;
  return (
    <Badge tone="navy" className={`${meta.tone} !border-transparent`}>
      <Icon className="h-3 w-3" aria-hidden />
      {meta.label}
    </Badge>
  );
}
