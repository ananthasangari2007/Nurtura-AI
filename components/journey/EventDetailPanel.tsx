"use client";

import Link from "next/link";
import { FileText, MapPin, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatEventDate } from "@/lib/journey/memory";
import type { CareEvent } from "@/lib/mock-data";
import { EVENT_META } from "./JourneyMeta";

/** Event detail panel — bottom sheet on mobile, right slide-over on desktop. */
export function EventDetailPanel({
  event,
  onClose,
}: {
  event: CareEvent;
  onClose: () => void;
}) {
  const meta = EVENT_META[event.type];
  const Icon = meta.icon;
  const done = event.status === "completed";

  return (
    <div
      className="fixed inset-0 z-50 bg-navy-900/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${event.title}`}
      onClick={onClose}
    >
      <aside
        className="animate-slide-up absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 shadow-lift sm:inset-y-0 sm:right-0 sm:left-auto sm:w-[420px] sm:rounded-t-none sm:rounded-l-3xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${meta.tone}`}
          >
            <Icon className="h-6 w-6" aria-hidden />
          </span>
          <button
            onClick={onClose}
            aria-label="Close details"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-50 text-navy-700 transition hover:bg-navy-100"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge tone={done ? "teal" : "blush"}>
            {done ? "Completed" : "Upcoming"}
          </Badge>
          <Badge tone="navy">{meta.label}</Badge>
        </div>

        <h2 className="mt-3 font-display text-xl font-semibold text-navy-800">
          {event.title}
        </h2>
        <p className="mt-0.5 text-sm font-medium text-navy-600">
          {formatEventDate(event.date).full}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-navy-700">
          {event.description}
        </p>

        <dl className="mt-4 space-y-2 rounded-2xl bg-navy-50 p-4 text-[13px]">
          <div className="flex items-center gap-2 text-navy-700">
            <MapPin className="h-4 w-4 shrink-0 text-lavender-500" aria-hidden />
            <span>
              <span className="font-medium">Source: </span>
              {event.source}
            </span>
          </div>
          <div className="flex items-center gap-2 text-navy-700">
            <FileText className="h-4 w-4 shrink-0 text-lavender-500" aria-hidden />
            <span>
              <span className="font-medium">Recorded: </span>
              {new Date(event.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </dl>

        {event.relatedDocumentId && (
          <Link
            href="/documents"
            className="mt-3 flex items-center gap-2.5 rounded-2xl border border-teal-soft-100 bg-teal-soft-50 px-4 py-3 text-sm font-medium text-teal-soft-700 transition hover:shadow-soft"
          >
            <FileText className="h-4 w-4 shrink-0" aria-hidden />
            View linked document organization
          </Link>
        )}

        <p className="mt-4 text-xs leading-relaxed text-navy-600/80">
          Journey memory stores organizational notes only. Clinical decisions
          always remain with healthcare professionals.
        </p>
      </aside>
    </div>
  );
}
