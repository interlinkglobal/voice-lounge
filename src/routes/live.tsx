import { createFileRoute } from "@tanstack/react-router";
import { PlatformPage, routeHead } from "@/components/pages/PlatformPage";

export const Route = createFileRoute("/live")({
  head: () => routeHead("live"),
  component: Page,
});

function Page() {
  return <PlatformPage page="live" />;
}
