import { Card, CardTitle } from "@/components/ui/Card";
import type { JourneyStats } from "@/lib/journey/memory";

/** Progress visualization — overall journey + per-category completion. */
export function JourneyProgress({ stats }: { stats: JourneyStats }) {
  return (
    <Card className="!border-navy-800 bg-navy-800 text-white">
      <div className="flex items-center justify-between gap-2">
        <CardTitle className="!text-white">Journey progress</CardTitle>
        <span className="font-display text-xs font-medium text-white/70">
          {stats.completed} of {stats.total} steps
        </span>
      </div>

      <div
        className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/15"
        role="progressbar"
        aria-valuenow={stats.progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Journey completion"
      >
        <div
          className="animate-progress-fill h-full rounded-full bg-gradient-to-r from-blush-300 via-lavender-300 to-teal-soft-200"
          style={{ width: `${stats.progress}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs font-medium text-white/70">
        {stats.progress}% complete · {stats.upcoming} upcoming
      </p>

      <ul className="mt-4 grid grid-cols-2 gap-2">
        {stats.byFilter.map((row) => {
          const pct = row.total === 0 ? 0 : Math.round((row.done / row.total) * 100);
          return (
            <li key={row.id} className="rounded-2xl bg-white/10 px-3.5 py-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-display font-semibold">{row.label}</span>
                <span className="text-white/70">
                  {row.done}/{row.total}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/15">
                <div
                  className="animate-progress-fill h-full rounded-full bg-white/80"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
