"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Route, Mic, FileText, BellRing } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * MobileBottomNav — mobile-first bottom tab bar for the healthcare app.
 * Central "Ask" action is visually elevated without looking like a chatbot launcher.
 */
const TABS = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/care-journey", label: "Journey", icon: Route },
  { href: "/voice", label: "Ask", icon: Mic, elevated: true },
  { href: "/doctor-brief", label: "Brief", icon: FileText },
  { href: "/follow-ups", label: "Reminders", icon: BellRing },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-3 bottom-3 z-30 rounded-3xl border border-white bg-white/95 px-2 py-2 shadow-lift backdrop-blur lg:hidden"
      aria-label="Quick navigation"
    >
      <div className="grid grid-cols-5 gap-1">
        {TABS.map((tab) => {
          const active =
            pathname === tab.href || pathname?.startsWith(tab.href + "/");
          const Icon = tab.icon;
          if (tab.elevated) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-label="Ask Nurtura"
                className="flex flex-col items-center gap-1 rounded-2xl py-1 text-[11px] font-display font-medium text-navy-600"
              >
                <span
                  className={cn(
                    "-mt-5 flex h-12 w-12 items-center justify-center rounded-full border-4 border-[#fffdfc] text-white shadow-lift transition",
                    active ? "bg-blush-600" : "bg-navy-800"
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className={active ? "text-navy-800" : undefined}>
                  {tab.label}
                </span>
              </Link>
            );
          }
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-2xl py-2 text-[11px] font-display font-medium transition",
                active ? "bg-navy-800 text-white" : "text-navy-600"
              )}
            >
              <Icon className="h-[18px] w-[18px]" aria-hidden />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
