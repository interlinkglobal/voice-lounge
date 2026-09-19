import { createFileRoute } from "@tanstack/react-router";
import { PodcastsExperience } from "@/components/pages/RouteExperiences";
import { routeHead } from "@/components/pages/PlatformPage";

export const Route = createFileRoute("/podcasts")({
  head: () => routeHead("podcasts"),
  component: Page,
});

function Page() {
  return <PodcastsExperience />;
}
