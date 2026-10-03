import Link from "next/link";
import { CalendarCheck, Clock, MapPin, CircleCheck, Circle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardTitle } from "@/components/ui/Card";
import type { DetailedAppointment } from "@/lib/mock-data";

/**
 * AppointmentCard — upcoming visit with doctor, date, time,
 * location and visit-preparation status.
 */
export function AppointmentCard({
  appointment,
}: {
  appointment: DetailedAppointment;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blush-100 font-display text-lg font-semibold text-blush-600">
            {appointment.doctor.replace("Dr. ", "").charAt(0)}
          </span>
          <div>
            <p className="text-xs font-medium tracking-wide text-navy-600 uppercase">
              Upcoming appointment
            </p>
            <CardTitle className="!text-lg">{appointment.title}</CardTitle>
          </div>
        </div>
        <Badge tone="blush">{appointment.countdown}</Badge>
      </div>

      <dl className="mt-4 space-y-2.5 text-sm">
        <div className="flex items-center gap-2.5 text-navy-700">
          <CalendarCheck className="h-4 w-4 shrink-0 text-lavender-500" aria-hidden />
          <span>
            <span className="font-medium">{appointment.doctor}</span>
            <span className="text-navy-600"> · {appointment.specialty}</span>
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-navy-700">
          <Clock className="h-4 w-4 shrink-0 text-lavender-500" aria-hidden />
          <span>
            {appointment.date} · {appointment.time}
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-navy-700">
          <MapPin className="h-4 w-4 shrink-0 text-lavender-500" aria-hidden />
          <span>{appointment.location}</span>
        </div>
      </dl>

      {/* Preparation status */}
      <div className="mt-4 rounded-2xl bg-navy-50 p-3.5">
        <div className="flex items-center justify-between text-[13px]">
          <p className="font-display font-semibold text-navy-800">
            Preparation status
          </p>
          <p className="font-medium text-teal-soft-700">
            {appointment.prepPercent}% ready
          </p>
        </div>
        <div
          className="mt-2 h-2 overflow-hidden rounded-full bg-navy-100"
          role="progressbar"
          aria-valuenow={appointment.prepPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Visit preparation progress"
        >
          <div
            className="animate-progress-fill h-full rounded-full bg-teal-soft-500"
            style={{ width: `${appointment.prepPercent}%` }}
          />
        </div>
        <ul className="mt-2.5 grid gap-1.5 sm:grid-cols-2">
          {appointment.prep.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-1.5 text-[13px] text-navy-700"
            >
              {item.done ? (
                <CircleCheck className="h-4 w-4 shrink-0 text-teal-soft-600" aria-hidden />
              ) : (
                <Circle className="h-4 w-4 shrink-0 text-navy-200" aria-hidden />
              )}
              <span className={item.done ? undefined : "font-medium"}>
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/doctor-brief"
          className="inline-flex h-10 items-center rounded-full bg-navy-800 px-5 font-display text-[13px] font-medium text-white shadow-soft transition hover:bg-navy-900"
        >
          Continue preparation
        </Link>
        <Link
          href="/care-journey"
          className="inline-flex h-10 items-center rounded-full border border-navy-100 bg-white px-5 font-display text-[13px] font-medium text-navy-700 shadow-soft transition hover:border-lavender-200"
        >
          View journey
        </Link>
      </div>
    </Card>
  );
}
