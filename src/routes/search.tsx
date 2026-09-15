import { createFileRoute } from "@tanstack/react-router";
import { PlatformPage, routeHead } from "@/components/pages/PlatformPage";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q.slice(0, 160) : "",
  }),
  head: () => routeHead("search"),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  return <PlatformPage page="search" query={q} />;
}
