import { createFileRoute } from "@tanstack/react-router";
import { CommunityExperience } from "@/components/pages/AudienceExperiences";
import { routeHead } from "@/components/pages/PlatformPage";

export const Route = createFileRoute("/community")({
  head: () => routeHead("community"),
  component: CommunityExperience,
});
