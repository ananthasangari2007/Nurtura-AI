import { cn } from "@/lib/utils";

const tones: Record<string, string> = {
  blush: "bg-blush-100 text-blush-600",
  lavender: "bg-lavender-100 text-lavender-600",
  teal: "bg-teal-soft-100 text-teal-soft-700",
  sky: "bg-sky-soft-100 text-sky-soft-600",
  navy: "bg-navy-100 text-navy-700",
  white: "bg-white/80 text-navy-700 border border-white",
};

export function Badge({
  tone = "lavender",
  className,
  children,
}: {
  tone?: keyof typeof tones;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-display text-[11px] font-semibold tracking-wide uppercase",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
