import { createFileRoute, Link } from "@tanstack/react-router";
import { Youtube } from "lucide-react";
import { PlatformPage, routeHead } from "@/components/pages/PlatformPage";
import { YouTubeFeedGrid } from "@/components/youtube/YouTubeFeedGrid";
import { getYouTubeFeed } from "@/lib/youtube.functions";

export const Route = createFileRoute("/watch")({
  head: () => routeHead("watch"),
  loader: () => getYouTubeFeed(),
  component: Page,
});

function Page() {
  const feed = Route.useLoaderData();

  return (
    <>
      <PlatformPage page="watch" />
      <div className="shell mt-[var(--section-gap)] flex justify-end">
        <Link
          to="/youtube"
          className="press inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-2 px-4 py-2 text-sm font-semibold hover:border-[var(--green)] hover:text-[var(--green)]"
        >
          <Youtube className="size-4" aria-hidden="true" />
          Open full YouTube collection
        </Link>
      </div>
      <YouTubeFeedGrid feed={feed} />
    </>
  );
}
