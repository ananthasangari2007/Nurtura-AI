import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { nextFlowNode } from "@/lib/store/snapshot";

/**
 * FlowNext — one-line continuity footer linking each module
 * to the next step of the care flow.
 */
export function FlowNext({ from }: { from: string }) {
  const node = nextFlowNode(from);
  if (!node) return null;
  return (
    <Link
      href={node.nextHref}
      className="group flex items-center justify-between gap-3 rounded-2xl border border-white bg-white px-5 py-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
      aria-label={`Continue to ${node.nextLabel}`}
    >
      <span>
        <span className="block text-xs font-semibold tracking-widest text-navy-600/70 uppercase">
          Next step · {node.nextLabel}
        </span>
        <span className="mt-0.5 block font-display text-[15px] font-semibold text-navy-800">
          Continue your journey →
        </span>
      </span>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-800 text-white transition group-hover:translate-x-0.5">
        <ArrowRight className="h-4 w-4" aria-hidden />
      </span>
    </Link>
  );
}
