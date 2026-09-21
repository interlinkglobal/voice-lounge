import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { getYouTubeFeed, type YouTubeFeedResult, type YouTubeFeedVideo } from "@/lib/youtube.functions";

const INITIAL_FEED: YouTubeFeedResult = {
  status: "loading",
  channelId: "",
  channelTitle: "The Voice Lounge",
  channelUrl: "https://www.youtube.com/@THEVOICELOUNGE",
  channelThumbnail: null,
  totalResults: 0,
  videos: [],
  comments: [],
  message: null,
};

const YouTubeFeedContext = createContext<YouTubeFeedResult>(INITIAL_FEED);

export function YouTubeFeedProvider({
  enabled,
  children,
}: {
  enabled: boolean;
  children: ReactNode;
}) {
  const [feed, setFeed] = useState<YouTubeFeedResult>(INITIAL_FEED);
  const loaded = useRef(false);

  useEffect(() => {
    if (!enabled || loaded.current) return;
    loaded.current = true;
    let active = true;

    void getYouTubeFeed()
      .then((result) => {
        if (active) setFeed(result);
      })
      .catch((error) => {
        console.warn("[youtube-feed] lazy load failed", error);
        if (active) {
          setFeed({
            ...INITIAL_FEED,
            status: "error",
            message: "The Voice Lounge YouTube feed is temporarily unavailable.",
          });
        }
      });

    return () => {
      active = false;
    };
  }, [enabled]);

  return <YouTubeFeedContext.Provider value={feed}>{children}</YouTubeFeedContext.Provider>;
}

export function useYouTubeFeed() {
  return useContext(YouTubeFeedContext);
}

export function useYouTubeVideoForKey(key: string): YouTubeFeedVideo | null {
  const feed = useYouTubeFeed();
  return useMemo(() => {
    if (feed.status !== "ready" || feed.videos.length === 0) return null;
    return feed.videos.find((video) => video.id === key) ?? null;
  }, [feed, key]);
}
