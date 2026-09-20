import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { YouTubeFeedResult, YouTubeFeedVideo } from "@/lib/youtube.functions";

const YouTubeFeedContext = createContext<YouTubeFeedResult | null>(null);

export function YouTubeFeedProvider({ feed, children }: { feed: YouTubeFeedResult; children: ReactNode }) {
  return <YouTubeFeedContext.Provider value={feed}>{children}</YouTubeFeedContext.Provider>;
}

export function useYouTubeFeed() {
  return useContext(YouTubeFeedContext);
}

export function useYouTubeVideoForKey(key: string): YouTubeFeedVideo | null {
  const feed = useYouTubeFeed();
  return useMemo(() => {
    if (!feed || feed.status !== "ready" || feed.videos.length === 0) return null;
    return feed.videos.find((video) => video.id === key) ?? null;
  }, [feed, key]);
}
