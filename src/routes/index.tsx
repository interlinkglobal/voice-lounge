import { createFileRoute } from "@tanstack/react-router";
import { PlatformPage, routeHead } from "@/components/pages/PlatformPage";

export const Route = createFileRoute("/")({
  head: () => routeHead("home"),
  component: HomePage,
});

function HomePage() {
  return <PlatformPage page="home" />;
}
