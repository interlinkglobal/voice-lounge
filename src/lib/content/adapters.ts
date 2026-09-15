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
  const h = Math.floor(sec / 3600);
  const m = Math.round((sec % 3600) / 60);
  return h ? `${h}h ${m}m` : `${m} min`;
}

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1000)}k`;
  return String(n);
}

const SA_DATE = new Intl.DateTimeFormat("en-ZA", { day: "numeric", month: "short", year: "numeric" });

export function formatDate(iso: string): string {
  return SA_DATE.format(new Date(iso));
}

export function relativeDate(iso: string): string {
  const days = Math.round((Date.UTC(2026, 8, 15) - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.round(days / 7)} weeks ago`;
  return formatDate(iso);
}

/* ---------- entity -> card ---------- */

export function episodeCard(e: Episode, opts: { progress?: number; rank?: number } = {}): MediaCardModel {
  const pod = podcastById(e.podcastId);
  return {
    id: e.id,
    kind: e.kind === "video" ? "video" : "episode",
    title: e.title,
    description: e.description,
    subtitle: pod?.title,
    category: categoryById(pod?.categoryId ?? "")?.name,
    duration: formatDuration(e.durationSec),
    meta: relativeDate(e.publishedAt),
    stat: `${formatCount(e.plays)} plays`,
    artwork: e.artwork,
    href: `/episodes/${e.slug}`,
    premium: e.isPremium,
    progress: opts.progress,
    rank: opts.rank,
    badge: e.kind === "video" ? "Video" : undefined,
  };
}

export function podcastCard(p: Podcast, opts: { rank?: number } = {}): MediaCardModel {
  return {
    id: p.id,
    kind: "podcast",
    title: p.title,
    description: p.tagline,
    subtitle: creatorById(p.creatorId)?.name,
    category: categoryById(p.categoryId)?.name,
    meta: `${p.episodeCount} episodes · ${p.language}`,
    stat: `${formatCount(p.plays)} plays`,
    artwork: p.artwork,
    href: `/podcasts/${p.slug}`,
    premium: p.isPremium,
    badge: p.isOriginal ? "Original" : undefined,
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
    meta: `${c.city} · ${c.province}`,
    stat: `${formatCount(c.followers)} followers`,
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
    meta: `${relativeDate(n.publishedAt)} · ${n.readingMinutes} min read`,
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
        ? `On air · ${formatCount(l.listeners)} listening`
        : l.status === "ended"
          ? "Replay available"
          : new Intl.DateTimeFormat("en-ZA", { weekday: "short", hour: "2-digit", minute: "2-digit" }).format(
              new Date(l.startsAt),
            ),
    artwork: l.artwork,
    href: `/live/${l.slug}`,
    live: l.status === "live",
    badge: l.status === "live" ? "Live" : l.status === "soon" ? "Starting soon" : undefined,
  };
}

/* ---------- query helpers (the "data service" layer) ---------- */

const byPlays = (a: { plays: number }, b: { plays: number }) => b.plays - a.plays;
const byDate = (a: { publishedAt: string }, b: { publishedAt: string }) =>
  +new Date(b.publishedAt) - +new Date(a.publishedAt);

export const q = {
  trendingEpisodes: (n = 12) => [...episodes].sort(byPlays).slice(0, n),
  latestEpisodes: (n = 12) => [...episodes].sort(byDate).slice(0, n),
  videoEpisodes: (n = 12) => episodes.filter((e) => e.kind === "video").slice(0, n),
  audioEpisodes: (n = 12) => episodes.filter((e) => e.kind === "audio").slice(0, n),
  shortEpisodes: (n = 12) => episodes.filter((e) => e.durationSec <= 20 * 60).slice(0, n),
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
  topPodcasts: (n = 10) => [...podcasts].sort(byPlays).slice(0, n),
  originals: (n = 12) => podcasts.filter((p) => p.isOriginal).slice(0, n),
  premiumPodcasts: (n = 12) => podcasts.filter((p) => p.isPremium).slice(0, n),
  hiddenGems: (n = 12) => [...podcasts].sort((a, b) => a.plays - b.plays).slice(0, n),
  byLanguage: (lang: string, n = 12) => podcasts.filter((p) => p.language === lang).slice(0, n),
  byProvince: (prov: string, n = 12) => podcasts.filter((p) => p.province === prov).slice(0, n),
  byFormat: (fmt: string, n = 12) => podcasts.filter((p) => p.format === fmt).slice(0, n),
  continueItems: (n = 8) =>
    episodes.slice(3, 3 + n).map((e, i) => episodeCard(e, { progress: 12 + ((i * 17) % 80) })),
  liveNow: () => liveEvents.filter((l) => l.status === "live"),
  liveSoon: () => liveEvents.filter((l) => l.status === "soon"),
  liveScheduled: () => liveEvents.filter((l) => l.status === "scheduled"),
  liveEnded: () => liveEvents.filter((l) => l.status === "ended"),
  newsBySection: (section: string, n = 6) => news.filter((a) => a.section === section).slice(0, n),
  latestNews: (n = 8) => [...news].sort(byDate).slice(0, n),
  creatorsSlice: (from: number, n = 10) => creators.slice(from, from + n),
  collections: () => collections,
};

/* ---------- universal search ---------- */

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
    if (s) hits.push({ card: podcastCard(p), score: s, type: "Podcast" });
  });
  episodes.forEach((e) => {
    const s = score(e.title, 1.1) + score(e.description, 0.4);
    if (s) hits.push({ card: episodeCard(e), score: s, type: e.kind === "video" ? "Video" : "Episode" });
  });
  creators.forEach((c) => {
    const s = score(c.name, 1.3) + score(c.role, 0.5) + score(c.bio, 0.25);
    if (s) hits.push({ card: creatorCard(c), score: s, type: "Creator" });
  });
  news.forEach((n) => {
    const s = score(n.headline, 1.2) + score(n.standfirst, 0.4);
    if (s) hits.push({ card: newsCard(n), score: s, type: "News" });
  });
  liveEvents.forEach((l) => {
    const s = score(l.title, 1.1) + score(l.description, 0.3);
    if (s) hits.push({ card: liveCard(l), score: s, type: "Live" });
  });
  categories.forEach((c) => {
    const s = score(c.name, 1.2) + score(c.blurb, 0.3);
    if (s)
      hits.push({
        card: {
          id: c.id,
          kind: "collection",
          title: c.name,
          description: c.blurb,
          meta: `${c.count} shows`,
          artwork: { seed: `cat-${c.name}`, alt: c.name, ratio: "16/9" },
          href: `/categories/${c.slug}`,
        },
        score: s,
        type: "Category",
      });
  });
  return hits.sort((a, b) => b.score - a.score);
}
