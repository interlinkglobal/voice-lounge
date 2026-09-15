import { createFileRoute } from "@tanstack/react-router";
import { PlatformPage, routeHead } from "@/components/pages/PlatformPage";

export const Route = createFileRoute("/watch")({
  head: () => routeHead("watch"),
  component: Page,
});

function Page() {
  return <PlatformPage page="watch" />;
}
