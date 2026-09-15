import { createFileRoute } from "@tanstack/react-router";
import { PlatformPage, routeHead } from "@/components/pages/PlatformPage";

export const Route = createFileRoute("/news")({
  head: () => routeHead("news"),
  component: Page,
});

function Page() {
  return <PlatformPage page="news" />;
}
