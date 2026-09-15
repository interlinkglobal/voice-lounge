import { createFileRoute } from "@tanstack/react-router";
import { PlatformPage, routeHead } from "@/components/pages/PlatformPage";

export const Route = createFileRoute("/community")({
  head: () => routeHead("community"),
  component: Page,
});

function Page() {
  return <PlatformPage page="community" />;
}
