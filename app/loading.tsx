import { Card } from "@/components/ui/Card";

/** Route loading skeleton — calm shimmer while a module loads. */
export default function Loading() {
  return (
    <div className="space-y-4" aria-label="Loading" role="status">
      <div className="h-8 w-48 animate-pulse rounded-full bg-navy-100" />
      <div className="h-6 w-72 animate-pulse rounded-full bg-navy-50" />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <div className="h-5 w-32 animate-pulse rounded-full bg-navy-100" />
          <div className="mt-3 space-y-2">
            <div className="h-4 animate-pulse rounded-full bg-navy-50" />
            <div className="h-4 w-5/6 animate-pulse rounded-full bg-navy-50" />
            <div className="h-4 w-4/6 animate-pulse rounded-full bg-navy-50" />
          </div>
        </Card>
        <Card>
          <div className="h-5 w-40 animate-pulse rounded-full bg-navy-100" />
          <div className="mt-3 space-y-2">
            <div className="h-4 animate-pulse rounded-full bg-navy-50" />
            <div className="h-4 w-3/6 animate-pulse rounded-full bg-navy-50" />
          </div>
        </Card>
      </div>
    </div>
  );
}
