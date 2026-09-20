import { createFileRoute } from "@tanstack/react-router";
import { ShowDetailExperience } from "@/components/pages/ContentExperiences";
import { detailHead } from "@/components/pages/DetailPage";

export const Route = createFileRoute("/shows/$slug")({
  head: ({ params }) => detailHead("podcast", params.slug),
  component: Page,
});

function Page() {
  const { slug } = Route.useParams();
  return <ShowDetailExperience slug={slug} />;
}
