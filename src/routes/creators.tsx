import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/creators")({
  component: CreatorsLayout,
});

function CreatorsLayout() {
  return <Outlet />;
}
