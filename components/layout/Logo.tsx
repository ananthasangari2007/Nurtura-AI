import Link from "next/link";
import { HeartHandshake } from "lucide-react";

export function Logo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="Nurtura AI home">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-navy-800 text-white shadow-soft">
        <HeartHandshake className="h-5 w-5" aria-hidden />
      </span>
      {!collapsed && (
        <span className="leading-tight">
          <span className="block font-display text-[17px] font-semibold text-navy-800">
            Nurtura AI
          </span>
          <span className="block text-[11px] font-medium tracking-wide text-navy-600">
            Know my next step
          </span>
        </span>
      )}
    </Link>
  );
}
