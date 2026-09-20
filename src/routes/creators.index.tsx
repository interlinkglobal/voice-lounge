import { createFileRoute } from "@tanstack/react-router";
import { CreatorsExperience } from "@/components/pages/AudienceExperiences";
import { routeHead } from "@/components/pages/PlatformPage";

export const Route = createFileRoute("/creators/")({
  head: () => routeHead("creators"),
  component: CreatorsExperience,
});
