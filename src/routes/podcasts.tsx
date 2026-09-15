import { createFileRoute } from "@tanstack/react-router";
import { PlatformPage, routeHead } from "@/components/pages/PlatformPage";

export const Route = createFileRoute("/podcasts")({
  head: () => routeHead("podcasts"),
  component: Page,
});

function Page() {
  return <PlatformPage page="podcasts" />;
}
