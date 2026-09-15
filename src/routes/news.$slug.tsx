import { createFileRoute } from "@tanstack/react-router";
import { DetailPage, detailHead } from "@/components/pages/DetailPage";

export const Route = createFileRoute("/news/$slug")({
  head: ({ params }) => detailHead("news", params.slug),
  component: Page,
});

function Page() {
  const { slug } = Route.useParams();
  return <DetailPage kind="news" slug={slug} />;
}
