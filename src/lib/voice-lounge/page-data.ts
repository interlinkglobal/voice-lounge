import {
  creatorCard,
  episodeCard,
  liveCard,
  newsCard,
  podcastCard,
  q,
  universalSearch,
} from "@/lib/content/adapters";
import { categories, creators, liveEvents } from "@/lib/content/catalog";
import { CREATOR_PROFILE_IMAGES } from "@/lib/stock-images";
import type { MediaCardModel } from "@/lib/content/types";
import type { YouTubeFeedVideo } from "@/lib/youtube.functions";
import type { PageKey } from "@/lib/voice-lounge/routes";

const LANGUAGES = ["English", "isiZulu", "isiXhosa", "Sesotho", "Setswana", "Afrikaans"];
const PROVINCES = ["Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Free State", "Limpopo", "Mpumalanga", "North West", "Northern Cape"];
const FORMATS = ["Audio", "Video", "Hybrid"];
const MOODS = ["Quick hit", "Deep dive", "Laugh", "Learn", "Debate", "Unwind"];
const DISCOVERY_TAGS = ["New voices", "Staff picks", "Originals", "Independent", "Local stories", "Long-form"];
const YOUTUBE_LED_PAGES = new Set<PageKey>(["discover", "shows", "episodes", "watch"]);

function creatorCardsWithPortraits(offset = 0) {
  return creators.slice(0, CREATOR_PROFILE_IMAGES.length).map((item, i) => {
    const card = creatorCard(item);
    return {
      ...card,
      artwork: {
        ...card.artwork,
        src: CREATOR_PROFILE_IMAGES[(i + offset) % CREATOR_PROFILE_IMAGES.length],
        ratio: "1/1" as const,
      },
    };
  });
}

function formatYouTubeCount(value: number | null) {
  if (value === null) return "YouTube";
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M views`;
  if (value >= 1_000) return `${Math.round(value / 1000)}k views`;
  return `${value.toLocaleString("en-ZA")} views`;
}

function formatYouTubeDuration(seconds: number | null) {
  if (seconds === null) return undefined;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return hours
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
    : `${minutes}:${String(secs).padStart(2, "0")}`;
}

function youtubeCard(video: YouTubeFeedVideo, rank?: number): MediaCardModel {
  return {
    id: video.id,
    kind: "video",
    title: video.title,
    description: video.description,
    subtitle: "The Voice Lounge · YouTube",
    meta: video.publishedAt
      ? new Intl.DateTimeFormat("en-ZA", { day: "numeric", month: "short", year: "numeric" }).format(new Date(video.publishedAt))
      : "Official channel",
    stat: formatYouTubeCount(video.viewCount),
    duration: formatYouTubeDuration(video.durationSec),
    artwork: {
      seed: `youtube-${video.id}`,
      src: video.thumbnail,
      alt: video.title,
      ratio: "16/9",
    },
    href: "/youtube",
    badge: "YouTube",
    rank,
  };
}

function rotate<T>(items: T[], offset: number) {
  if (!items.length) return items;
  const shift = ((offset % items.length) + items.length) % items.length;
  return [...items.slice(shift), ...items.slice(0, shift)];
}

function youtubeCardsForSection(videos: YouTubeFeedVideo[], title: string, index: number, limit = 10): MediaCardModel[] {
  if (!videos.length) return [];
  const t = title.toLowerCase();
  let pool = [...videos];

  if (t.includes("short") || t.includes("clip")) {
    const short = pool.filter((video) => video.durationSec !== null && video.durationSec <= 180);
    if (short.length >= 3) pool = short;
  } else if (t.includes("full episode") || t.includes("long-form") || t.includes("deep-dive")) {
    const long = pool.filter((video) => video.durationSec !== null && video.durationSec >= 20 * 60);
    if (long.length >= 3) pool = long;
  }

  if (t.includes("most watched") || t.includes("trending") || t.includes("top 10") || t.includes("charts") || t.includes("most played")) {
    pool.sort((a, b) => (b.viewCount ?? -1) - (a.viewCount ?? -1));
  } else if (t.includes("latest") || t.includes("recent") || t.includes("new this") || t.includes("new ")) {
    pool.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  } else {
    pool = rotate(pool, index * 7);
  }

  return pool.slice(0, limit).map((video, rank) => youtubeCard(video, t.includes("top 10") || t.includes("charts") ? rank + 1 : undefined));
}

function youtubeSearch(videos: YouTubeFeedVideo[], query: string) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return videos;

  return videos
    .map((video) => {
      const title = video.title.toLowerCase();
      const description = video.description.toLowerCase();
      const score = terms.reduce((total, term) => {
        if (title.includes(term)) return total + 3;
        if (description.includes(term)) return total + 1;
        return total;
      }, 0);
      return { video, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || +new Date(b.video.publishedAt) - +new Date(a.video.publishedAt))
    .map((entry) => entry.video);
}

function isHomeYouTubeSection(title: string) {
  const t = title.toLowerCase();
  return [
    "trending",
    "editor",
    "new this",
    "continue",
    "top 10",
    "most watched",
    "full episodes",
    "short clips",
    "hidden gems",
    "community favourites",
  ].some((needle) => t.includes(needle));
}

function isCrossRouteVideoSection(page: PageKey, title: string) {
  const t = title.toLowerCase();
  if (YOUTUBE_LED_PAGES.has(page)) return true;
  if (page === "home" && isHomeYouTubeSection(title)) return true;
  if (page === "account" && (t.includes("watch") || t.includes("video") || t.includes("viewing"))) return true;
  return t.includes("video") || t.includes("watch") || t.includes("clip") || t.includes("studio session") || t.includes("replay");
}

export function pageCards(
  page: PageKey,
  title: string,
  index: number,
  query = "",
  youtubeVideos: YouTubeFeedVideo[] = [],
): MediaCardModel[] {
  const t = title.toLowerCase();

  if (page === "search" && query.trim()) {
    const hits = universalSearch(query).map((hit) => hit.card);
    const youtubeHits = youtubeSearch(youtubeVideos, query).map((video) => youtubeCard(video));

    if (t.includes("video")) return youtubeHits.slice(0, 12);
    if (t.includes("podcast")) return hits.filter((x) => x.kind === "podcast").slice(0, 12);
    if (t.includes("episode")) return [
      ...youtubeHits,
      ...hits.filter((x) => x.kind === "episode"),
    ].slice(0, 12);
    if (t.includes("creator")) return hits.filter((x) => x.kind === "creator").slice(0, 12);
    if (t.includes("news")) return hits.filter((x) => x.kind === "news").slice(0, 12);
    if (t.includes("live")) return hits.filter((x) => x.kind === "live").slice(0, 12);
    if (t.includes("top result")) return [...youtubeHits, ...hits.filter((x) => x.kind !== "video")].slice(0, 4);
    if (t.includes("full filterable")) return [...youtubeHits, ...hits.filter((x) => x.kind !== "video")].slice(0, 24);
  }

  if (page === "news") {
    const aliases: Array<[string, string]> = [
      ["voice lounge", "Voice Lounge"], ["creator", "Creator"], ["technology", "Technology"],
      ["business", "Business"], ["music", "Music"], ["film", "Film & Television"],
      ["sport", "Sport"], ["opinion", "Opinion"], ["features", "Features"], ["entertainment", "Entertainment"],
    ];
    const hit = aliases.find(([needle]) => t.includes(needle));
    return (hit ? q.newsBySection(hit[1], 10) : q.latestNews(12)).map((item) => newsCard(item));
  }

  if (t.includes("creator spotlight")) return creatorCardsWithPortraits(0);
  if (page === "watch" && t.includes("creator diaries")) return creatorCardsWithPortraits(3);

  if (page === "creators" || t.includes("creator") || t.includes("host") || t.includes("voices") || t.includes("contributors")) {
    return creators.slice(index % 7, (index % 7) + 10).map((item) => creatorCard(item));
  }

  if (page === "live" || t.includes("live") || t.includes("schedule") || t.includes("premiere")) {
    const rows = t.includes("currently") ? q.liveNow() : t.includes("starting") ? q.liveSoon() : t.includes("past") ? q.liveEnded() : liveEvents;
    return rows.slice(0, 10).map((item) => liveCard(item));
  }

  if (t.includes("news") || t.includes("stories") || t.includes("announcements") || t.includes("press") || t.includes("media industry")) {
    return q.latestNews(10).map((item) => newsCard(item));
  }

  if (youtubeVideos.length && isCrossRouteVideoSection(page, title)) {
    return youtubeCardsForSection(youtubeVideos, title, index, 10);
  }

  if (t.includes("continue")) return q.continueItems(10);
  if (t.includes("hidden gems")) return q.hiddenGems(10).map((item) => podcastCard(item));
  if (t.includes("original")) return q.originals(10).map((item) => podcastCard(item));
  if (t.includes("premium")) return q.premiumPodcasts(10).map((item) => podcastCard(item));
  if (t.includes("short") || t.includes("under 20")) return q.shortEpisodes(10).map((item) => episodeCard(item));
  if (t.includes("long-form") || t.includes("deep-dive")) return q.longEpisodes(10).map((item) => episodeCard(item));
  if (t.includes("audio-first")) return q.audioEpisodes(10).map((item) => episodeCard(item));
  if (t.includes("latest") || t.includes("recent") || t.includes("new this")) return q.latestEpisodes(10).map((item) => episodeCard(item));
  if (t.includes("trending") || t.includes("most played") || t.includes("top 10") || t.includes("charts") || t.includes("most watched")) {
    return q.trendingEpisodes(10).map((item, rank) => episodeCard(item, { rank: rank + 1 }));
  }

  const categoryAliases: Array<[string, string]> = [
    ["entrepreneur", "Entrepreneurship"], ["business", "Business"], ["technology", "Technology"],
    ["sport", "Sport"], ["music", "Music"], ["entertainment", "Entertainment"], ["comedy", "Comedy"],
    ["society", "Society & Culture"], ["culture", "Society & Culture"], ["education", "Education"],
    ["health", "Health & Wellness"], ["lifestyle", "Lifestyle"], ["faith", "Faith & Spirituality"],
    ["african stories", "African Stories"], ["youth", "Youth & Campus"], ["film", "Film & Television"], ["news", "News"],
  ];
  const category = categoryAliases.find(([needle]) => t.includes(needle));
  if (category) {
    const rows = q.podcastsByCategory(category[1], 10);
    if (rows.length) return rows.map((item) => podcastCard(item));
  }

  if (t.includes("podcast") || page === "podcasts" || page === "categories") {
    return q.topPodcasts(10).map((item, rank) => podcastCard(item, { rank: rank + 1 }));
  }

  const mixed = [
    ...q.latestEpisodes(6).map((item) => episodeCard(item)),
    ...q.topPodcasts(6).map((item) => podcastCard(item)),
  ];
  const shift = index % mixed.length;
  return [...mixed.slice(shift), ...mixed.slice(0, shift)].slice(0, 10);
}

export function chipsFor(title: string) {
  const t = title.toLowerCase();
  const rows = t.includes("language") ? LANGUAGES
    : t.includes("province") || t.includes("region") ? PROVINCES
      : t.includes("format") ? FORMATS
        : t.includes("mood") ? MOODS
          : t.includes("categor") || t.includes("topic") ? categories.map((c) => c.name)
            : t.includes("duration") ? ["Under 20 min", "20–45 min", "45–90 min", "90+ min"]
              : t.includes("date") ? ["Today", "This week", "This month", "This year"]
                : t.includes("popularity") ? ["Trending", "Most played", "Most saved", "Editors' picks"]
                  : DISCOVERY_TAGS;
  return rows.slice(0, 18).map((label) => ({ label, to: t.includes("categor") ? "/categories" : "/search" }));
}
