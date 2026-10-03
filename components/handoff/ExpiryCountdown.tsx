"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";
import { expiryLabel } from "@/lib/handoff/types";

/** Live countdown: "Share link expires in 24 hours." */
export function ExpiryCountdown({ expiresAt }: { expiresAt: string }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);
  return (
    <p className="inline-flex items-center gap-1.5 rounded-full bg-blush-50 px-3 py-1.5 text-xs font-semibold text-blush-600">
      <Timer className="h-3.5 w-3.5" aria-hidden />
      {expiryLabel(expiresAt, now)}
    </p>
  );
}
