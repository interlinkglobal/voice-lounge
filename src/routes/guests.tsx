import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/guests")({
  component: GuestsLayout,
});

function GuestsLayout() {
  return <Outlet />;
}
