"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, Globe, Menu, MonitorPlay, X } from "lucide-react";
import { NAV_ITEMS, APP_META } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { DemoGuideModal } from "@/components/demo/DemoGuideModal";
import { demoPatient } from "@/lib/mock-data";

/**
 * AppHeader — premium top bar for the patient dashboard.
 * Desktop: tagline + language + reminders + avatar.
 * Mobile: logo + avatar + expandable navigation.
 */
export function AppHeader() {
  const [open, setOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-navy-100/70 bg-[#fffdfc]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="lg:hidden">
          <Logo />
        </div>
        <p className="hidden truncate text-sm text-navy-600 lg:block">
          {APP_META.tagline}
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDemoOpen(true)}
            aria-label="Open demo mode guide"
            title="Demo Mode — guided 3-minute path (fictional patient Ananya)"
            className="inline-flex items-center gap-1.5 rounded-full bg-blush-100 px-2.5 py-1.5 font-display text-xs font-semibold text-blush-600 shadow-soft transition hover:bg-blush-200 sm:px-3"
          >
            <MonitorPlay className="h-3.5 w-3.5" aria-hidden />
            <span className="hidden sm:inline">Demo Mode</span>
            <span className="sm:hidden">Demo</span>
          </button>
          <span className="hidden items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-navy-600 shadow-soft sm:inline-flex">
            <Globe className="h-3.5 w-3.5" aria-hidden />
            EN · தமிழ் · हिं
          </span>
          <Link
            href="/follow-ups"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-navy-700 shadow-soft transition hover:shadow-lift"
            aria-label="Reminders"
          >
            <Bell className="h-[18px] w-[18px]" aria-hidden />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blush-500 ring-2 ring-white" />
          </Link>
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full bg-lavender-200 font-display text-sm font-semibold text-lavender-600"
            aria-label={`${demoPatient.name}'s profile`}
          >
            {demoPatient.avatarFallback}
          </span>
          <button
            onClick={() => setOpen(!open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-navy-800 shadow-soft lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <DemoGuideModal open={demoOpen} onClose={() => setDemoOpen(false)} />

      {open && (
        <nav
          className="grid max-h-[60vh] gap-1 overflow-y-auto border-t border-navy-100/70 bg-white px-4 py-3 lg:hidden"
          aria-label="Mobile"
        >
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm",
                  active
                    ? "bg-navy-800 text-white"
                    : "text-navy-600 hover:bg-navy-50"
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-xl",
                    active ? "bg-white/15" : item.accent
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="font-display font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
