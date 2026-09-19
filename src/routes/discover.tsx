import { createFileRoute } from "@tanstack/react-router";
import { DiscoverExperience } from "@/components/pages/RouteExperiences";
import { routeHead } from "@/components/pages/PlatformPage";

export const Route = createFileRoute("/discover")({
  head: () => routeHead("discover"),
  component: Page,
});

function Page() {
  return <DiscoverExperience />;
}
