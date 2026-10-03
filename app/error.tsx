"use client";

import Link from "next/link";
import { HeartHandshake, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

/** Route error boundary — calm recovery, never a dead end. */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-md py-14 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-blush-100">
        <HeartHandshake className="h-7 w-7 text-blush-600" aria-hidden />
      </span>
      <h1 className="mt-4 font-display text-2xl font-semibold text-navy-800">
        Something stumbled on this page.
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-navy-600">
        Your journey data is safe — this is a display hiccup, not data loss.
        {error.digest ? ` (Ref ${error.digest})` : ""}
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Button onClick={reset}>
          <RotateCcw className="h-4 w-4" aria-hidden /> Try again
        </Button>
        <Link href="/dashboard">
          <Button variant="soft">Back to dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
