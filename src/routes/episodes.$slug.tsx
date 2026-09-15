import { createFileRoute } from "@tanstack/react-router";
import { DetailPage, detailHead } from "@/components/pages/DetailPage";

export const Route = createFileRoute("/episodes/$slug")({
  head: ({ params }) => detailHead("episode", params.slug),
  component: Page,
});

function Page() {
  const { slug } = Route.useParams();
  return <DetailPage kind="episode" slug={slug} />;
}
