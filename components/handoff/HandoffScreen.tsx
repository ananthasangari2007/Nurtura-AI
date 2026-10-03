"use client";

import { IdCard } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SafetyBanner } from "@/components/ui/SafetyBanner";
import { FlowNext } from "@/components/ui/FlowNext";
import { SectionHeading } from "@/components/ui/Section";
import { useHandoff } from "@/lib/handoff/use-handoff";
import { PassportDashboard } from "./PassportDashboard";
import { SharingControls } from "./SharingControls";
import { SelectionPickers } from "./SelectionPickers";
import { ConsentScreen } from "./ConsentScreen";
import { SharePanel } from "./SharePanel";
import { AuditLog } from "./AuditLog";

/** HandoffScreen — dashboard → controls → consent → shareable passport. */
export function HandoffScreen() {
  const h = useHandoff();

  return (
    <div className="space-y-5">
      <SectionHeading
        eyebrow="Care Handoff Passport"
        title="You control what gets shared."
        description="When you change doctor or clinic, your journey travels with you — only the pieces you tick, for 24 hours, revocable anytime."
        action={
          <Button onClick={() => h.setConsentOpen(true)}>
            <IdCard className="h-4 w-4" aria-hidden />
            Review & share
          </Button>
        }
      />

      <div className="animate-fade-up">
        <PassportDashboard
          questionIds={h.questionIds}
          eventIds={h.eventIds}
          documentIds={h.documentIds}
        />
      </div>

      <div className="animate-fade-up grid items-start gap-5 lg:grid-cols-2" style={{ animationDelay: "80ms" }}>
        <SharingControls scope={h.scope} onToggle={h.toggleScope} />
        <div className="space-y-5">
          {h.active && (
            <SharePanel
              passport={h.active}
              acting={h.acting}
              onRevoke={() => h.revoke(h.active!.token)}
              onExpireDemo={() => h.expireDemo(h.active!.token)}
              onNew={() => h.setConsentOpen(true)}
            />
          )}
          <AuditLog audit={h.audit} />
        </div>
      </div>

      <div className="animate-fade-up" style={{ animationDelay: "140ms" }}>
        <h2 className="mb-3 font-display text-[17px] font-semibold text-navy-800">
          Choose exactly what travels
        </h2>
        <SelectionPickers
          questionIds={h.questionIds}
          eventIds={h.eventIds}
          documentIds={h.documentIds}
          onQuestion={h.toggleQuestion}
          onEvent={h.toggleEvent}
          onDocument={h.toggleDocument}
        />
      </div>

      <FlowNext from="/handoff" />

      <SafetyBanner />

      <ConsentScreen
        open={h.consentOpen}
        scope={h.scope}
        counts={{
          events: h.eventIds.length,
          questions: h.questionIds.length,
          documents: h.documentIds.length,
        }}
        generating={h.generating}
        error={h.error}
        onClose={() => h.setConsentOpen(false)}
        onConfirm={() => void h.generate()}
      />
    </div>
  );
}
