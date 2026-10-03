import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-2xl border border-navy-100 bg-white px-4 text-sm text-navy-800 placeholder:text-navy-600/50 shadow-soft outline-none transition focus:border-lavender-300 focus:ring-4 focus:ring-lavender-100",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-[120px] w-full rounded-2xl border border-navy-100 bg-white px-4 py-3 text-sm leading-relaxed text-navy-800 placeholder:text-navy-600/50 shadow-soft outline-none transition focus:border-lavender-300 focus:ring-4 focus:ring-lavender-100",
        className
      )}
      {...props}
    />
  );
}

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "mb-1.5 block font-display text-[13px] font-semibold text-navy-700",
        className
      )}
      {...props}
    />
  );
}
