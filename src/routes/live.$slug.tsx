import { createFileRoute } from "@tanstack/react-router";
import { DetailPage, detailHead } from "@/components/pages/DetailPage";

export const Route = createFileRoute("/live/$slug")({
  head: ({ params }) => detailHead("live", params.slug),
  component: Page,
});

function Page() {
  const { slug } = Route.useParams();
  return <DetailPage kind="live" slug={slug} />;
}
