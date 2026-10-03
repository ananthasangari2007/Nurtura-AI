import { NextResponse } from "next/server";
import { extractDocumentCareActions } from "@/lib/documents/extract";
import { validateAIResponse } from "@/lib/safety/policy";
import type { DocType } from "@/lib/documents/types";

const VALID_TYPES = [
  "appointment-slip",
  "referral-slip",
  "prescription",
  "report",
  "insurance",
  "other",
];

/**
 * POST /api/documents/extract — prototype extraction endpoint.
 * Mock-backed today; a configured AI provider can implement the same
 * admin-only contract later. Never returns clinical interpretation.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      name?: string;
      docType?: string;
      fileKind?: string;
    };
    if (
      !body.name?.trim() ||
      !body.docType ||
      !VALID_TYPES.includes(body.docType) ||
      (body.fileKind !== "pdf" && body.fileKind !== "image")
    ) {
      return NextResponse.json(
        { error: "name, docType and fileKind (pdf|image) are required." },
        { status: 400 }
      );
    }
    const actions = await extractDocumentCareActions({
      name: body.name.trim().slice(0, 120),
      docType: body.docType as DocType,
      fileKind: body.fileKind,
    });
    // Central safety gate: extraction must stay administrative-only.
    const verdict = validateAIResponse(JSON.stringify(actions));
    if (!verdict.allowed) {
      return NextResponse.json(
        { error: "Extraction blocked by safety policy.", safetyFlags: verdict.flags },
        { status: 422 }
      );
    }
    return NextResponse.json({ actions });
  } catch {
    return NextResponse.json({ error: "Could not organize document." }, { status: 500 });
  }
}
