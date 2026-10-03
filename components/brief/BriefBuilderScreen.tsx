"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SafetyBanner } from "@/components/ui/SafetyBanner";
import { SectionHeading } from "@/components/ui/Section";
import { useBriefBuilder } from "@/lib/brief/store";
import { BRIEF_STEPS } from "@/lib/brief/types";
import { BriefStepper } from "./BriefStepper";
import { IntakeChat } from "./IntakeChat";
import { QuestionManager } from "./QuestionManager";
import { DocumentPicker } from "./DocumentPicker";
import { JourneyPicker } from "./JourneyPicker";
import { BriefPreview } from "./BriefPreview";

/** BriefBuilderScreen — "I Need a Doctor" intake → approved Visit Brief. */
export function BriefBuilderScreen() {
  const b = useBriefBuilder();
  const idx = BRIEF_STEPS.findIndex((s) => s.id === b.step);

  function next() {
    if (b.step === "intake") b.setStep("questions");
    else if (b.step === "questions") b.setStep("documents");
    else if (b.step === "documents") b.setStep("journey");
    else if (b.step === "journey") {
      b.approveBrief();
      b.setStep("preview");
    }
  }
  function back() {
    if (b.step === "preview") b.setStep("journey");
    else if (b.step === "journey") b.setStep("documents");
    else if (b.step === "documents") b.setStep("questions");
    else if (b.step === "questions") b.setStep("intake");
  }

  const nextLabel =
    b.step === "intake"
      ? "Continue to questions"
      : b.step === "questions"
        ? "Continue to documents"
        : b.step === "documents"
          ? "Continue to journey"
          : "Generate Doctor Visit Brief";
  const nextDisabled =
    (b.step === "intake" && !b.intakeDone) ||
    (b.step === "questions" && b.questions.length === 0);

  return (
    <div className="space-y-5">
      <SectionHeading
        eyebrow="Doctor Visit Brief"
        title="From “I need a doctor” to a brief you approve."
        description="A guided, non-clinical intake — your words, your questions, your papers — assembled into a one-page brief."
        action={
          <Link href="/voice">
            <Button variant="soft">Prefer voice? Open companion</Button>
          </Link>
        }
      />

      <BriefStepper step={b.step} onGo={b.setStep} />

      <div className="animate-fade-up" key={b.step}>
        {b.step === "intake" && (
          <IntakeChat
            request={b.request}
            setField={b.setField}
            onAddQuestion={b.addQuestion}
            onComplete={() => b.setStep("questions")}
            onDemo={b.loadDemoFlow}
          />
        )}
        {b.step === "questions" && (
          <QuestionManager
            questions={b.questions}
            editingId={b.editingId}
            setEditingId={b.setEditingId}
            onAdd={b.addQuestion}
            onUpdate={b.updateQuestion}
            onRemove={b.removeQuestion}
            onToggleDiscussed={b.toggleDiscussed}
          />
        )}
        {b.step === "documents" && (
          <DocumentPicker documents={b.documents} onToggle={b.toggleDocument} />
        )}
        {b.step === "journey" && (
          <JourneyPicker selectedIds={b.eventIds} onToggle={b.toggleEvent} />
        )}
        {b.step === "preview" && (
          <BriefPreview
            brief={b.brief}
            approvedAt={b.approvedAt}
            onApprove={b.approveBrief}
            onToggleDiscussed={b.toggleDiscussed}
            onMarkAllDiscussed={b.markAllDiscussed}
            onResetDiscussed={b.resetDiscussed}
            onEdit={b.setStep}
          />
        )}
      </div>

      {/* Wizard nav (screen only; preview has its own toolbar) */}
      {b.step !== "preview" && b.step !== "intake" && (
        <div className="print:hidden flex items-center justify-between gap-3">
          <Button variant="soft" onClick={back}>
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back
          </Button>
          <p className="hidden text-xs text-navy-600 sm:block">
            Step {idx + 1} of {BRIEF_STEPS.length}
          </p>
          <Button onClick={next} disabled={nextDisabled}>
            {nextLabel} <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      )}
      {b.step === "intake" && (
        <p className="text-center text-xs text-navy-600">
          Answer in the chat above, or jump ahead with the step indicator — your
          progress is kept.
        </p>
      )}

      <SafetyBanner />
    </div>
  );
}
