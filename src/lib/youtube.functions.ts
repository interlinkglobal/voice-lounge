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
  durationSec: number | null;
  viewCount: number | null;
  likeCount: number | null;
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

interface YouTubePlaylistItem {
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
}

interface YouTubePlaylistResponse {
  nextPageToken?: string;
  pageInfo?: {
    totalResults?: number;
  };
  items?: YouTubePlaylistItem[];
}

interface YouTubeVideosResponse {
  items?: Array<{
    id?: string;
    contentDetails?: {
      duration?: string;
    };
    statistics?: {
      viewCount?: string;
      likeCount?: string;
    };
  }>;
}

const DEFAULT_CHANNEL_TITLE = "The Voice Lounge";
const DEFAULT_CHANNEL_URL = "https://www.youtube.com/@THEVOICELOUNGE";
const READY_CACHE_MS = 5 * 60 * 1000;

let readyCache:
  | {
      channelId: string;
      expiresAt: number;
      value: YouTubeFeedResult;
    }
  | null = null;

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

function parseCount(value?: string): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseIsoDuration(value?: string): number | null {
  if (!value) return null;
  const match = value.match(/^P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!match) return null;
  const days = Number(match[1] ?? 0);
  const hours = Number(match[2] ?? 0);
  const minutes = Number(match[3] ?? 0);
  const seconds = Number(match[4] ?? 0);
  return days * 86400 + hours * 3600 + minutes * 60 + seconds;
}

async function fetchAllUploads(apiKey: string, playlistId: string) {
  const items: YouTubePlaylistItem[] = [];
  let totalResults = 0;
  let pageToken = "";
  const seenTokens = new Set<string>();

  do {
    const playlistUrl = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
    playlistUrl.searchParams.set("part", "snippet,contentDetails");
    playlistUrl.searchParams.set("playlistId", playlistId);
    playlistUrl.searchParams.set("maxResults", "50");
    playlistUrl.searchParams.set("key", apiKey);
    if (pageToken) playlistUrl.searchParams.set("pageToken", pageToken);

    const response = await fetch(playlistUrl, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`playlistItems.list failed with HTTP ${response.status}`);

    const data = (await response.json()) as YouTubePlaylistResponse;
    if (data.pageInfo?.totalResults) totalResults = data.pageInfo.totalResults;
    items.push(...(data.items ?? []));

    const next = data.nextPageToken ?? "";
    if (!next || seenTokens.has(next)) break;
    seenTokens.add(next);
    pageToken = next;
  } while (pageToken);

  return { items, totalResults: totalResults || items.length };
}

async function fetchVideoDetails(apiKey: string, videoIds: string[]) {
  const details = new Map<string, { durationSec: number | null; viewCount: number | null; likeCount: number | null }>();

  for (let start = 0; start < videoIds.length; start += 50) {
    const ids = videoIds.slice(start, start + 50);
    if (!ids.length) continue;

    const url = new URL("https://www.googleapis.com/youtube/v3/videos");
    url.searchParams.set("part", "contentDetails,statistics");
    url.searchParams.set("id", ids.join(","));
    url.searchParams.set("key", apiKey);

    const response = await fetch(url, { headers: { Accept: "application/json" } });
    if (!response.ok) {
      console.warn(`[youtube-feed] videos.list enrichment failed with HTTP ${response.status}`);
      continue;
    }

    const data = (await response.json()) as YouTubeVideosResponse;
    for (const item of data.items ?? []) {
      if (!item.id) continue;
      details.set(item.id, {
        durationSec: parseIsoDuration(item.contentDetails?.duration),
        viewCount: parseCount(item.statistics?.viewCount),
        likeCount: parseCount(item.statistics?.likeCount),
      });
    }
  }

  return details;
}

export const getYouTubeFeed = createServerFn({ method: "GET" }).handler(async (): Promise<YouTubeFeedResult> => {
  const apiKey = process.env.YOUTUBE_DATA_API_KEY?.trim() ?? "";
  const channelId = process.env.CHANNEL_ID?.trim() ?? "";

  if (!apiKey || !channelId) {
    return emptyResult(
      "unconfigured",
      channelId,
      "YouTube feed integration is ready. Add YOUTUBE_DATA_API_KEY and CHANNEL_ID to the deployment environment to populate it.",
    );
  }

  if (readyCache && readyCache.channelId === channelId && readyCache.expiresAt > Date.now()) {
    return readyCache.value;
  }

  try {
    const channelUrl = new URL("https://www.googleapis.com/youtube/v3/channels");
    channelUrl.searchParams.set("part", "snippet,contentDetails");
    channelUrl.searchParams.set(channelId.startsWith("@") ? "forHandle" : "id", channelId);
    channelUrl.searchParams.set("key", apiKey);

    const channelResponse = await fetch(channelUrl, { headers: { Accept: "application/json" } });
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

    const playlistData = await fetchAllUploads(apiKey, uploadsPlaylistId);
    const baseVideos = playlistData.items
      .map((item) => {
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
        };
      })
      .filter((video): video is NonNullable<typeof video> => video !== null);

    const details = await fetchVideoDetails(apiKey, baseVideos.map((video) => video.id));
    const videos: YouTubeFeedVideo[] = baseVideos.map((video) => {
      const detail = details.get(video.id);
      return {
        ...video,
        watchUrl: `https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}`,
        embedUrl: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.id)}`,
        durationSec: detail?.durationSec ?? null,
        viewCount: detail?.viewCount ?? null,
        likeCount: detail?.likeCount ?? null,
      };
    });

    const resolvedChannelId = channel.id ?? channelId;
    const result: YouTubeFeedResult = {
      status: "ready",
      channelId: resolvedChannelId,
      channelTitle: channel.snippet?.title?.trim() || DEFAULT_CHANNEL_TITLE,
      channelUrl: resolvedChannelId.startsWith("UC") ? `https://www.youtube.com/channel/${resolvedChannelId}` : DEFAULT_CHANNEL_URL,
      channelThumbnail: bestThumbnail(channel.snippet?.thumbnails),
      totalResults: playlistData.totalResults,
      videos,
      message: null,
    };

    readyCache = { channelId, expiresAt: Date.now() + READY_CACHE_MS, value: result };
    return result;
  } catch (error) {
    console.error("[youtube-feed] unexpected error", error);
    return emptyResult("error", channelId, "The Voice Lounge YouTube feed is temporarily unavailable.");
  }
});
