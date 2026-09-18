import type { SearchFilter } from "@/lib/voice-lounge/page-data";
import { cn } from "@/lib/utils";

const FILTERS: Array<{ value: SearchFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "videos", label: "Videos" },
  { value: "podcasts", label: "Podcasts" },
  { value: "episodes", label: "Episodes" },
  { value: "creators", label: "Creators" },
  { value: "news", label: "News" },
  { value: "live", label: "Live" },
];

function hrefFor(query: string, filter: SearchFilter) {
  const params = new URLSearchParams();
  if (query.trim()) params.set("q", query.trim());
  if (filter !== "all") params.set("type", filter);
  const suffix = params.toString();
  return suffix ? `/search?${suffix}` : "/search";
}

export function SearchFilterBar({ query, active }: { query: string; active: SearchFilter }) {
  return (
    <div className="shell sticky top-[4.4rem] z-20 -mb-3 mt-4 overflow-x-auto py-2 sm:top-[4.8rem]">
      <div className="hyper-glass flex w-max min-w-full items-center gap-1 rounded-full border border-hairline p-1.5">
        <span className="hidden px-3 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-muted-foreground sm:inline">
          Filter
        </span>
        {FILTERS.map((filter) => (
          <a
            key={filter.value}
            href={hrefFor(query, filter.value)}
            aria-current={active === filter.value ? "page" : undefined}
            className={cn(
              "press whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold",
              active === filter.value
                ? "bg-[var(--green-action)] text-white shadow-glow"
                : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
            )}
          >
            {filter.label}
          </a>
        ))}
      </div>
    </div>
  );
}
