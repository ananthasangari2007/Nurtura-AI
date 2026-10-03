"use client";

import { useState } from "react";
import { CalendarPlus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import type { NewCareEventInput } from "@/lib/journey/api";
import type { CareEventStatus, CareEventType } from "@/lib/mock-data";
import { EVENT_TYPE_OPTIONS } from "./JourneyMeta";
import { cn } from "@/lib/utils";

/**
 * AddEventModal — capture a non-clinical journey event:
 * type · date · title · description (+ completed/upcoming state).
 */
export function AddEventModal({
  open,
  saving,
  onClose,
  onSubmit,
}: {
  open: boolean;
  saving: boolean;
  onClose: () => void;
  onSubmit: (input: NewCareEventInput) => void;
}) {
  const [type, setType] = useState<CareEventType>("appointment");
  const [date, setDate] = useState("2026-10-18");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<CareEventStatus>("upcoming");
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !date) {
      setError("Please add a date, title, and short description.");
      return;
    }
    setError(null);
    onSubmit({
      type,
      date,
      title: title.trim(),
      description: description.trim(),
      source: "Patient added",
      status,
    });
    setTitle("");
    setDescription("");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-navy-900/40 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Add journey event"
      onClick={onClose}
    >
      <div
        className="animate-slide-up w-full max-w-lg rounded-3xl bg-white p-5 shadow-lift sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold text-navy-800">
              Add journey event
            </h2>
            <p className="mt-0.5 text-[13px] text-navy-600">
              Organizational memories only — visits, papers, questions, nudges.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-700 transition hover:bg-navy-100"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <Label htmlFor="event-type">Event type</Label>
            <select
              id="event-type"
              value={type}
              onChange={(e) => setType(e.target.value as CareEventType)}
              className="h-11 w-full rounded-2xl border border-navy-100 bg-white px-3 text-sm text-navy-800 shadow-soft outline-none focus:border-lavender-300"
            >
              {EVENT_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2">
            <div>
              <Label htmlFor="event-date">Date</Label>
              <Input
                id="event-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <Label>State</Label>
              <div className="grid grid-cols-2 gap-1 rounded-2xl bg-navy-50 p-1">
                {(["upcoming", "completed"] as CareEventStatus[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    aria-pressed={status === s}
                    className={cn(
                      "h-9 rounded-xl font-display text-[13px] font-medium capitalize transition",
                      status === s
                        ? "bg-navy-800 text-white shadow-soft"
                        : "text-navy-600 hover:text-navy-800"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="event-title">Title</Label>
            <Input
              id="event-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Questions prepared"
              maxLength={80}
            />
          </div>

          <div>
            <Label htmlFor="event-desc">Description</Label>
            <Textarea
              id="event-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What should future-you remember about this step?"
              className="min-h-[88px]"
              maxLength={400}
            />
          </div>

          {error && (
            <p role="alert" className="text-[13px] font-medium text-blush-600">
              {error}
            </p>
          )}

          <div className="flex gap-2.5 pt-1">
            <Button type="submit" disabled={saving} className="flex-1">
              <CalendarPlus className="h-4 w-4" aria-hidden />
              {saving ? "Saving…" : "Save to journey"}
            </Button>
            <Button type="button" variant="soft" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
