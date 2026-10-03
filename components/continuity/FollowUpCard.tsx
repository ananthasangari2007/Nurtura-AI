import Link from "next/link";
import {
  BellRing,
  CalendarCheck,
  Check,
  Circle,
  CircleCheck,
  Clock3,
  History,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { seedCareEvents } from "@/lib/mock-data";
import { formatEventDate } from "@/lib/journey/memory";
import {
  bucketOf,
  dueLabel,
  type FollowUpItem,
} from "@/lib/continuity/types";
import { cn } from "@/lib/utils";

const BUCKET_BADGE: Record<string, { tone: "blush" | "lavender" | "teal" | "navy"; label: string }> = {
  upcoming: { tone: "navy", label: "Upcoming" },
  "due-soon": { tone: "blush", label: "Due soon" },
  completed: { tone: "teal", label: "Completed" },
};

/**
 * FollowUpCard — date · title · journey link · prep checklist · status ·
 * complete / snooze / reschedule / reminder simulation.
 */
export function FollowUpCard({
  item,
  reminderSent,
  onComplete,
  onReopen,
  onSnooze,
  onReschedule,
  onTogglePrep,
  onSendReminder,
}: {
  item: FollowUpItem;
  reminderSent: boolean;
  onComplete: () => void;
  onReopen: () => void;
  onSnooze: () => void;
  onReschedule: (date: string) => void;
  onTogglePrep: (prepId: string) => void;
  onSendReminder: () => void;
}) {
  const [rescheduling, setRescheduling] = useState(false);
  const [date, setDate] = useState(item.date);
  const bucket = BUCKET_BADGE[bucketOf(item)];
  const event = seedCareEvents.find((e) => e.id === item.eventId);
  const done = item.prep.filter((p) => p.done).length;

  return (
    <Card className={cn(item.completed && "opacity-90")}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-2xl bg-blush-50 font-display leading-none">
            <span className="text-[15px] font-semibold text-navy-800">
              {new Date(item.date + "T00:00:00").getDate()}
            </span>
            <span className="text-[10px] font-medium text-navy-600">
              {new Date(item.date + "T00:00:00").toLocaleDateString("en-US", { month: "short" })}
            </span>
          </span>
          <div className="min-w-0">
            <p className={cn("truncate text-[15px] font-medium", item.completed ? "text-navy-600 line-through" : "text-navy-800")}>
              {item.title}
            </p>
            <p className="flex items-center gap-1 text-xs text-navy-600">
              <Clock3 className="h-3 w-3" aria-hidden />
              {dueLabel(item.date)} · {item.channel}
            </p>
          </div>
        </div>
        <Badge tone={bucket.tone}>{bucket.label}</Badge>
      </div>

      {event && (
        <Link
          href="/care-journey"
          className="mt-3 flex items-center gap-2 rounded-2xl bg-lavender-50 px-3.5 py-2 text-[13px] text-navy-700 transition hover:bg-lavender-100"
        >
          <History className="h-4 w-4 shrink-0 text-lavender-500" aria-hidden />
          <span className="truncate">
            Linked journey event: <span className="font-medium">{event.title}</span> · {formatEventDate(event.date).full}
          </span>
        </Link>
      )}

      <div className="mt-3 rounded-2xl bg-navy-50 p-3">
        <p className="flex items-center justify-between px-1 font-display text-xs font-semibold text-navy-700">
          <span className="flex items-center gap-1.5">
            <CalendarCheck className="h-3.5 w-3.5" aria-hidden />
            Preparation
          </span>
          <span className="text-navy-600">{done}/{item.prep.length}</span>
        </p>
        <ul className="mt-1.5 space-y-1">
          {item.prep.map((p) => (
            <li key={p.id}>
              <button
                onClick={() => onTogglePrep(p.id)}
                aria-pressed={p.done}
                className="flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left text-[13px] transition hover:bg-white"
              >
                {p.done ? (
                  <CircleCheck className="h-4 w-4 shrink-0 text-teal-soft-600" aria-hidden />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-navy-200" aria-hidden />
                )}
                <span className={p.done ? "text-navy-600/60 line-through" : "text-navy-800"}>
                  {p.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {rescheduling ? (
        <form
          className="mt-3 flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            onReschedule(date);
            setRescheduling(false);
          }}
        >
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-label="New date"
            className="h-10 min-w-0 flex-1 rounded-full border border-navy-100 bg-white px-3.5 text-[13px] text-navy-800 outline-none focus:border-lavender-300"
          />
          <Button size="sm" type="submit">Save</Button>
          <Button size="sm" variant="soft" type="button" onClick={() => setRescheduling(false)}>
            Cancel
          </Button>
        </form>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {item.completed ? (
            <Button size="sm" variant="soft" onClick={onReopen}>
              <RotateCcw className="h-4 w-4" aria-hidden /> Reopen
            </Button>
          ) : (
            <Button size="sm" onClick={onComplete}>
              <Check className="h-4 w-4" aria-hidden /> Mark complete
            </Button>
          )}
          {!item.completed && (
            <>
              <Button size="sm" variant="soft" onClick={onSnooze}>
                <Clock3 className="h-4 w-4" aria-hidden /> Snooze +3d
              </Button>
              <Button size="sm" variant="soft" onClick={() => setRescheduling(true)}>
                Reschedule
              </Button>
            </>
          )}
          <Button size="sm" variant="soft" onClick={onSendReminder} className="ml-auto">
            <BellRing className="h-4 w-4" aria-hidden />
            {reminderSent ? "Sent ✓" : "Remind me"}
          </Button>
        </div>
      )}
    </Card>
  );
}
