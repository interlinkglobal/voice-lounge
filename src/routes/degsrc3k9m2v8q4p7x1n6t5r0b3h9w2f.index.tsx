import { createFileRoute, redirect } from "@tanstack/react-router";
import { CMS_BASE } from "@/lib/cms/routes";

export const Route = createFileRoute("/degsrc3k9m2v8q4p7x1n6t5r0b3h9w2f/")({
  beforeLoad: () => {
    throw redirect({ href: `${CMS_BASE}/dashboard` });
  },
});
