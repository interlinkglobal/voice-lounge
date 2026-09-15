import { createFileRoute } from "@tanstack/react-router";
import { PlatformPage, routeHead } from "@/components/pages/PlatformPage";

export const Route = createFileRoute("/episodes")({
  head: () => routeHead("episodes"),
  component: Page,
});

function Page() {
  return <PlatformPage page="episodes" />;
}
