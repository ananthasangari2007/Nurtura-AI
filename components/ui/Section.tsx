import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="max-w-xl">
        <Badge tone="lavender">{eyebrow}</Badge>
        <h1 className="mt-3 font-display text-2xl font-semibold text-navy-800 sm:text-[28px] sm:leading-tight">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 text-sm leading-relaxed text-navy-600 sm:text-[15px]">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function PlaceholderModule({
  title,
  whatNext,
  icon,
}: {
  title: string;
  whatNext: string[];
  icon: ReactNode;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <Card className="border-dashed !border-lavender-200 bg-lavender-50/60">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-soft">
          {icon}
        </div>
        <h2 className="mt-4 font-display text-lg font-semibold text-navy-800">
          {title} — prototype scaffold
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-navy-600">
          This module route is wired into navigation and the app shell. Full
          workflows (voice, brief builder, handoff passport, caregiver sharing)
          land in the next hackathon phase. Mock data powers the preview so the
          app runs with zero external services.
        </p>
      </Card>
      <Card>
        <p className="font-display text-sm font-semibold tracking-wide text-navy-700 uppercase">
          Coming next
        </p>
        <ul className="mt-3 space-y-2.5">
          {whatNext.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-navy-600">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blush-400" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
