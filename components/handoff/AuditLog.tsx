import { Activity } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/Card";
import { AUDIT_LABEL, type AuditEvent } from "@/lib/handoff/types";

/** Audit activity — created · viewed · revoked, newest first. */
export function AuditLog({ audit }: { audit: AuditEvent[] }) {
  return (
    <Card>
      <CardTitle className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-lavender-500" aria-hidden />
        Audit activity
      </CardTitle>
      {audit.length === 0 ? (
        <p className="mt-2 text-sm text-navy-600">
          No passport activity yet — creation, views, and revocations appear here.
        </p>
      ) : (
        <ol className="mt-3 space-y-0">
          {audit.slice(0, 8).map((e, i, arr) => (
            <li key={e.id} className="relative flex gap-3 pb-4 last:pb-0">
              {i < arr.length - 1 && (
                <span aria-hidden className="absolute top-7 left-[11px] h-[calc(100%-1.5rem)] w-0.5 bg-navy-100" />
              )}
              <span
                aria-hidden
                className={`z-10 mt-0.5 h-6 w-6 shrink-0 rounded-full border-2 ${
                  e.kind === "revoked" || e.kind === "expired"
                    ? "border-blush-400 bg-white"
                    : e.kind === "viewed"
                      ? "border-sky-soft-500 bg-white"
                      : "border-teal-soft-500 bg-teal-soft-500"
                }`}
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-navy-800">
                  {AUDIT_LABEL[e.kind]}
                  <span className="ml-1.5 font-mono text-[11px] font-normal text-navy-600/70">
                    {e.token.slice(0, 12)}…
                  </span>
                </p>
                <p className="truncate text-xs text-navy-600">
                  {e.detail} ·{" "}
                  {new Date(e.at).toLocaleString("en-US", {
                    day: "numeric",
                    month: "short",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
