import { NextResponse } from "next/server";
import {
  expirePassportNow,
  getPassport,
  listAudit,
  recordView,
  revokePassport,
} from "@/lib/handoff/vault";

/** GET — receiver lookup (marks expired automatically; no view logged). */
export async function GET(_req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const passport = getPassport(token);
  if (!passport) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ passport, audit: listAudit(token) });
}

/** POST — actions: view (log access) · revoke · expire (demo simulation). */
export async function POST(req: Request, ctx: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await ctx.params;
    const body = (await req.json()) as { action?: string };
    if (body.action === "view") {
      const passport = recordView(token);
      if (!passport) return NextResponse.json({ error: "Not found." }, { status: 404 });
      return NextResponse.json({ passport, audit: listAudit(token) });
    }
    if (body.action === "revoke") {
      const passport = revokePassport(token);
      if (!passport) return NextResponse.json({ error: "Not found." }, { status: 404 });
      return NextResponse.json({ passport, audit: listAudit(token) });
    }
    if (body.action === "expire") {
      const passport = expirePassportNow(token);
      if (!passport) return NextResponse.json({ error: "Not found." }, { status: 404 });
      return NextResponse.json({ passport, audit: listAudit(token) });
    }
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Action failed." }, { status: 500 });
  }
}
