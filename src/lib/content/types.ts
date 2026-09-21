/**
 * The Voice Lounge — content model.
 *
 * Every entity is a plain, SSR-serialisable DTO so seeded demonstration
 * content can be swapped for a real backend (Lovable Cloud / API) without
 * touching the presentation layer.
 *
 * Optional fields are written as `T | undefined` on purpose: the project
 * compiles with `exactOptionalPropertyTypes`, so a caller passing an
 * explicit `undefined` (which adapters and mappers do constantly) has to be
 * legal.
 */

export type MediaKind = "podcast" | "show" | "episode" | "video" | "live" | "news" | "creator" | "collection";

export type SALanguage = "English" | "isiZulu" | "isiXhosa" | "Sesotho" | "Setswana" | "Afrikaans";

export type Province =
  | "Gauteng"
  | "Western Cape"
  | "KwaZulu-Natal"
  | "Eastern Cape"
  | "Free State"
  | "Limpopo"
  | "Mpumalanga"
  | "North West"
  | "Northern Cape";

export interface Artwork {
  /** Deterministic seed used to render procedural artwork. */
  seed: string;
  /** Optional real image URL — replaces procedural artwork when present. */
  src?: string | undefined;
  alt: string;
  ratio?: "16/9" | "1/1" | "4/5" | "3/2" | undefined;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  blurb: string;
  accent: "green" | "gold" | "ink";
  count: number;
}

export interface Creator {
  id: string;
  slug: string;
  name: string;
  role: string;
  city: string;
  province: Province;
  bio: string;
  followers: number;
  shows: string[];
  artwork: Artwork;
  verified?: boolean | undefined;
}

export interface Podcast {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  categoryId: string;
  creatorId: string;
  language: SALanguage;
  province: Province;
  format: "Audio" | "Video" | "Hybrid";
  episodeCount: number;
  rating: number;
  plays: number;
  isOriginal?: boolean | undefined;
  isPremium?: boolean | undefined;
  artwork: Artwork;
}

export interface Episode {
  id: string;
  slug: string;
  title: string;
  description: string;
  podcastId: string;
  number: number;
  season: number;
  durationSec: number;
  publishedAt: string;
  kind: "audio" | "video";
  plays: number;
  language: SALanguage;
  artwork: Artwork;
  mediaUrl: string;
  transcriptAvailable: boolean;
  isPremium?: boolean | undefined;
}

export interface NewsArticle {
  id: string;
  slug: string;
  headline: string;
  standfirst: string;
  body: string[];
  section: string;
  author: string;
  publishedAt: string;
  readingMinutes: number;
  artwork: Artwork;
  sourceLabel?: string | undefined;
  sourceUrl?: string | undefined;
  featured?: boolean | undefined;
}

export interface LiveEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  host: string;
  startsAt: string;
  durationMin: number;
  status: "live" | "soon" | "scheduled" | "ended";
  listeners: number;
  strand: string;
  artwork: Artwork;
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  blurb: string;
  curator: string;
  itemIds: string[];
  tone: "green" | "gold" | "ink";
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceZar: number;
  cadence: "month" | "year";
  summary: string;
  perks: string[];
  highlight?: boolean | undefined;
}

export interface HistoryEntry {
  episodeId: string;
  progress: number;
  lastPlayedAt: string;
}

export interface QueueItem {
  episodeId: string;
  addedAt: string;
}

export interface UserProfile {
  id: string;
  displayName: string;
  handle: string;
  city: string;
  memberSince: string;
  premium: boolean;
  languages: SALanguage[];
  minutesListened: number;
}

/** Normalised shape every card in the product renders from. */
export interface MediaCardModel {
  id: string;
  kind: MediaKind;
  title: string;
  description?: string | undefined;
  subtitle?: string | undefined;
  meta?: string | undefined;
  category?: string | undefined;
  badge?: string | undefined;
  duration?: string | undefined;
  progress?: number | undefined;
  artwork: Artwork;
  href: string;
  premium?: boolean | undefined;
  live?: boolean | undefined;
  rank?: number | undefined;
  stat?: string | undefined;
}
