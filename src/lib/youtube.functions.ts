import { createServerFn } from "@tanstack/react-start";

export type YouTubeFeedStatus = "loading" | "ready" | "unconfigured" | "error";

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
  liveBroadcastContent: "live" | "upcoming" | "none";
  wasLive: boolean;
}

export interface YouTubeComment {
  id: string;
  authorName: string;
  authorImage: string | null;
  authorChannelUrl: string | null;
  text: string;
  likeCount: number;
  publishedAt: string;
  videoId: string | null;
  source: "youtube";
}

export interface YouTubeFeedResult {
  status: YouTubeFeedStatus;
  channelId: string;
  channelTitle: string;
  channelUrl: string;
  channelThumbnail: string | null;
  totalResults: number;
  videos: YouTubeFeedVideo[];
  comments: YouTubeComment[];
  message: string | null;
}

interface YouTubeThumbnail {
  url?: string | undefined;
  width?: number | undefined;
  height?: number | undefined;
}

type YouTubeThumbnailSet = Partial<Record<"default" | "medium" | "high" | "standard" | "maxres", YouTubeThumbnail>>;

interface YouTubeChannelResponse {
  items?: Array<{
    id?: string | undefined;
    snippet?: {
      title?: string | undefined;
      thumbnails?: YouTubeThumbnailSet | undefined;
    };
    contentDetails?: {
      relatedPlaylists?: {
        uploads?: string | undefined;
      };
    };
  }>;
}

interface YouTubePlaylistItem {
  snippet?: {
    title?: string | undefined;
    description?: string | undefined;
    publishedAt?: string | undefined;
    thumbnails?: YouTubeThumbnailSet | undefined;
    resourceId?: {
      videoId?: string | undefined;
    };
  };
  contentDetails?: {
    videoId?: string | undefined;
  };
}

interface YouTubePlaylistResponse {
  nextPageToken?: string | undefined;
  pageInfo?: {
    totalResults?: number | undefined;
  };
  items?: YouTubePlaylistItem[] | undefined;
}


interface YouTubeCommentThreadsResponse {
  items?: Array<{
    id?: string | undefined;
    snippet?: {
      videoId?: string | undefined;
      topLevelComment?: {
        id?: string | undefined;
        snippet?: {
          authorDisplayName?: string | undefined;
          authorProfileImageUrl?: string | undefined;
          authorChannelUrl?: string | undefined;
          textOriginal?: string | undefined;
          likeCount?: number | undefined;
          publishedAt?: string | undefined;
        };
      };
    };
  }>;
}

interface YouTubeVideosResponse {
  items?: Array<{
    id?: string | undefined;
    snippet?: {
      liveBroadcastContent?: "live" | "upcoming" | "none" | undefined;
    };
    contentDetails?: {
      duration?: string | undefined;
    };
    statistics?: {
      viewCount?: string | undefined;
      likeCount?: string | undefined;
    };
    liveStreamingDetails?: {
      actualStartTime?: string | undefined;
      actualEndTime?: string | undefined;
      scheduledStartTime?: string | undefined;
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
    comments: [],
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
  const details = new Map<string, {
    durationSec: number | null;
    viewCount: number | null;
    likeCount: number | null;
    liveBroadcastContent: "live" | "upcoming" | "none";
    wasLive: boolean;
  }>();

  for (let start = 0; start < videoIds.length; start += 50) {
    const ids = videoIds.slice(start, start + 50);
    if (!ids.length) continue;

    const url = new URL("https://www.googleapis.com/youtube/v3/videos");
    url.searchParams.set("part", "snippet,contentDetails,statistics,liveStreamingDetails");
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
        liveBroadcastContent: item.snippet?.liveBroadcastContent ?? "none",
        wasLive: Boolean(item.liveStreamingDetails?.actualStartTime || item.liveStreamingDetails?.actualEndTime),
      });
    }
  }

  return details;
}


async function fetchRecentChannelComments(apiKey: string, channelId: string): Promise<YouTubeComment[]> {
  const url = new URL("https://www.googleapis.com/youtube/v3/commentThreads");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("allThreadsRelatedToChannelId", channelId);
  url.searchParams.set("maxResults", "50");
  url.searchParams.set("order", "time");
  url.searchParams.set("textFormat", "plainText");
  url.searchParams.set("key", apiKey);

  try {
    const response = await fetch(url, { headers: { Accept: "application/json" } });
    if (!response.ok) {
      console.warn(`[youtube-feed] commentThreads.list failed with HTTP ${response.status}`);
      return [];
    }

    const data = (await response.json()) as YouTubeCommentThreadsResponse;
    return (data.items ?? [])
      .map((item) => {
        const comment = item.snippet?.topLevelComment;
        const snippet = comment?.snippet;
        const id = comment?.id ?? item.id;
        const authorName = snippet?.authorDisplayName?.trim();
        const text = snippet?.textOriginal?.trim();
        if (!id || !snippet || !authorName || !text) return null;
        return {
          id,
          authorName,
          authorImage: snippet.authorProfileImageUrl ?? null,
          authorChannelUrl: snippet.authorChannelUrl ?? null,
          text,
          likeCount: snippet.likeCount ?? 0,
          publishedAt: snippet.publishedAt ?? "",
          videoId: item.snippet?.videoId ?? null,
          source: "youtube" as const,
        };
      })
      .filter((comment): comment is NonNullable<typeof comment> => comment !== null);
  } catch (error) {
    console.warn("[youtube-feed] recent comments could not be loaded", error);
    return [];
  }
}

export const getYouTubeFeed = createServerFn({ method: "GET" }).handler(async (): Promise<YouTubeFeedResult> => {
  const apiKey = process.env["YOUTUBE_DATA_API_KEY"]?.trim() ?? "";
  const channelId = process.env["CHANNEL_ID"]?.trim() ?? "";

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

    const [playlistData, comments] = await Promise.all([
      fetchAllUploads(apiKey, uploadsPlaylistId),
      fetchRecentChannelComments(apiKey, channel.id ?? channelId),
    ]);
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
        liveBroadcastContent: detail?.liveBroadcastContent ?? "none",
        wasLive: detail?.wasLive ?? false,
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
      comments,
      message: null,
    };

    readyCache = { channelId, expiresAt: Date.now() + READY_CACHE_MS, value: result };
    return result;
  } catch (error) {
    console.error("[youtube-feed] unexpected error", error);
    return emptyResult("error", channelId, "The Voice Lounge YouTube feed is temporarily unavailable.");
  }
});


export interface YouTubeLiveStatus {
  configured: boolean;
  isLive: boolean;
  channelId: string;
  videoId: string | null;
  title: string | null;
  permanentEmbedUrl: string | null;
  videoEmbedUrl: string | null;
  checkedAt: string;
}

export const getYouTubeLiveStatus = createServerFn({ method: "GET" }).handler(async (): Promise<YouTubeLiveStatus> => {
  const apiKey = process.env["YOUTUBE_DATA_API_KEY"]?.trim() ?? "";
  const configuredChannel = process.env["CHANNEL_ID"]?.trim() ?? "";
  const checkedAt = new Date().toISOString();

  const empty = (configured: boolean, channelId = configuredChannel): YouTubeLiveStatus => ({
    configured,
    isLive: false,
    channelId,
    videoId: null,
    title: null,
    permanentEmbedUrl: channelId.startsWith("UC")
      ? `https://www.youtube.com/embed/live_stream?channel=${encodeURIComponent(channelId)}`
      : null,
    videoEmbedUrl: null,
    checkedAt,
  });

  if (!apiKey || !configuredChannel) return empty(false);

  try {
    // Avoid search.list (100 quota units/call). Resolve the channel once per poll,
    // inspect only the newest uploads (playlistItems.list = 1 unit), then enrich
    // those IDs with videos.list (1 unit) to detect liveBroadcastContent.
    const channelUrl = new URL("https://www.googleapis.com/youtube/v3/channels");
    channelUrl.searchParams.set("part", "snippet,contentDetails");
    channelUrl.searchParams.set(configuredChannel.startsWith("@") ? "forHandle" : "id", configuredChannel);
    channelUrl.searchParams.set("key", apiKey);

    const channelResponse = await fetch(channelUrl, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!channelResponse.ok) throw new Error(`channels.list failed with HTTP ${channelResponse.status}`);

    const channelData = (await channelResponse.json()) as YouTubeChannelResponse;
    const channel = channelData.items?.[0];
    const resolvedChannelId = channel?.id ?? configuredChannel;
    const uploadsPlaylistId = channel?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsPlaylistId) return empty(true, resolvedChannelId);

    const playlistUrl = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
    playlistUrl.searchParams.set("part", "snippet,contentDetails");
    playlistUrl.searchParams.set("playlistId", uploadsPlaylistId);
    playlistUrl.searchParams.set("maxResults", "10");
    playlistUrl.searchParams.set("key", apiKey);

    const playlistResponse = await fetch(playlistUrl, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!playlistResponse.ok) throw new Error(`playlistItems.list failed with HTTP ${playlistResponse.status}`);

    const playlistData = (await playlistResponse.json()) as YouTubePlaylistResponse;
    const ids = (playlistData.items ?? [])
      .map((item) => item.contentDetails?.videoId ?? item.snippet?.resourceId?.videoId)
      .filter((id): id is string => Boolean(id));

    const permanentEmbedUrl = resolvedChannelId.startsWith("UC")
      ? `https://www.youtube.com/embed/live_stream?channel=${encodeURIComponent(resolvedChannelId)}`
      : null;

    if (!ids.length) {
      return { ...empty(true, resolvedChannelId), permanentEmbedUrl };
    }

    const videosUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
    videosUrl.searchParams.set("part", "snippet,liveStreamingDetails");
    videosUrl.searchParams.set("id", ids.join(","));
    videosUrl.searchParams.set("key", apiKey);

    const videosResponse = await fetch(videosUrl, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!videosResponse.ok) throw new Error(`videos.list failed with HTTP ${videosResponse.status}`);

    const videosData = (await videosResponse.json()) as {
      items?: Array<{
        id?: string | undefined;
        snippet?: { title?: string; liveBroadcastContent?: "live" | "upcoming" | "none" };
        liveStreamingDetails?: { actualStartTime?: string; actualEndTime?: string };
      }>;
    };
    const live = (videosData.items ?? []).find(
      (item) =>
        item.snippet?.liveBroadcastContent === "live"
        || (Boolean(item.liveStreamingDetails?.actualStartTime) && !item.liveStreamingDetails?.actualEndTime),
    );
    const videoId = live?.id ?? null;

    return {
      configured: true,
      isLive: Boolean(videoId),
      channelId: resolvedChannelId,
      videoId,
      title: live?.snippet?.title?.trim() ?? null,
      permanentEmbedUrl,
      videoEmbedUrl: videoId
        ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`
        : null,
      checkedAt,
    };
  } catch (error) {
    console.warn("[youtube-live] live status check failed", error);
    return empty(true);
  }
});
