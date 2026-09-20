import { createFileRoute } from "@tanstack/react-router";
import { LiveExperience } from "@/components/pages/ContentExperiences";
import { routeHead } from "@/components/pages/PlatformPage";

export const Route = createFileRoute("/live")({
  head: () => routeHead("live"),
  component: LiveExperience,
});
