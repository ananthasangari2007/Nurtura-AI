import { randomBytes } from "crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import {
  PASSPORT_TTL_HOURS,
  isExpiredPassport,
  type AuditEvent,
  type AuditKind,
  type HandoffPassport,
  type ShareScope,
  type SharedItems,
} from "@/lib/handoff/types";

/**
 * Prototype passport vault — server-side, FILE-BACKED (shared tmp JSON).
 *
 * Secure-looking structure (opaque tokens, expiry enforcement, audit trail)
 * but explicitly prototype-ready: mock session, demo expiry. File backing
 * (instead of module memory) keeps the vault consistent across Next.js
 * route contexts in dev and single-instance demos. A production version
 * would back this with Supabase (`handoff_passports` + `handoff_audit`
 * tables, RLS, real auth).
 */

type VaultData = {
  passports: Record<string, HandoffPassport>;
  audit: AuditEvent[];
  seq: number;
};

const VAULT_FILE = join(tmpdir(), "nurtura-handoff-vault.json");

function load(): VaultData {
  try {
    if (existsSync(VAULT_FILE)) {
      const raw = readFileSync(VAULT_FILE, "utf-8");
      const data = JSON.parse(raw) as VaultData;
      if (data && typeof data === "object" && data.passports) return data;
    }
  } catch {
    // Corrupt tmp file — start fresh (prototype only).
  }
  return { passports: {}, audit: [], seq: 0 };
}

function save(data: VaultData) {
  try {
    mkdirSync(tmpdir(), { recursive: true });
    writeFileSync(VAULT_FILE, JSON.stringify(data), "utf-8");
  } catch {
    // Tmp unwritable — vault stays in this call only (prototype only).
  }
}

function newToken(): string {
  return `ntr_${randomBytes(9).toString("base64url")}`;
}

function log(data: VaultData, token: string, kind: AuditKind, detail: string) {
  data.seq += 1;
  data.audit.unshift({
    id: `audit-${Date.now()}-${data.seq}`,
    token,
    at: new Date().toISOString(),
    kind,
    detail,
  });
}

function refreshStatus(data: VaultData, p: HandoffPassport): HandoffPassport {
  if (p.status === "active" && isExpiredPassport(p)) {
    const expired: HandoffPassport = { ...p, status: "expired" };
    data.passports[p.token] = expired;
    log(data, p.token, "expired", "24-hour share window elapsed.");
    return expired;
  }
  return p;
}

export function createPassport(scope: ShareScope, items: SharedItems): HandoffPassport {
  const data = load();
  const passport = createPassportIn(data, scope, items);
  save(data);
  return passport;
}

function createPassportIn(
  data: VaultData,
  scope: ShareScope,
  items: SharedItems,
  note?: string
): HandoffPassport {
  const now = Date.now();
  const passport: HandoffPassport = {
    token: newToken(),
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + PASSPORT_TTL_HOURS * 3_600_000).toISOString(),
    scope: { ...scope },
    items: {
      questionIds: [...items.questionIds],
      eventIds: [...items.eventIds],
      documentIds: [...items.documentIds],
    },
    status: "active",
    viewCount: 0,
  };
  data.passports[passport.token] = passport;
  const enabled = (Object.keys(scope) as (keyof ShareScope)[]).filter((k) => scope[k]);
  log(data, passport.token, "created", `Sharing: ${enabled.join(", ") || "nothing"}.${note ? ` ${note}` : ""}`);
  return passport;
}

export function listPassports(): HandoffPassport[] {
  const data = load();
  ensureDemoPassport(data);
  const list = Object.values(data.passports).map((p) => refreshStatus(data, p));
  save(data);
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/**
 * Demo Mode: guarantee one fictional sample passport (Ananya) so the
 * share → QR → receiver story works in under a minute. Only seeds an
 * empty vault; patient-created passports are never touched.
 */
function ensureDemoPassport(data: VaultData) {
  if (Object.keys(data.passports).length > 0) return;
  const demo = createPassportIn(
    data,
    { timeline: true, appointments: true, questions: true, documents: false, followups: false },
    { questionIds: ["q1", "q2"], eventIds: ["e1", "e2"], documentIds: [] },
    "Sample fictional demo data — Ananya's passport."
  );
  void demo;
}

export function getPassport(token: string): HandoffPassport | null {
  const data = load();
  const p = data.passports[token];
  if (!p) return null;
  const refreshed = refreshStatus(data, p);
  save(data);
  return refreshed;
}

export function recordView(token: string): HandoffPassport | null {
  const data = load();
  const raw = data.passports[token];
  if (!raw) return null;
  const p = refreshStatus(data, raw);
  if (p.status !== "active") {
    save(data);
    return p;
  }
  const updated: HandoffPassport = { ...p, viewCount: p.viewCount + 1 };
  data.passports[token] = updated;
  log(data, token, "viewed", `Receiver opened the passport (view #${updated.viewCount}).`);
  save(data);
  return updated;
}

export function revokePassport(token: string): HandoffPassport | null {
  const data = load();
  const p = data.passports[token];
  if (!p) return null;
  const refreshed = refreshStatus(data, p);
  if (refreshed.status === "revoked") {
    save(data);
    return refreshed;
  }
  const revoked: HandoffPassport = { ...refreshed, status: "revoked" };
  data.passports[token] = revoked;
  log(data, token, "revoked", "Patient revoked access. Link no longer opens.");
  save(data);
  return revoked;
}

/** Demo helper: simulate the 24-hour window elapsing. */
export function expirePassportNow(token: string): HandoffPassport | null {
  const data = load();
  const p = data.passports[token];
  if (!p) return null;
  const expired: HandoffPassport = {
    ...p,
    expiresAt: new Date(Date.now() - 1_000).toISOString(),
    status: "expired",
  };
  data.passports[token] = expired;
  log(data, token, "expired", "Expiry simulated for the demo.");
  save(data);
  return expired;
}

export function listAudit(token?: string): AuditEvent[] {
  const data = load();
  return token ? data.audit.filter((e) => e.token === token) : [...data.audit];
}
