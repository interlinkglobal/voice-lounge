import { createFileRoute } from "@tanstack/react-router";
import { PlatformPage, routeHead } from "@/components/pages/PlatformPage";

export const Route = createFileRoute("/shows")({
  head: () => routeHead("shows"),
  component: Page,
});

function Page() {
  return <PlatformPage page="shows" />;
}
