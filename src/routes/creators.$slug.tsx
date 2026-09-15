import { createFileRoute } from "@tanstack/react-router";
import { DetailPage, detailHead } from "@/components/pages/DetailPage";

export const Route = createFileRoute("/creators/$slug")({
  head: ({ params }) => detailHead("creator", params.slug),
  component: Page,
});

function Page() {
  const { slug } = Route.useParams();
  return <DetailPage kind="creator" slug={slug} />;
}
