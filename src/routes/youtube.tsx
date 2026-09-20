import { createFileRoute } from "@tanstack/react-router";
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
  return <YouTubeFeedGrid feed={feed} standalone />;
}
