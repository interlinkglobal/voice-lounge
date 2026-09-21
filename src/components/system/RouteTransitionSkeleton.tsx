import { cn } from "@/lib/utils";

export function RouteTransitionSkeleton({ workspace = false }: { workspace?: boolean }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page"
      className={cn(
        "route-switch-skeleton mx-auto w-full animate-in fade-in duration-150",
        workspace ? "max-w-[1200px] p-4 lg:p-6" : "shell py-[clamp(1.25rem,4vw,3rem)]",
      )}
    >
      <span className="sr-only">Loading the next page…</span>
      <div className="h-3 w-28 rounded-full shimmer" />
      <div className="mt-4 h-10 w-[min(32rem,78%)] rounded-xl shimmer" />
      <div className="mt-3 h-4 w-[min(44rem,92%)] rounded-full shimmer" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-2xl border border-hairline bg-card/30">
            <div className="aspect-video shimmer" />
            <div className="space-y-3 p-4">
              <div className="h-3 w-20 rounded-full shimmer" />
              <div className="h-5 w-[85%] rounded-lg shimmer" />
              <div className="h-4 w-full rounded-lg shimmer" />
              <div className="h-4 w-[72%] rounded-lg shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
