import { createFileRoute } from "@tanstack/react-router";
import { PlatformPage, routeHead } from "@/components/pages/PlatformPage";

export const Route = createFileRoute("/news/")({
  head: () => routeHead("news"),
  component: NewsIndexPage,
});

function NewsIndexPage() {
  return <PlatformPage page="news" />;
}
