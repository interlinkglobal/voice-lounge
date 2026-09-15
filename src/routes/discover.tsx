import { createFileRoute } from "@tanstack/react-router";
import { PlatformPage, routeHead } from "@/components/pages/PlatformPage";

export const Route = createFileRoute("/discover")({
  head: () => routeHead("discover"),
  component: Page,
});

function Page() {
  return <PlatformPage page="discover" />;
}
