export function extractYouTubeVideoId(input: string) {
  const value = input.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(value)) return value;

  const iframeMatch = value.match(/src=["']([^"']+)["']/i);
  const source = iframeMatch?.[1] ?? value;

  try {
    const url = new URL(source.startsWith("//") ? `https:${source}` : source);
    if (url.hostname === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
    }

    if (url.hostname.endsWith("youtube.com") || url.hostname.endsWith("youtube-nocookie.com")) {
      const queryId = url.searchParams.get("v");
      if (queryId && /^[A-Za-z0-9_-]{11}$/.test(queryId)) return queryId;

      const parts = url.pathname.split("/").filter(Boolean);
      const marker = parts.findIndex((part) => ["embed", "shorts", "live"].includes(part));
      const id = marker >= 0 ? parts[marker + 1] : null;
      return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
    }
  } catch {
    return null;
  }

  return null;
}

export function youtubeWatchUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
}

export function youtubeEmbedUrl(videoId: string) {
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`;
}

export function youtubeThumbnailUrl(videoId: string) {
  return `https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg`;
}

export async function resolveYouTubeMetadata(input: string) {
  const videoId = extractYouTubeVideoId(input);
  if (!videoId) return null;

  const watchUrl = youtubeWatchUrl(videoId);
  let title = `YouTube video ${videoId}`;
  let thumbnailUrl = youtubeThumbnailUrl(videoId);

  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`,
      { headers: { Accept: "application/json" }, cache: "no-store" },
    );
    if (response.ok) {
      const payload = (await response.json()) as { title?: string; thumbnail_url?: string };
      if (payload.title?.trim()) title = payload.title.trim();
      if (payload.thumbnail_url?.trim()) thumbnailUrl = payload.thumbnail_url.trim();
    }
  } catch {
    // YouTube metadata enrichment is optional; the video ID is sufficient.
  }

  return {
    videoId,
    title,
    thumbnailUrl,
    watchUrl,
    embedUrl: youtubeEmbedUrl(videoId),
  };
}
