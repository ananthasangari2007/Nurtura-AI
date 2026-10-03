import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPassport, recordView } from "@/lib/handoff/vault";
import { ReceiverView } from "@/components/handoff/ReceiverView";

export const metadata: Metadata = { title: "Shared Care Passport" };

// Always server-rendered: passport state (views, expiry, revocation) is live.
export const dynamic = "force-dynamic";

/**
 * Receiver view — renders ONLY the patient-selected scope.
 * Opening an active passport records a "Viewed" audit event.
 */
export default async function ReceiverPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  let passport = getPassport(token);
  if (!passport) notFound();
  if (passport.status === "active") {
    passport = recordView(token) ?? passport;
  }
  return (
    <div className="py-4">
      <ReceiverView passport={passport} />
    </div>
  );
}
