import { History } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/Card";
import type { CaregiverActivity, CaregiverActivityKind } from "@/lib/caregivers/types";

const KIND_DOT: Record<CaregiverActivityKind, string> = {
  added: "bg-teal-soft-500",
  removed: "bg-blush-400",
  permission: "bg-lavender-400",
  invited: "bg-sky-soft-500",
  accepted: "bg-teal-soft-500",
  reminder: "bg-blush-400",
};

/** Circle activity history — newest first. */
export function CaregiverActivityLog({ activity }: { activity: CaregiverActivity[] }) {
  return (
    <Card>
      <CardTitle className="flex items-center gap-2">
        <History className="h-4 w-4 text-navy-600" aria-hidden />
        Circle activity
      </CardTitle>
      {activity.length === 0 ? (
        <p className="mt-2 text-sm text-navy-600">No activity yet.</p>
      ) : (
        <ol className="mt-3 space-y-0">
          {activity.slice(0, 10).map((a, i, arr) => (
            <li key={a.id} className="relative flex gap-3 pb-4 last:pb-0">
              {i < arr.length - 1 && (
                <span aria-hidden className="absolute top-6 left-[9px] h-[calc(100%-1.25rem)] w-0.5 bg-navy-100" />
              )}
              <span aria-hidden className={`z-10 mt-1 h-5 w-5 shrink-0 rounded-full border-[3px] border-white shadow-soft ${KIND_DOT[a.kind]}`} />
              <div className="min-w-0">
                <p className="text-sm text-navy-800">
                  <span className="font-medium">{a.caregiverName}</span>
                  <span className="text-navy-600"> — {a.detail}</span>
                </p>
                <p className="text-xs text-navy-600/70">
                  {new Date(a.at).toLocaleString("en-US", {
                    day: "numeric",
                    month: "short",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
