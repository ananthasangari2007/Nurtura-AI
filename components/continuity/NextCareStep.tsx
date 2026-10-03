import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import type { NextStep } from "@/lib/continuity/types";

/**
 * NextCareStep — the single most useful ADMIN/PREPARATION action.
 * Templates only (review · pack · confirm). Never clinical advice.
 */
export function NextCareStep({ step }: { step: NextStep }) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-white bg-white shadow-soft">
      <div className="flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-center">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-teal-soft-100 text-teal-soft-700">
          <Compass className="h-7 w-7" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-widest text-navy-600 uppercase">
            Next Care Step
          </p>
          <h2 className="mt-0.5 font-display text-xl font-semibold text-navy-800">
            {step.title}
          </h2>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-navy-600">
            {step.detail}
          </p>
        </div>
        <Link
          href={step.href}
          className="inline-flex h-[52px] shrink-0 items-center justify-center gap-2 rounded-full bg-navy-800 px-8 font-display text-[15px] font-medium text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-navy-900 hover:shadow-lift lg:ml-auto"
        >
          {step.cta} <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
