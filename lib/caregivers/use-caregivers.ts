"use client";

import { useCallback, useState } from "react";
import {
  defaultPermissions,
  loadCaregiversLocal,
  saveCaregiversLocal,
  seedCaregiverActivity,
  seedCaregivers,
  type Caregiver,
  type CaregiverActivity,
  type CaregiverPermissions,
  type CaregiverRole,
} from "@/lib/caregivers/types";

/**
 * useCaregivers — patient-controlled circle state.
 * Add · remove · per-person permissions · invite simulation · activity log.
 * Persisted to localStorage (mock); Supabase tables later, same shapes.
 */
export function useCaregivers() {
  const [initial] = useState(() =>
    typeof window === "undefined" ? null : loadCaregiversLocal()
  );
  const [caregivers, setCaregivers] = useState<Caregiver[]>(
    () => initial?.caregivers ?? seedCaregivers
  );
  const [activity, setActivity] = useState<CaregiverActivity[]>(
    () => initial?.activity ?? seedCaregiverActivity
  );

  const persist = useCallback((c: Caregiver[], a: CaregiverActivity[]) => {
    saveCaregiversLocal(c, a);
  }, []);

  const log = useCallback(
    (entry: Omit<CaregiverActivity, "id" | "at">, c: Caregiver[], a: CaregiverActivity[]) => {
      const full: CaregiverActivity = {
        ...entry,
        id: `cga-${Date.now()}`,
        at: new Date().toISOString(),
      };
      const next = [full, ...a];
      setActivity(next);
      persist(c, next);
    },
    [persist]
  );

  const addCaregiver = useCallback(
    (name: string, role: CaregiverRole) => {
      const clean = name.trim().slice(0, 40);
      if (!clean) return;
      const newcomer: Caregiver = {
        id: `cg-${Date.now()}`,
        name: clean,
        role,
        status: "invited",
        permissions: defaultPermissions(role),
        invitedAt: new Date().toISOString(),
      };
      const next = [newcomer, ...caregivers];
      setCaregivers(next);
      log(
        { caregiverId: newcomer.id, caregiverName: newcomer.name, kind: "invited", detail: `Invited as ${role} (simulation).` },
        next,
        activity
      );
    },
    [caregivers, activity, log]
  );

  const removeCaregiver = useCallback(
    (id: string) => {
      const target = caregivers.find((c) => c.id === id);
      if (!target) return;
      const next = caregivers.filter((c) => c.id !== id);
      setCaregivers(next);
      log(
        { caregiverId: id, caregiverName: target.name, kind: "removed", detail: `Removed from circle. Access revoked instantly.` },
        next,
        activity
      );
    },
    [caregivers, activity, log]
  );

  const togglePermission = useCallback(
    (id: string, key: keyof CaregiverPermissions) => {
      const next = caregivers.map((c) =>
        c.id === id ? { ...c, permissions: { ...c.permissions, [key]: !c.permissions[key] } } : c
      );
      setCaregivers(next);
      const target = next.find((c) => c.id === id);
      if (target) {
        const label = key.replace(/([A-Z])/g, " $1").toLowerCase();
        log(
          {
            caregiverId: id,
            caregiverName: target.name,
            kind: "permission",
            detail: `${target.permissions[key] ? "Granted" : "Revoked"}: ${label}.`,
          },
          next,
          activity
        );
      }
    },
    [caregivers, activity, log]
  );

  const acceptInvite = useCallback(
    (id: string) => {
      const next = caregivers.map((c) => (c.id === id ? { ...c, status: "active" as const } : c));
      setCaregivers(next);
      const target = next.find((c) => c.id === id);
      if (target) {
        log(
          { caregiverId: id, caregiverName: target.name, kind: "accepted", detail: "Accepted the invite (simulation)." },
          next,
          activity
        );
      }
    },
    [caregivers, activity, log]
  );

  const sendReminder = useCallback(
    (id: string) => {
      const target = caregivers.find((c) => c.id === id);
      if (!target) return;
      log(
        { caregiverId: id, caregiverName: target.name, kind: "reminder", detail: "Visit reminder shared (simulation: SMS + App)." },
        caregivers,
        activity
      );
    },
    [caregivers, activity, log]
  );

  return {
    caregivers,
    activity,
    addCaregiver,
    removeCaregiver,
    togglePermission,
    acceptInvite,
    sendReminder,
  };
}

export type CaregiversState = ReturnType<typeof useCaregivers>;
