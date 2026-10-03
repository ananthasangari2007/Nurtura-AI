import { BellRing, Check, MailPlus, Trash2, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  PERMISSION_META,
  permissionSummary,
  type Caregiver,
  type CaregiverPermissions,
} from "@/lib/caregivers/types";
import { cn } from "@/lib/utils";

/** One trusted person: role, invite state, patient-controlled permissions. */
export function CaregiverCard({
  caregiver,
  reminderSent,
  onTogglePermission,
  onRemove,
  onAccept,
  onSendReminder,
}: {
  caregiver: Caregiver;
  reminderSent: boolean;
  onTogglePermission: (key: keyof CaregiverPermissions) => void;
  onRemove: () => void;
  onAccept: () => void;
  onSendReminder: () => void;
}) {
  const invited = caregiver.status === "invited";
  return (
    <Card className={cn(invited && "border-dashed !border-lavender-200 bg-lavender-50/50")}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lavender-100 font-display text-base font-semibold text-lavender-600">
            {caregiver.name.charAt(0)}
          </span>
          <div>
            <p className="font-display text-[15px] font-semibold text-navy-800">
              {caregiver.name}
            </p>
            <p className="text-xs text-navy-600">{caregiver.role}</p>
          </div>
        </div>
        <Badge tone={invited ? "lavender" : "teal"}>
          {invited ? "Invited" : "Active"}
        </Badge>
      </div>

      {invited ? (
        <div className="mt-4 rounded-2xl bg-white p-3.5 text-[13px] text-navy-700 shadow-soft">
          <p className="flex items-center gap-1.5 font-medium">
            <MailPlus className="h-4 w-4 text-lavender-500" aria-hidden />
            Invite pending (simulation)
          </p>
          <p className="mt-1 text-navy-600">
            They join with exactly the permissions below — changeable anytime.
          </p>
          <div className="mt-2.5 flex gap-2">
            <Button size="sm" onClick={onAccept}>
              <UserCheck className="h-4 w-4" aria-hidden /> Simulate accept
            </Button>
            <Button size="sm" variant="soft" onClick={onRemove}>
              <Trash2 className="h-4 w-4" aria-hidden /> Withdraw
            </Button>
          </div>
        </div>
      ) : (
        <>
          <p className="mt-3 text-xs font-medium text-navy-600">
            Can see: {permissionSummary(caregiver.permissions)}
          </p>
          <ul className="mt-2 space-y-1.5">
            {PERMISSION_META.map((m) => {
              const on = caregiver.permissions[m.id];
              return (
                <li key={m.id}>
                  <button
                    onClick={() => onTogglePermission(m.id)}
                    role="checkbox"
                    aria-checked={on}
                    aria-label={`${on ? "Revoke" : "Grant"} ${m.label} for ${caregiver.name}`}
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
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-medium text-navy-800">{m.label}</span>
                      <span className="block text-xs text-navy-600">{m.detail}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="soft" onClick={onSendReminder} className="flex-1">
              <BellRing className="h-4 w-4" aria-hidden />
              {reminderSent ? "Reminder sent ✓" : "Send test reminder"}
            </Button>
            <Button size="sm" variant="soft" onClick={onRemove} aria-label={`Remove ${caregiver.name}`}>
              <Trash2 className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}
