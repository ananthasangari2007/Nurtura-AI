"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import {
  Ban,
  Check,
  Copy,
  ExternalLink,
  FileDown,
  Hourglass,
  Link2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import type { HandoffPassport } from "@/lib/handoff/types";
import { ExpiryCountdown } from "./ExpiryCountdown";

/**
 * SharePanel — shareable preview link + scannable QR + PDF download +
 * expiry countdown + revoke. Prototype 24h temporary token.
 */
export function SharePanel({
  passport,
  acting,
  onRevoke,
  onExpireDemo,
  onNew,
}: {
  passport: HandoffPassport;
  acting: boolean;
  onRevoke: () => void;
  onExpireDemo: () => void;
  onNew: () => void;
}) {
  const [link, setLink] = useState("");
  const [qr, setQr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const url = `${window.location.origin}/handoff/${passport.token}`;
    // Sync with external systems on mount: share URL (window) + QR bitmap.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLink(url);
    QRCode.toDataURL(url, { width: 220, margin: 1 })
      .then(setQr)
      .catch(() => setQr(null));
  }, [passport.token]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const live = passport.status === "active";

  return (
    <Card className="!border-navy-800 bg-navy-800 text-white">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <CardTitle className="!text-white">Shareable passport</CardTitle>
        <Badge tone={live ? "teal" : "blush"}>
          {live ? `Active · ${passport.viewCount} views` : passport.status}
        </Badge>
      </div>

      {live && (
        <div className="mt-2">
          <ExpiryCountdown expiresAt={passport.expiresAt} />
        </div>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-white/60 uppercase">
            <Link2 className="h-3.5 w-3.5" aria-hidden /> Temporary token link
          </p>
          <p className="mt-1 truncate rounded-2xl bg-white/10 px-3.5 py-2.5 font-mono text-[13px] text-white">
            {link || "Preparing link…"}
          </p>
          <p className="mt-1 font-mono text-xs text-white/60">
            Token {passport.token} · expires{" "}
            {new Date(passport.expiresAt).toLocaleString("en-US", {
              day: "numeric",
              month: "short",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" variant="blush" onClick={copy} disabled={!link}>
              {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
              {copied ? "Copied" : "Copy link"}
            </Button>
            <Link href={`/handoff/${passport.token}`}>
              <Button size="sm" variant="soft">
                <ExternalLink className="h-4 w-4" aria-hidden /> Preview receiver view
              </Button>
            </Link>
            <Button size="sm" variant="soft" onClick={() => window.print()}>
              <FileDown className="h-4 w-4" aria-hidden /> PDF
            </Button>
          </div>
        </div>
        <div className="mx-auto rounded-2xl bg-white p-3">
          {qr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr} alt={`QR code opening passport ${passport.token}`} width={160} height={160} />
          ) : (
            <p className="px-4 py-8 text-xs text-navy-600">Building QR…</p>
          )}
          <p className="pb-1 text-center text-[11px] font-medium text-navy-600">
            Scan to open
          </p>
        </div>
      </div>

      {live && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-white/15 pt-4">
          <Button size="sm" variant="ghost" className="bg-white/10 text-white hover:bg-white/20 hover:text-white" onClick={onRevoke} disabled={acting}>
            <Ban className="h-4 w-4" aria-hidden />
            {acting ? "Working…" : "Revoke access"}
          </Button>
          <Button size="sm" variant="ghost" className="bg-white/10 text-white hover:bg-white/20 hover:text-white" onClick={onExpireDemo} disabled={acting}>
            <Hourglass className="h-4 w-4" aria-hidden /> Simulate 24h expiry
          </Button>
          <Button size="sm" variant="ghost" className="bg-white/10 text-white hover:bg-white/20 hover:text-white" onClick={onNew}>
            New passport
          </Button>
        </div>
      )}
      {!live && (
        <div className="mt-4 border-t border-white/15 pt-4">
          <Button size="sm" variant="blush" onClick={onNew}>
            Create a new passport
          </Button>
        </div>
      )}
    </Card>
  );
}
