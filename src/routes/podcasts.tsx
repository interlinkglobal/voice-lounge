import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/podcasts")({
  component: PodcastsLayout,
});

function PodcastsLayout() {
  return <Outlet />;
}
