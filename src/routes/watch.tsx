import { createFileRoute } from "@tanstack/react-router";
import { WatchExperience } from "@/components/pages/ContentExperiences";
import { routeHead } from "@/components/pages/PlatformPage";

export const Route = createFileRoute("/watch")({
  head: () => routeHead("watch"),
  component: WatchExperience,
});
