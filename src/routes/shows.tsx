import { createFileRoute } from "@tanstack/react-router";
import { ShowsExperience } from "@/components/pages/RouteExperiences";
import { routeHead } from "@/components/pages/PlatformPage";

export const Route = createFileRoute("/shows")({
  head: () => routeHead("shows"),
  component: Page,
});

function Page() {
  return <ShowsExperience />;
}
