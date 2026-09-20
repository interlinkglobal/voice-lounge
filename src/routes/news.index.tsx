import { createFileRoute } from "@tanstack/react-router";
import { NewsExperience } from "@/components/pages/ContentExperiences";
import { routeHead } from "@/components/pages/PlatformPage";

export const Route = createFileRoute("/news/")({
  head: () => routeHead("news"),
  component: NewsExperience,
});
