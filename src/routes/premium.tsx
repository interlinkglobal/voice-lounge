import { createFileRoute } from "@tanstack/react-router";
import { PlatformPage, routeHead } from "@/components/pages/PlatformPage";

export const Route = createFileRoute("/premium")({
  head: () => routeHead("premium"),
  component: Page,
});

function Page() {
  return <PlatformPage page="premium" />;
}
