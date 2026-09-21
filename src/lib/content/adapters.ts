import {
  categories,
  categoryById,
  collections,
  creatorById,
  creators,
  episodes,
  liveEvents,
  news,
  podcastById,
  podcasts,
} from "./catalog";
import type { Creator, Episode, LiveEvent, NewsArticle, Podcast, MediaCardModel } from "./types";

export function formatDuration(sec: number): string {
  if (!Number.isFinite(sec) || sec <= 0) return "";
  const h = Math.floor(sec / 3600);
  const m = Math.round((sec % 3600) / 60);
  return h ? `${h}h ${m}m` : `${m} min`;
}

export function formatCount(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1000)}k`;
  return String(n);
}

const SA_DATE = new Intl.DateTimeFormat("en-ZA", { day: "numeric", month: "short", year: "numeric" });

export function formatDate(iso: string): string {
  if (!iso) return "Date not published";
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "Date not published" : SA_DATE.format(date);
}

export function relativeDate(iso: string): string {
  if (!iso) return "Date not published";
  const time = new Date(iso).getTime();
  if (!Number.isFinite(time)) return "Date not published";
  const days = Math.max(0, Math.round((Date.now() - time) / 86400000));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.round(days / 7)} weeks ago`;
  return formatDate(iso);
}

export function episodeCard(e: Episode, opts: { progress?: number; rank?: number } = {}): MediaCardModel {
  const pod = podcastById(e.podcastId);
  return {
    id: e.id,
    kind: e.kind === "video" ? "video" : "episode",
    title: e.title,
    description: e.description,
    subtitle: pod?.title ?? "The Voice Lounge",
    category: categoryById(pod?.categoryId ?? "")?.name,
    duration: e.durationSec > 0 ? formatDuration(e.durationSec) : undefined,
    meta: e.publishedAt ? relativeDate(e.publishedAt) : "Date not published",
    stat: e.plays > 0 ? `${formatCount(e.plays)} plays` : undefined,
    artwork: e.artwork,
    href: `/episodes/${e.slug}`,
    premium: e.isPremium,
    progress: opts.progress,
    rank: opts.rank,
    badge: e.kind === "video" ? "Video" : undefined,
  };
}

export function podcastCard(p: Podcast, opts: { rank?: number } = {}): MediaCardModel {
  const meta = [p.episodeCount > 0 ? `${p.episodeCount} episodes` : "", p.language].filter(Boolean).join(" · ");
  return {
    id: p.id,
    kind: "podcast",
    title: p.title,
    description: p.tagline,
    subtitle: creatorById(p.creatorId)?.name ?? "The Voice Lounge",
    category: categoryById(p.categoryId)?.name,
    meta: meta || "Official Voice Lounge programme",
    stat: p.plays > 0 ? `${formatCount(p.plays)} plays` : undefined,
    artwork: p.artwork,
    href: `/podcasts/${p.slug}`,
    premium: p.isPremium,
    badge: p.isOriginal ? "Voice Lounge" : undefined,
    rank: opts.rank,
  };
}

export function creatorCard(c: Creator): MediaCardModel {
  return {
    id: c.id,
    kind: "creator",
    title: c.name,
    description: c.bio,
    subtitle: c.role,
    meta: c.city && c.province ? `${c.city} · ${c.province}` : "The Voice Lounge",
    stat: c.followers > 0 ? `${formatCount(c.followers)} followers` : undefined,
    artwork: c.artwork,
    href: `/creators/${c.slug}`,
  };
}

export function newsCard(n: NewsArticle): MediaCardModel {
  return {
    id: n.id,
    kind: "news",
    title: n.headline,
    description: n.standfirst,
    subtitle: n.author,
    category: n.section,
    meta: `${formatDate(n.publishedAt)} · ${n.readingMinutes} min read`,
    artwork: n.artwork,
    href: `/news/${n.slug}`,
  };
}

export function liveCard(l: LiveEvent): MediaCardModel {
  return {
    id: l.id,
    kind: "live",
    title: l.title,
    description: l.description,
    subtitle: l.host,
    category: l.strand,
    meta:
      l.status === "live"
        ? "On air"
        : l.status === "ended"
          ? "Replay"
          : l.startsAt
            ? new Intl.DateTimeFormat("en-ZA", { weekday: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(l.startsAt))
            : "Schedule pending",
    artwork: l.artwork,
    href: `/live/${l.slug}`,
    live: l.status === "live",
    badge: l.status === "live" ? "Live" : l.status === "soon" ? "Starting soon" : undefined,
  };
}

const byDate = (a: { publishedAt: string }, b: { publishedAt: string }) => {
  const at = a.publishedAt ? +new Date(a.publishedAt) : 0;
  const bt = b.publishedAt ? +new Date(b.publishedAt) : 0;
  return bt - at;
};

export const q = {
  trendingEpisodes: (n = 12) => episodes.slice(0, n),
  latestEpisodes: (n = 12) => [...episodes].sort(byDate).slice(0, n),
  videoEpisodes: (n = 12) => episodes.filter((e) => e.kind === "video").slice(0, n),
  audioEpisodes: (n = 12) => episodes.filter((e) => e.kind === "audio").slice(0, n),
  shortEpisodes: (n = 12) => episodes.filter((e) => e.durationSec > 0 && e.durationSec <= 20 * 60).slice(0, n),
  longEpisodes: (n = 12) => episodes.filter((e) => e.durationSec >= 75 * 60).slice(0, n),
  episodesByCategory: (name: string, n = 12) => {
    const cat = categories.find((c) => c.name === name);
    const ids = podcasts.filter((p) => p.categoryId === cat?.id).map((p) => p.id);
    return episodes.filter((e) => ids.includes(e.podcastId)).slice(0, n);
  },
  podcastsByCategory: (name: string, n = 12) => {
    const cat = categories.find((c) => c.name === name);
    return podcasts.filter((p) => p.categoryId === cat?.id).slice(0, n);
  },
  topPodcasts: (n = 10) => podcasts.slice(0, n),
  originals: (n = 12) => podcasts.filter((p) => p.isOriginal).slice(0, n),
  premiumPodcasts: (n = 12) => podcasts.filter((p) => p.isPremium).slice(0, n),
  hiddenGems: (n = 12) => podcasts.slice(-n),
  byLanguage: (lang: string, n = 12) => podcasts.filter((p) => p.language === lang).slice(0, n),
  byProvince: (prov: string, n = 12) => podcasts.filter((p) => p.province === prov).slice(0, n),
  byFormat: (fmt: string, n = 12) => podcasts.filter((p) => p.format === fmt).slice(0, n),
  continueItems: (_n = 10) => [],
  liveNow: () => liveEvents.filter((l) => l.status === "live"),
  liveSoon: () => liveEvents.filter((l) => l.status === "soon"),
  liveScheduled: () => liveEvents.filter((l) => l.status === "scheduled"),
  liveEnded: () => liveEvents.filter((l) => l.status === "ended"),
  newsBySection: (section: string, n = 6) => news.filter((a) => a.section === section).slice(0, n),
  latestNews: (n = 8) => [...news].sort(byDate).slice(0, n),
  creatorsSlice: (from: number, n = 10) => creators.slice(from, from + n),
  collections: () => collections,
};

export interface SearchHit {
  card: MediaCardModel;
  score: number;
  type: string;
}

export function universalSearch(term: string): SearchHit[] {
  const t = term.trim().toLowerCase();
  if (!t) return [];
  const score = (hay: string, weight: number) => {
    const h = hay.toLowerCase();
    if (h === t) return 100 * weight;
    if (h.startsWith(t)) return 60 * weight;
    if (h.includes(t)) return 30 * weight;
    return 0;
  };
  const hits: SearchHit[] = [];
  podcasts.forEach((p) => {
    const s = score(p.title, 1.4) + score(p.tagline, 0.6) + score(p.description, 0.3);
    if (s) hits.push({ card: podcastCard(p), score: s, type: "Show" });
  });
  episodes.forEach((e) => {
    const s = score(e.title, 1.1) + score(e.description, 0.4);
    if (s) hits.push({ card: episodeCard(e), score: s, type: e.kind === "video" ? "Video" : "Episode" });
  });
  creators.forEach((c) => {
    const s = score(c.name, 1.3) + score(c.role, 0.5) + score(c.bio, 0.25);
    if (s) hits.push({ card: creatorCard(c), score: s, type: "Presenter" });
  });
  news.forEach((n) => {
    const s = score(n.headline, 1.2) + score(n.standfirst, 0.4);
    if (s) hits.push({ card: newsCard(n), score: s, type: "Press" });
  });
  categories.forEach((c) => {
    const s = score(c.name, 1.2) + score(c.blurb, 0.3);
    if (s) hits.push({
      card: {
        id: c.id,
        kind: "collection",
        title: c.name,
        description: c.blurb,
        meta: `${c.count} programmes`,
        artwork: { seed: `show-category-${c.slug}`, alt: c.name, ratio: "16/9" },
        href: `/categories/${c.slug}`,
      },
      score: s,
      type: "Category",
    });
  });
  return hits.sort((a, b) => b.score - a.score);
}
