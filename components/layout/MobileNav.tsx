"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Route, FileText, Mic, BellRing } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/care-journey", label: "Journey", icon: Route },
  { href: "/voice", label: "Ask", icon: Mic },
  { href: "/doctor-brief", label: "Brief", icon: FileText },
  { href: "/follow-ups", label: "Reminders", icon: BellRing },
];

export function MobileNav() {
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
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-2xl py-2 text-[11px] font-display font-medium",
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
