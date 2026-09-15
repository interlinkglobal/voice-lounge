import { createFileRoute } from "@tanstack/react-router";
import { DetailPage, detailHead } from "@/components/pages/DetailPage";

export const Route = createFileRoute("/podcasts/$slug")({
  head: ({ params }) => detailHead("podcast", params.slug),
  component: Page,
});

function Page() {
  const { slug } = Route.useParams();
  return <DetailPage kind="podcast" slug={slug} />;
}
