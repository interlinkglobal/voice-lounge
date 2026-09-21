import { useEffect, useMemo, useState } from "react";
import { YouTubeVideoCard } from "@/components/youtube/YouTubeFeedGrid";
import type { YouTubeFeedVideo } from "@/lib/youtube.functions";
import { youtubeEmbedUrl, youtubeThumbnailUrl, youtubeWatchUrl } from "@/lib/youtube-url";

interface ManagedRouteVideoRow {
  id: string;
  route_path: string;
  youtube_url: string;
  video_id: string;
  title: string;
  thumbnail_url: string | null;
  status: "published" | "draft";
  created_at: string;
}

export function ManagedRouteVideos({ routePath }: { routePath: string }) {
  const [rows, setRows] = useState<ManagedRouteVideoRow[]>([]);

  useEffect(() => {
    let active = true;
    setRows([]);

    void fetch(`/api/route-videos?route=${encodeURIComponent(routePath)}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    })
      .then(async (response) => {
        const payload = (await response.json().catch(() => ({}))) as { videos?: ManagedRouteVideoRow[] };
        if (active && response.ok) setRows(payload.videos ?? []);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [routePath]);

  const videos = useMemo<YouTubeFeedVideo[]>(
    () =>
      rows.map((row) => ({
        id: row.video_id,
        title: row.title,
        description: "Added by The Voice Lounge",
        publishedAt: row.created_at,
        thumbnail: row.thumbnail_url || youtubeThumbnailUrl(row.video_id),
        watchUrl: row.youtube_url || youtubeWatchUrl(row.video_id),
        embedUrl: youtubeEmbedUrl(row.video_id),
        durationSec: null,
        viewCount: null,
        likeCount: null,
        liveBroadcastContent: "none",
        wasLive: false,
      })),
    [rows],
  );

  if (!videos.length) return null;

  return (
    <section className="shell mt-[clamp(2rem,5vw,4rem)] border-t border-hairline pt-5" aria-labelledby="managed-route-videos-heading">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.15em] text-[var(--green)]">Voice Lounge selection</p>
          <h2 id="managed-route-videos-heading" className="font-display text-2xl font-black">Featured videos</h2>
        </div>
        <span className="text-xs text-muted-foreground">{videos.length} added by admin</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos.map((video) => (
          <YouTubeVideoCard key={video.id} video={video} animate={false} className="w-full" />
        ))}
      </div>
    </section>
  );
}
