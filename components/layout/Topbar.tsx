"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, APP_META } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

export function Topbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-navy-100/70 bg-[#fffdfc]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="lg:hidden">
            <Logo />
          </div>
          <p className="hidden truncate text-sm text-navy-600 lg:block">
            {APP_META.tagline}
          </p>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-navy-600 shadow-soft sm:inline-flex">
              <Globe className="h-3.5 w-3.5" aria-hidden />
              EN · हिं · ES
            </span>
            <Link
              href="/voice"
              className="hidden rounded-full bg-navy-800 px-4 py-2 font-display text-[13px] font-medium text-white shadow-soft sm:inline-flex"
            >
              Ask Nurtura
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-navy-800 shadow-soft lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {open && (
          <nav
            className="grid gap-1 border-t border-navy-100/70 bg-white px-4 py-3 lg:hidden"
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
    </>
  );
}
