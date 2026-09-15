import { createFileRoute } from "@tanstack/react-router";
import { PlatformPage, routeHead } from "@/components/pages/PlatformPage";

export const Route = createFileRoute("/account")({
  head: () => routeHead("account"),
  component: Page,
});

function Page() {
  return <PlatformPage page="account" />;
}
