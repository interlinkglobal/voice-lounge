import { createFileRoute } from "@tanstack/react-router";
import { DiscoverWorkspaceExperience } from "@/components/pages/AudienceExperiences";
import { routeHead } from "@/components/pages/PlatformPage";

export const Route = createFileRoute("/discover")({
  head: () => routeHead("discover"),
  component: DiscoverWorkspaceExperience,
});
