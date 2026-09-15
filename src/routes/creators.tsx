import { createFileRoute } from "@tanstack/react-router";
import { PlatformPage, routeHead } from "@/components/pages/PlatformPage";

export const Route = createFileRoute("/creators")({
  head: () => routeHead("creators"),
  component: Page,
});

function Page() {
  return <PlatformPage page="creators" />;
}
