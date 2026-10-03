"use client";

import { useState } from "react";
import { ShieldCheck, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SafetyBanner } from "@/components/ui/SafetyBanner";
import { FlowNext } from "@/components/ui/FlowNext";
import { SectionHeading } from "@/components/ui/Section";
import { useCaregivers } from "@/lib/caregivers/use-caregivers";
import { CaregiverCard } from "./CaregiverCard";
import { AddCaregiverModal } from "./AddCaregiverModal";
import { CaregiverActivityLog } from "./CaregiverActivityLog";

/** CaregiversScreen — patient-controlled trusted circle. */
export function CaregiversScreen() {
  const c = useCaregivers();
  const [modalOpen, setModalOpen] = useState(false);
  const [sentId, setSentId] = useState<string | null>(null);

  function handleSend(id: string) {
    c.sendReminder(id);
    setSentId(id);
    setTimeout(() => setSentId((cur) => (cur === id ? null : cur)), 2500);
  }

  return (
    <div className="space-y-5">
      <SectionHeading
        eyebrow="Caregiver Circle"
        title="Your trusted circle, your rules."
        description="Add family or helpers and tick exactly what each person may see. You can change or revoke access anytime."
        action={
          <Button onClick={() => setModalOpen(true)}>
            <UserPlus className="h-4 w-4" aria-hidden /> Add caregiver
          </Button>
        }
      />

      <div className="animate-fade-up flex items-start gap-3 rounded-2xl border border-teal-soft-100 bg-teal-soft-50 p-4 text-sm text-teal-soft-700">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
        <p className="leading-relaxed">
          <span className="font-display font-semibold">The patient controls all sharing. </span>
          Caregivers only ever see logistics you tick — times, reminders,
          papers, questions. Never clinical content.
        </p>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="animate-fade-up grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2" style={{ animationDelay: "80ms" }}>
          {c.caregivers.map((cg) => (
            <CaregiverCard
              key={cg.id}
              caregiver={cg}
              reminderSent={sentId === cg.id}
              onTogglePermission={(key) => c.togglePermission(cg.id, key)}
              onRemove={() => c.removeCaregiver(cg.id)}
              onAccept={() => c.acceptInvite(cg.id)}
              onSendReminder={() => handleSend(cg.id)}
            />
          ))}
        </div>
        <div className="animate-fade-up" style={{ animationDelay: "140ms" }}>
          <CaregiverActivityLog activity={c.activity} />
        </div>
      </div>

      <FlowNext from="/caregivers" />

      <SafetyBanner />

      <AddCaregiverModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={c.addCaregiver}
      />
    </div>
  );
}
