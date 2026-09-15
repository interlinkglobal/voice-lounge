import { createFileRoute } from "@tanstack/react-router";
import { PlatformPage, routeHead } from "@/components/pages/PlatformPage";

export const Route = createFileRoute("/about")({
  head: () => routeHead("about"),
  component: Page,
});

function Page() {
  return <PlatformPage page="about" />;
}
