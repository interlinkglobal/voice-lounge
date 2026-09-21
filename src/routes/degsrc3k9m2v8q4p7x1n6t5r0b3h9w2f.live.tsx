import { createFileRoute } from "@tanstack/react-router";
import { AdminLiveControl } from "@/components/admin/VideoAdminControls";

export const Route = createFileRoute("/degsrc3k9m2v8q4p7x1n6t5r0b3h9w2f/live")({
  component: Page,
});

function Page() {
  return <AdminLiveControl />;
}
