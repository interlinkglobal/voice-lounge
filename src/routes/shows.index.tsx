import { createFileRoute } from "@tanstack/react-router";
import { ShowsDirectoryExperience } from "@/components/pages/ContentExperiences";
import { routeHead } from "@/components/pages/PlatformPage";

export const Route = createFileRoute("/shows/")({
  head: () => routeHead("shows"),
  component: ShowsDirectoryExperience,
});
