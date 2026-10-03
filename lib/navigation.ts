import {
  LayoutDashboard,
  Route,
  FileText,
  FolderOpen,
  Mic,
  IdCard,
  Users,
  BellRing,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  phase: "live" | "soon";
};

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    description: "Today, next steps & journey at a glance",
    icon: LayoutDashboard,
    accent: "bg-blush-100 text-blush-600",
    phase: "live",
  },
  {
    href: "/care-journey",
    label: "Care Journey",
    description: "Questions, appointments & memory",
    icon: Route,
    accent: "bg-lavender-100 text-lavender-600",
    phase: "live",
  },
  {
    href: "/doctor-brief",
    label: "Doctor Visit Brief",
    description: "Patient-approved visit summary",
    icon: FileText,
    accent: "bg-sky-soft-100 text-sky-soft-600",
    phase: "live",
  },
  {
    href: "/documents",
    label: "Documents",
    description: "Care papers → clear next actions",
    icon: FolderOpen,
    accent: "bg-teal-soft-100 text-teal-soft-700",
    phase: "live",
  },
  {
    href: "/voice",
    label: "Voice Companion",
    description: "Multilingual voice & text help",
    icon: Mic,
    accent: "bg-blush-100 text-blush-600",
    phase: "live",
  },
  {
    href: "/handoff",
    label: "Care Handoff",
    description: "Patient-controlled passport",
    icon: IdCard,
    accent: "bg-lavender-100 text-lavender-600",
    phase: "live",
  },
  {
    href: "/caregivers",
    label: "Caregivers",
    description: "Trusted circle & sharing",
    icon: Users,
    accent: "bg-sky-soft-100 text-sky-soft-600",
    phase: "live",
  },
  {
    href: "/follow-ups",
    label: "Follow-ups",
    description: "Reminders & continuity",
    icon: BellRing,
    accent: "bg-teal-soft-100 text-teal-soft-700",
    phase: "live",
  },
  {
    href: "/settings",
    label: "Settings",
    description: "Language, consent & profile",
    icon: Settings,
    accent: "bg-navy-100 text-navy-700",
    phase: "live",
  },
];

export const APP_META = {
  name: "Nurtura AI",
  tagline: "From 'I need a doctor' to 'I know my next step.'",
  safetyNote:
    "Nurtura AI is a care companion — not a doctor. It never diagnoses, prescribes, or interprets medical reports.",
  supportedLanguages: ["English", "Hindi", "Hinglish", "Spanish", "French", "Arabic"],
} as const;
