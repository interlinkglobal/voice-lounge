import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { YouTubeFeedResult, YouTubeFeedVideo } from "@/lib/youtube.functions";

const YouTubeFeedContext = createContext<YouTubeFeedResult | null>(null);

function hash(value: string) {
  let out = 0;
  for (let i = 0; i < value.length; i += 1) out = (out * 31 + value.charCodeAt(i)) >>> 0;
  return out;
}

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
    return feed.videos[hash(key) % feed.videos.length] ?? null;
  }, [feed, key]);
}
