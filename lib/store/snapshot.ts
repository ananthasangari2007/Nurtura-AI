/**
 * Shared application data layer — the connective tissue of Nurtura AI.
 *
 * CARE FLOW (every module reads the same demo truth):
 *   Dashboard → Care Journey → I Need a Doctor → Doctor Visit Brief →
 *   Documents → Voice AI → Care Handoff Passport → Caregiver Circle → Follow-ups
 *
 * getDemoSnapshot() aggregates every seed collection in one call so
 * screens, APIs, and the health check all report consistent counts.
 * Production later: the same shape is served from Supabase (see
 * supabase/schema.sql); screens keep their call sites.
 */

import {
  demoAppointment,
  demoPatient,
  mockActions,
  mockAppointments,
  mockFollowUps,
  mockQuestions,
  seedCareEvents,
} from "@/lib/mock-data";
import { seedDocuments } from "@/lib/documents/types";
import { seedFollowUps } from "@/lib/continuity/types";
import { seedCaregivers } from "@/lib/caregivers/types";

export type FlowNode = {
  href: string;
  label: string;
  description: string;
  nextHref: string;
  nextLabel: string;
};

export const CARE_FLOW: FlowNode[] = [
  { href: "/dashboard", label: "Dashboard", description: "Today, next steps & journey at a glance", nextHref: "/care-journey", nextLabel: "Care Journey" },
  { href: "/care-journey", label: "Care Journey", description: "Questions, appointments & memory", nextHref: "/doctor-brief", nextLabel: "I Need a Doctor" },
  { href: "/doctor-brief", label: "I Need a Doctor", description: "Intake → patient-approved visit brief", nextHref: "/documents", nextLabel: "Documents" },
  { href: "/documents", label: "Documents", description: "Care papers → clear next actions", nextHref: "/voice", nextLabel: "Voice AI" },
  { href: "/voice", label: "Voice AI", description: "Multilingual voice & text help", nextHref: "/handoff", nextLabel: "Care Handoff Passport" },
  { href: "/handoff", label: "Care Handoff Passport", description: "Patient-controlled sharing", nextHref: "/caregivers", nextLabel: "Caregiver Circle" },
  { href: "/caregivers", label: "Caregiver Circle", description: "Trusted circle & sharing", nextHref: "/follow-ups", nextLabel: "Follow-ups" },
  { href: "/follow-ups", label: "Follow-ups", description: "Reminders & continuity", nextHref: "/dashboard", nextLabel: "Dashboard" },
];

export function nextFlowNode(href: string): FlowNode | null {
  return CARE_FLOW.find((n) => n.href === href) ?? null;
}

export type DemoSnapshot = {
  patient: typeof demoPatient;
  counts: {
    questions: number;
    appointments: number;
    actions: number;
    followUps: number;
    careEvents: number;
    documents: number;
    continuityItems: number;
    caregivers: number;
  };
  nextAppointment: typeof demoAppointment;
};

export function getDemoSnapshot(): DemoSnapshot {
  return {
    patient: demoPatient,
    counts: {
      questions: mockQuestions.length,
      appointments: mockAppointments.length,
      actions: mockActions.length,
      followUps: mockFollowUps.length,
      careEvents: seedCareEvents.length,
      documents: seedDocuments.length,
      continuityItems: seedFollowUps.length,
      caregivers: seedCaregivers.length,
    },
    nextAppointment: demoAppointment,
  };
}
