import { createFileRoute } from "@tanstack/react-router";
import { PlatformPage, routeHead } from "@/components/pages/PlatformPage";

export const Route = createFileRoute("/categories")({
  head: () => routeHead("categories"),
  component: Page,
});

function Page() {
  return <PlatformPage page="categories" />;
}
