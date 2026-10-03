import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { JourneyStage } from "@/lib/mock-data";

/**
 * ProgressCard — "Current Care Journey" overview.
 * Shows current stage, previous event, next appointment + animated progress.
 */
export function ProgressCard({ stage }: { stage: JourneyStage }) {
  return (
    <Card className="overflow-hidden !border-navy-800 bg-navy-800 text-white">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge tone="white">Current Care Journey</Badge>
        <span className="font-display text-xs font-medium text-white/70">
          {stage.stepLabel}
        </span>
      </div>

      <h2 className="mt-3 font-display text-xl font-semibold sm:text-2xl">
        {stage.current}
      </h2>
      <p className="mt-1 text-sm text-white/75">{stage.currentDetail}</p>

      {/* Animated progress */}
      <div className="mt-4">
        <div
          className="h-2.5 overflow-hidden rounded-full bg-white/15"
          role="progressbar"
          aria-valuenow={stage.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Care journey progress"
        >
          <div
            className="animate-progress-fill h-full rounded-full bg-gradient-to-r from-blush-300 via-lavender-300 to-teal-soft-200"
            style={{ width: `${stage.progress}%` }}
          />
        </div>
        <p className="mt-1.5 text-xs font-medium text-white/70">
          {stage.progress}% journey ready
        </p>
      </div>

      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        <div className="rounded-2xl bg-white/10 p-3.5">
          <p className="flex items-center gap-1.5 font-display text-xs font-semibold tracking-wide text-white/70 uppercase">
            <CheckCircle2 className="h-3.5 w-3.5 text-teal-soft-200" />
            Previous care event
          </p>
          <p className="mt-1 text-sm font-medium">{stage.previous}</p>
          <p className="text-xs text-white/65">{stage.previousDetail}</p>
        </div>
        <div className="rounded-2xl bg-white/10 p-3.5">
          <p className="flex items-center gap-1.5 font-display text-xs font-semibold tracking-wide text-white/70 uppercase">
            <MapPin className="h-3.5 w-3.5 text-blush-300" />
            Next appointment
          </p>
          <p className="mt-1 text-sm font-medium">{stage.next}</p>
          <p className="text-xs text-white/65">{stage.nextDetail}</p>
        </div>
      </div>

      <a
        href="/care-journey"
        className="mt-4 inline-flex items-center gap-1.5 font-display text-sm font-medium text-white transition hover:gap-2.5"
      >
        View full journey <ArrowRight className="h-4 w-4" aria-hidden />
      </a>
    </Card>
  );
}
