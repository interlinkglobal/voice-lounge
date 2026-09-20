import { createFileRoute } from "@tanstack/react-router";
import { PodcastsDirectoryExperience } from "@/components/pages/ContentExperiences";
import { routeHead } from "@/components/pages/PlatformPage";

export const Route = createFileRoute("/podcasts/")({
  head: () => routeHead("podcasts"),
  component: PodcastsDirectoryExperience,
});
