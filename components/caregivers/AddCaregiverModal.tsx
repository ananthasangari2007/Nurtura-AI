"use client";

import { useState } from "react";
import { UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { CAREGIVER_ROLES, type CaregiverRole } from "@/lib/caregivers/types";
import { cn } from "@/lib/utils";

/** Add a trusted caregiver — name + demo role (invite simulated). */
export function AddCaregiverModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (name: string, role: CaregiverRole) => void;
}) {
  const [name, setName] = useState("");
  const [role, setRole] = useState<CaregiverRole>("Family member");
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please add their first name.");
      return;
    }
    onAdd(name, role);
    setName("");
    setError(null);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-navy-900/40 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Add caregiver"
      onClick={onClose}
    >
      <div
        className="animate-slide-up w-full max-w-md rounded-3xl bg-white p-5 shadow-lift sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold text-navy-800">
              Add a trusted caregiver
            </h2>
            <p className="mt-0.5 text-[13px] text-navy-600">
              They receive an invite and see only what you tick.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-700 transition hover:bg-navy-100"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <form onSubmit={submit} className="mt-4 space-y-3.5">
          <div>
            <Label htmlFor="cg-name">First name</Label>
            <Input
              id="cg-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya"
              maxLength={40}
            />
          </div>
          <div>
            <Label>Role</Label>
            <div className="grid grid-cols-3 gap-1 rounded-2xl bg-navy-50 p-1">
              {CAREGIVER_ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  aria-pressed={role === r}
                  className={cn(
                    "rounded-xl px-1 py-2 font-display text-xs font-medium transition",
                    role === r ? "bg-navy-800 text-white shadow-soft" : "text-navy-600 hover:text-navy-800"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-navy-600">
              {role === "Partner" && "Starts with reminders + appointment time."}
              {role === "Parent" && "Starts with reminders only."}
              {role === "Family member" && "Starts with appointment time only."}
            </p>
          </div>
          {error && (
            <p role="alert" className="text-[13px] font-medium text-blush-600">
              {error}
            </p>
          )}
          <div className="flex gap-2.5">
            <Button type="submit" className="flex-1">
              <UserPlus className="h-4 w-4" aria-hidden /> Send invite
            </Button>
            <Button type="button" variant="soft" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
