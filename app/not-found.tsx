import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <p className="font-display text-sm font-semibold tracking-widest text-lavender-500 uppercase">
        Page not found
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-navy-800">
        Let&apos;s get you back on track.
      </h1>
      <p className="mt-2 text-sm text-navy-600">
        That page doesn&apos;t exist yet — your care journey is safe.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/dashboard">
          <Button>Go to dashboard</Button>
        </Link>
        <Link href="/">
          <Button variant="soft">Home</Button>
        </Link>
      </div>
    </div>
  );
}
