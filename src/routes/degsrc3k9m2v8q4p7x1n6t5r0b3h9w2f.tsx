import { createFileRoute } from "@tanstack/react-router";
import { CmsShell } from "@/components/admin/CmsShell";

export const Route = createFileRoute("/degsrc3k9m2v8q4p7x1n6t5r0b3h9w2f")({
  head: () => ({
    meta: [
      { title: "Voice Lounge Content Studio" },
      { name: "robots", content: "noindex,nofollow,noarchive,nosnippet" },
      { name: "googlebot", content: "noindex,nofollow,noarchive,nosnippet" },
    ],
  }),
  headers: () => ({
    "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
    "Cache-Control": "private, no-store",
  }),
  component: CmsShell,
});
