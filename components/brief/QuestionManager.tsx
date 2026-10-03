"use client";

import { useState } from "react";
import { Check, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import type { BriefQuestion } from "@/lib/brief/types";

/** Saved questions — add, edit, delete, mark discussed. */
export function QuestionManager({
  questions,
  editingId,
  setEditingId,
  onAdd,
  onUpdate,
  onRemove,
  onToggleDiscussed,
}: {
  questions: BriefQuestion[];
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  onAdd: (text: string) => void;
  onUpdate: (id: string, text: string) => void;
  onRemove: (id: string) => void;
  onToggleDiscussed: (id: string) => void;
}) {
  const [draft, setDraft] = useState("");
  const [editText, setEditText] = useState("");

  function startEdit(q: BriefQuestion) {
    setEditingId(q.id);
    setEditText(q.text);
  }

  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <div>
          <CardTitle>My questions for the doctor</CardTitle>
          <CardDescription>
            In your own words — preparation only, never clinical advice.
          </CardDescription>
        </div>
        <Badge tone="blush">{questions.length} saved</Badge>
      </div>

      <form
        className="mt-4 flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          onAdd(draft);
          setDraft("");
        }}
      >
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a question, e.g. What should I bring?"
          aria-label="Add a question"
          maxLength={200}
        />
        <Button type="submit" size="icon" disabled={!draft.trim()} aria-label="Add question">
          <Plus className="h-4 w-4" aria-hidden />
        </Button>
      </form>

      <ul className="mt-3 space-y-2.5">
        {questions.map((q, i) => (
          <li
            key={q.id}
            className={`rounded-2xl border px-3.5 py-3 transition ${
              q.discussed
                ? "border-teal-soft-100 bg-teal-soft-50/60"
                : "border-navy-100/70 bg-white"
            }`}
          >
            {editingId === q.id ? (
              <form
                className="flex items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  onUpdate(q.id, editText);
                }}
              >
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  aria-label="Edit question"
                  maxLength={200}
                />
                <Button type="submit" size="icon" aria-label="Save">
                  <Check className="h-4 w-4" aria-hidden />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="soft"
                  onClick={() => setEditingId(null)}
                  aria-label="Cancel editing"
                >
                  <X className="h-4 w-4" aria-hidden />
                </Button>
              </form>
            ) : (
              <div className="flex items-start gap-2.5">
                <Star
                  className="mt-0.5 h-4 w-4 shrink-0 fill-blush-200 text-blush-400"
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-navy-800">
                    <span className="mr-1.5 text-navy-600/70">Q{i + 1}.</span>
                    {q.text}
                  </p>
                  {q.discussed && (
                    <p className="mt-0.5 text-xs font-medium text-teal-soft-700">
                      Marked as discussed
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => onToggleDiscussed(q.id)}
                    title={q.discussed ? "Unmark discussed" : "Mark discussed"}
                    aria-label={`${q.discussed ? "Unmark" : "Mark"} question ${i + 1} as discussed`}
                    aria-pressed={q.discussed}
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                      q.discussed
                        ? "bg-teal-soft-500 text-white"
                        : "bg-navy-50 text-navy-600 hover:bg-navy-100"
                    }`}
                  >
                    <Check className="h-4 w-4" aria-hidden />
                  </button>
                  <button
                    onClick={() => startEdit(q)}
                    aria-label={`Edit question ${i + 1}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-50 text-navy-600 transition hover:bg-navy-100"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden />
                  </button>
                  <button
                    onClick={() => onRemove(q.id)}
                    aria-label={`Delete question ${i + 1}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-50 text-navy-600 transition hover:bg-blush-100 hover:text-blush-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      {questions.length === 0 && (
        <p className="mt-3 rounded-2xl bg-navy-50 px-3.5 py-3 text-sm text-navy-600">
          No questions yet — add your first one above. Starred questions flow
          into your brief automatically.
        </p>
      )}
    </Card>
  );
}
