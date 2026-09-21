import { createFileRoute } from "@tanstack/react-router";
import { GuestDetailExperience } from "@/components/pages/GuestExperiences";

export const Route = createFileRoute("/guests/$slug")({
  component: Page,
});

function Page() {
  const { slug } = Route.useParams();
  return <GuestDetailExperience slug={slug} />;
}
