import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

/**
 * QuickActionCard — single shortcut tile for the dashboard grid.
 */
export function QuickActionCard({
  href,
  icon: Icon,
  title,
  subtitle,
  tone,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  tone: string;
}) {
  return (
    <Link href={href} className="group block h-full">
      <Card className="flex h-full items-center gap-3 !p-4 transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-lift">
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition group-hover:scale-105",
            tone
          )}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <span className="min-w-0">
          <span className="block truncate font-display text-sm font-semibold text-navy-800">
            {title}
          </span>
          <span className="block truncate text-xs text-navy-600">
            {subtitle}
          </span>
        </span>
      </Card>
    </Link>
  );
}
