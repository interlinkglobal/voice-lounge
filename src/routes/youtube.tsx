import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { YouTubeFeedGrid } from "@/components/youtube/YouTubeFeedGrid";
import { getYouTubeFeed } from "@/lib/youtube.functions";

export const Route = createFileRoute("/youtube")({
  loader: () => getYouTubeFeed(),
  head: () => ({
    meta: [
      { title: "YouTube | The Voice Lounge" },
      {
        name: "description",
        content: "Latest video uploads from The Voice Lounge official YouTube channel.",
      },
      { property: "og:title", content: "YouTube | The Voice Lounge" },
      {
        property: "og:description",
        content: "Latest video uploads from The Voice Lounge official YouTube channel.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: YouTubePage,
});

function YouTubePage() {
  const feed = Route.useLoaderData();

  return (
    <div className="pb-[var(--section-gap)]">
      <div className="shell pt-5">
        <Link
          to="/watch"
          className="press inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-2 px-4 py-2 text-sm font-semibold hover:border-[var(--green)] hover:text-[var(--green)]"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to Watch
        </Link>
      </div>
      <YouTubeFeedGrid feed={feed} standalone />
    </div>
  );
}
