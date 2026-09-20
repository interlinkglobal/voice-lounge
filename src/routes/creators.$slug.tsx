import { createFileRoute } from "@tanstack/react-router";
import { CreatorStoryExperience } from "@/components/pages/AudienceExperiences";
import { detailHead } from "@/components/pages/DetailPage";

export const Route = createFileRoute("/creators/$slug")({
  head: ({ params }) => detailHead("creator", params.slug),
  component: Page,
});

function Page() {
  const { slug } = Route.useParams();
  return <CreatorStoryExperience slug={slug} />;
}
