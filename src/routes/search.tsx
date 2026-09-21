import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/components/pages/PlatformPage";
import { SearchExperience } from "@/components/pages/SearchExperience";
import type { SearchFilter } from "@/lib/voice-lounge/page-data";

const FILTERS = new Set<SearchFilter>(["all", "videos", "podcasts", "episodes", "creators", "guests", "news", "live"]);

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>) => {
    const rawType = typeof search["type"] === "string" ? search["type"] : "all";
    const filter = FILTERS.has(rawType as SearchFilter) ? (rawType as SearchFilter) : "all";
    return {
      q: typeof search["q"] === "string" ? search["q"].slice(0, 160) : "",
      type: filter === "all" ? undefined : filter,
    };
  },
  head: () => routeHead("search"),
  component: SearchPage,
});

function SearchPage() {
  const { q, type } = Route.useSearch();
  return <SearchExperience query={q} filter={type ?? "all"} />;
}
