"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-[280px] shrink-0 flex-col border-r border-navy-100/70 bg-white/80 backdrop-blur lg:flex">
      <div className="px-5 pt-6 pb-4">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4" aria-label="Primary">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname?.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-3 py-2.5 transition",
                active
                  ? "bg-navy-800 text-white shadow-soft"
                  : "text-navy-600 hover:bg-navy-50 hover:text-navy-800"
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl transition",
                  active ? "bg-white/15 text-white" : item.accent
                )}
              >
                <Icon className="h-[18px] w-[18px]" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-display text-sm font-medium">
                  {item.label}
                </span>
                <span
                  className={cn(
                    "block truncate text-[11px]",
                    active ? "text-white/70" : "text-navy-600/70"
                  )}
                >
                  {item.description}
                </span>
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4">
        <div className="rounded-2xl bg-lavender-50 p-4 text-[13px] leading-relaxed text-navy-600">
          <p className="font-display font-semibold text-navy-800">Safety first</p>
          <p className="mt-1">
            Assistive companion only. Never a diagnosis or prescription.
          </p>
        </div>
      </div>
    </aside>
  );
}
