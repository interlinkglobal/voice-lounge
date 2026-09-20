import { createFileRoute } from "@tanstack/react-router";
import { EpisodesDirectoryExperience } from "@/components/pages/AudienceExperiences";
import { routeHead } from "@/components/pages/PlatformPage";

export const Route = createFileRoute("/episodes")({
  head: () => routeHead("episodes"),
  component: EpisodesDirectoryExperience,
});
