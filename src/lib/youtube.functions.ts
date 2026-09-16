import { createServerFn } from "@tanstack/react-start";

export type YouTubeFeedStatus = "ready" | "unconfigured" | "error";

export interface YouTubeFeedVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
  watchUrl: string;
  embedUrl: string;
}

export interface YouTubeFeedResult {
  status: YouTubeFeedStatus;
  channelId: string;
  channelTitle: string;
  channelUrl: string;
  channelThumbnail: string | null;
  totalResults: number;
  videos: YouTubeFeedVideo[];
  message: string | null;
}

interface YouTubeThumbnail {
  url?: string;
  width?: number;
  height?: number;
}

type YouTubeThumbnailSet = Partial<Record<"default" | "medium" | "high" | "standard" | "maxres", YouTubeThumbnail>>;

interface YouTubeChannelResponse {
  items?: Array<{
    id?: string;
    snippet?: {
      title?: string;
      thumbnails?: YouTubeThumbnailSet;
    };
    contentDetails?: {
      relatedPlaylists?: {
        uploads?: string;
      };
    };
  }>;
}

interface YouTubePlaylistResponse {
  pageInfo?: {
    totalResults?: number;
  };
  items?: Array<{
    snippet?: {
      title?: string;
      description?: string;
      publishedAt?: string;
      thumbnails?: YouTubeThumbnailSet;
      resourceId?: {
        videoId?: string;
      };
    };
    contentDetails?: {
      videoId?: string;
    };
  }>;
}

const DEFAULT_CHANNEL_TITLE = "The Voice Lounge";
const DEFAULT_CHANNEL_URL = "https://www.youtube.com/@THEVOICELOUNGE";

function bestThumbnail(thumbnails?: YouTubeThumbnailSet): string | null {
  return thumbnails?.maxres?.url
    ?? thumbnails?.standard?.url
    ?? thumbnails?.high?.url
    ?? thumbnails?.medium?.url
    ?? thumbnails?.default?.url
    ?? null;
}

function emptyResult(status: Exclude<YouTubeFeedStatus, "ready">, channelId: string, message: string): YouTubeFeedResult {
  return {
    status,
    channelId,
    channelTitle: DEFAULT_CHANNEL_TITLE,
    channelUrl: DEFAULT_CHANNEL_URL,
    channelThumbnail: null,
    totalResults: 0,
    videos: [],
    message,
  };
}

export const getYouTubeFeed = createServerFn({ method: "GET" }).handler(async (): Promise<YouTubeFeedResult> => {
  // Read secrets only inside the server function so neither value is bundled into the browser application.
  const apiKey = process.env.YOUTUBE_DATA_API_KEY?.trim() ?? "";
  const channelId = process.env.CHANNEL_ID?.trim() ?? "";

  if (!apiKey || !channelId) {
    return emptyResult(
      "unconfigured",
      channelId,
      "YouTube feed integration is ready. Add YOUTUBE_DATA_API_KEY and CHANNEL_ID to the deployment environment to populate it.",
    );
  }

  try {
    const channelUrl = new URL("https://www.googleapis.com/youtube/v3/channels");
    channelUrl.searchParams.set("part", "snippet,contentDetails");
    channelUrl.searchParams.set(channelId.startsWith("@") ? "forHandle" : "id", channelId);
    channelUrl.searchParams.set("key", apiKey);

    const channelResponse = await fetch(channelUrl, {
      headers: { Accept: "application/json" },
    });

    if (!channelResponse.ok) {
      console.error(`[youtube-feed] channels.list failed with HTTP ${channelResponse.status}`);
      return emptyResult("error", channelId, "The Voice Lounge YouTube channel could not be loaded right now.");
    }

    const channelData = (await channelResponse.json()) as YouTubeChannelResponse;
    const channel = channelData.items?.[0];
    const uploadsPlaylistId = channel?.contentDetails?.relatedPlaylists?.uploads;

    if (!channel || !uploadsPlaylistId) {
      return emptyResult("error", channelId, "No YouTube channel was found for the configured CHANNEL_ID.");
    }

    const playlistUrl = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
    playlistUrl.searchParams.set("part", "snippet,contentDetails");
    playlistUrl.searchParams.set("playlistId", uploadsPlaylistId);
    playlistUrl.searchParams.set("maxResults", "50");
    playlistUrl.searchParams.set("key", apiKey);

    const playlistResponse = await fetch(playlistUrl, {
      headers: { Accept: "application/json" },
    });

    if (!playlistResponse.ok) {
      console.error(`[youtube-feed] playlistItems.list failed with HTTP ${playlistResponse.status}`);
      return emptyResult("error", channelId, "The Voice Lounge YouTube uploads could not be loaded right now.");
    }

    const playlistData = (await playlistResponse.json()) as YouTubePlaylistResponse;
    const videos = (playlistData.items ?? [])
      .map((item): YouTubeFeedVideo | null => {
        const videoId = item.contentDetails?.videoId ?? item.snippet?.resourceId?.videoId;
        const title = item.snippet?.title?.trim();
        const thumbnail = bestThumbnail(item.snippet?.thumbnails);

        if (!videoId || !title || !thumbnail || title === "Private video" || title === "Deleted video") return null;

        return {
          id: videoId,
          title,
          description: item.snippet?.description?.trim() ?? "",
          publishedAt: item.snippet?.publishedAt ?? "",
          thumbnail,
          watchUrl: `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`,
          embedUrl: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`,
        };
      })
      .filter((video): video is YouTubeFeedVideo => video !== null);

    const resolvedChannelId = channel.id ?? channelId;
    return {
      status: "ready",
      channelId: resolvedChannelId,
      channelTitle: channel.snippet?.title?.trim() || DEFAULT_CHANNEL_TITLE,
      channelUrl: resolvedChannelId.startsWith("UC") ? `https://www.youtube.com/channel/${resolvedChannelId}` : DEFAULT_CHANNEL_URL,
      channelThumbnail: bestThumbnail(channel.snippet?.thumbnails),
      totalResults: playlistData.pageInfo?.totalResults ?? videos.length,
      videos,
      message: null,
    };
  } catch (error) {
    console.error("[youtube-feed] unexpected error", error);
    return emptyResult("error", channelId, "The Voice Lounge YouTube feed is temporarily unavailable.");
  }
});
