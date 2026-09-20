import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bookmark, Clock3, MapPin, Radio, Share2, UserPlus } from "lucide-react";
import { Artwork } from "@/components/media/Artwork";
import { WatchButton } from "@/components/media/WatchButton";
import { Section } from "@/components/sections/SectionRenderer";
import { useLibrary } from "@/components/system/library";
import { useYouTubeVideoForKey } from "@/components/youtube/YouTubeFeedProvider";
import {
  creatorCard,
  episodeCard,
  liveCard,
  newsCard,
  podcastCard,
  formatDate,
  formatDuration,
} from "@/lib/content/adapters";
import {
  categories,
  creators,
  creatorBySlug,
  episodes,
  liveEvents,
  news,
  newsBySlug,
  podcastBySlug,
  podcasts,
} from "@/lib/content/catalog";
import type { MediaCardModel } from "@/lib/content/types";

export type DetailKind = "podcast" | "episode" | "creator" | "news" | "live" | "category";

interface DetailModel {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  meta: string[];
  artwork: { seed: string; src?: string; alt: string; ratio?: "16/9" | "1/1" | "4/5" | "3/2" };
  watchId?: string;
  relatedTitle: string;
  related: MediaCardModel[];
  body?: string[];
  creatorId?: string;
  live?: boolean;
}

function resolveDetail(kind: DetailKind, slug: string): DetailModel | null {
  if (kind === "podcast") {
    const p = podcastBySlug(slug);
    if (!p) return null;
    const host = creators.find((c) => c.id === p.creatorId);
    const related = episodes.filter((e) => e.podcastId === p.id).slice(0, 12).map((e) => episodeCard(e));
    return {
      id: p.id,
      title: p.title,
      eyebrow: p.isOriginal ? "Voice Lounge Original" : "Podcast",
      description: p.description,
      meta: [host?.name ?? "The Voice Lounge", p.language, p.province, p.episodeCount > 0 ? `${p.episodeCount} episodes` : "Programme guide"].filter(Boolean),
      artwork: { ...p.artwork, ratio: "1/1" },
      watchId: p.id,
      relatedTitle: "Episodes",
      related,
      creatorId: p.creatorId,
    };
  }

  if (kind === "episode") {
    const e = episodes.find((item) => item.slug === slug);
    if (!e) return null;
    const p = podcasts.find((item) => item.id === e.podcastId);
    return {
      id: e.id,
      title: e.title,
      eyebrow: e.kind === "video" ? "Video episode" : "Audio episode",
      description: e.description,
      meta: [
        p?.title ?? "The Voice Lounge",
        e.publishedAt ? formatDate(e.publishedAt) : "Date not published",
        e.durationSec > 0 ? formatDuration(e.durationSec) : "",
      ].filter(Boolean),
      artwork: e.artwork,
      watchId: e.id,
      relatedTitle: `More from ${p?.title ?? "this show"}`,
      related: episodes.filter((item) => item.podcastId === e.podcastId && item.id !== e.id).slice(0, 12).map((item) => episodeCard(item)),
    };
  }

  if (kind === "creator") {
    const c = creatorBySlug(slug);
    if (!c) return null;
    return {
      id: c.id,
      title: c.name,
      eyebrow: "Creator",
      description: c.bio,
      meta: [c.role, c.city && c.province ? `${c.city}, ${c.province}` : "The Voice Lounge"].filter(Boolean),
      artwork: { ...c.artwork, ratio: "1/1" },
      relatedTitle: `Shows with ${c.name}`,
      related: podcasts.filter((p) => p.creatorId === c.id).slice(0, 12).map((p) => podcastCard(p)),
      creatorId: c.id,
    };
  }

  if (kind === "news") {
    const article = newsBySlug(slug);
    if (!article) return null;
    return {
      id: article.id,
      title: article.headline,
      eyebrow: article.section,
      description: article.standfirst,
      meta: [article.author, formatDate(article.publishedAt), `${article.readingMinutes} min read`],
      artwork: article.artwork,
      relatedTitle: "More from the newsroom",
      related: news.filter((item) => item.id !== article.id).slice(0, 8).map((item) => newsCard(item)),
      body: article.body,
    };
  }

  if (kind === "live") {
    const event = liveEvents.find((item) => item.slug === slug);
    if (!event) return null;
    return {
      id: event.id,
      title: event.title,
      eyebrow: event.status === "live" ? "Live now" : event.status === "ended" ? "Replay" : "Live programming",
      description: event.description,
      meta: [event.host, event.strand, event.durationMin > 0 ? `${event.durationMin} min` : "", event.startsAt ? formatDate(event.startsAt) : "Schedule pending"].filter(Boolean),
      artwork: event.artwork,
      relatedTitle: "More live programming",
      related: liveEvents.filter((item) => item.id !== event.id).slice(0, 10).map((item) => liveCard(item)),
      live: event.status === "live",
    };
  }

  const category = categories.find((item) => item.slug === slug);
  if (!category) return null;
  const categoryPodcastIds = podcasts.filter((p) => p.categoryId === category.id).map((p) => p.id);
  return {
    id: category.id,
    title: category.name,
    eyebrow: "Category",
    description: category.blurb,
    meta: [`${category.count} programmes`, "The Voice Lounge", "East London / Eastern Cape"],
    artwork: { seed: `category-detail-${category.slug}`, alt: `${category.name} podcasts`, ratio: "16/9" },
    relatedTitle: `${category.name} podcasts and episodes`,
    related: [
      ...podcasts.filter((p) => p.categoryId === category.id).slice(0, 8).map((p) => podcastCard(p)),
      ...episodes.filter((e) => categoryPodcastIds.includes(e.podcastId)).slice(0, 6).map((e) => episodeCard(e)),
    ],
  };
}

export function detailHead(kind: DetailKind, slug: string) {
  const model = resolveDetail(kind, slug);
  if (!model) return { meta: [{ title: "Not found | The Voice Lounge" }] };
  const title = `${model.title} | The Voice Lounge`;
  return {
    meta: [
      { title },
      { name: "description", content: model.description },
      { property: "og:title", content: title },
      { property: "og:description", content: model.description },
      { property: "og:type", content: kind === "news" ? "article" : "website" },
    ],
  };
}

function NotFoundDetail() {
  return (
    <div className="shell flex min-h-[65vh] items-center justify-center py-20">
      <div className="max-w-xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--green)]">The Voice Lounge</p>
        <h1 className="mt-3 font-display text-[var(--step-4)] font-extrabold">That story is not in the archive.</h1>
        <p className="mt-3 text-muted-foreground">The URL may have changed, or the item may have moved back into the catalogue.</p>
        <Link to="/discover" className="press mt-7 inline-flex rounded-full bg-[var(--green-action)] px-6 py-3 font-semibold text-white">Explore the catalogue</Link>
      </div>
    </div>
  );
}

function CreatorAction({ id, name }: { id: string; name: string }) {
  const { isFollowing, toggleFollow } = useLibrary();
  const following = isFollowing(id);
  return (
    <button type="button" aria-pressed={following} onClick={() => toggleFollow(id, name)} className="press inline-flex h-11 items-center gap-2 rounded-full border border-hairline bg-surface-2 px-5 text-sm font-semibold">
      <UserPlus className="size-4" aria-hidden="true" />{following ? "Following" : "Follow"}
    </button>
  );
}

export function DetailPage({ kind, slug }: { kind: DetailKind; slug: string }) {
  const model = resolveDetail(kind, slug);
  const youtubeVideo = useYouTubeVideoForKey(model?.id ?? slug);
  const { isSaved, toggleSave } = useLibrary();
  const [shareState, setShareState] = useState<"idle" | "shared" | "copied">("idle");
  if (!model) return <NotFoundDetail />;
  const saved = isSaved(model.id);
  const portrait = kind === "podcast" || kind === "creator";
  const heroArtwork =
    kind === "episode" && model.eyebrow === "Video episode" && youtubeVideo
      ? { ...model.artwork, src: youtubeVideo.thumbnail, alt: youtubeVideo.title, ratio: "16/9" as const }
      : model.artwork;

  const shareCurrent = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: model.title, url: window.location.href });
        setShareState("shared");
        return;
      } catch {
        // Fall through to a copy action when native share is cancelled or unavailable.
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setShareState("copied");
      return;
    }
    window.prompt("Copy this link", window.location.href);
    setShareState("copied");
  };

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-hairline hero-wash">
        <div className="absolute inset-0 -z-10 opacity-50" aria-hidden="true"><div className="absolute -left-24 top-16 size-72 rounded-full bg-[color-mix(in_oklab,var(--green)_18%,transparent)] blur-3xl" /><div className="absolute -right-20 bottom-0 size-80 rounded-full bg-[color-mix(in_oklab,var(--gold)_14%,transparent)] blur-3xl" /></div>
        <div className="shell grid min-h-[58vh] items-center gap-8 py-[clamp(2.5rem,7vw,7rem)] lg:grid-cols-[minmax(0,1fr)_minmax(16rem,34rem)]">
          <div className="max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--green)]">{model.eyebrow}</p>
            <h1 className="mt-4 font-display text-[var(--step-5)] font-black leading-[0.96] tracking-[-0.04em]">{model.title}</h1>
            <p className="mt-5 max-w-2xl text-[var(--step-1)] leading-relaxed text-muted-foreground">{model.description}</p>
            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {model.meta.map((item, index) => <span key={item} className="inline-flex items-center gap-1.5">{index === 0 ? <MapPin className="size-3.5" aria-hidden="true" /> : index === 2 ? <Clock3 className="size-3.5" aria-hidden="true" /> : null}{item}</span>)}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-2.5">
              {model.watchId && <WatchButton targetId={model.watchId} size="lg" label={kind === "podcast" ? "Start watching" : "Watch"} />}
              {model.creatorId && kind === "creator" && <CreatorAction id={model.creatorId} name={model.title} />}
              <button type="button" aria-pressed={saved} onClick={() => toggleSave(model.id, model.title)} className="press inline-flex h-12 items-center gap-2 rounded-full border border-hairline bg-surface/70 px-5 text-sm font-semibold backdrop-blur"><Bookmark className={`size-4 ${saved ? "fill-[var(--gold)] text-[var(--gold)]" : ""}`} aria-hidden="true" />{saved ? "Saved" : "Save"}</button>
              <button type="button" onClick={() => void shareCurrent()} className="press inline-flex h-12 items-center gap-2 rounded-full border border-hairline px-5 text-sm font-semibold"><Share2 className="size-4" aria-hidden="true" />{shareState === "shared" ? "Shared" : shareState === "copied" ? "Link copied" : "Share"}</button>
            </div>
            {model.live && <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--live)] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white"><Radio className="size-3.5" aria-hidden="true" /> On air now</div>}
          </div>
          <div className={`mx-auto w-full ${portrait ? "max-w-sm" : "max-w-xl"}`}><div className="card-lift overflow-hidden rounded-[2rem] border border-hairline bg-card shadow-lift"><Artwork artwork={heroArtwork} label={model.title} priority /></div></div>
        </div>
      </section>

      {model.body && <article className="shell py-[clamp(2.5rem,6vw,6rem)]"><div className="mx-auto max-w-3xl"><p className="mb-8 text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold)]">Voice Lounge newsroom</p>{model.body.map((paragraph, index) => <p key={index} className="mb-6 text-[clamp(1rem,1.2vw,1.2rem)] leading-8 text-foreground/90">{paragraph}</p>)}<p className="mt-10 rounded-2xl border border-hairline bg-surface-2 p-5 text-sm text-muted-foreground">Public-source summary aligned to the Voice Lounge research baseline dated 20 September 2026. Source publication names and dates are preserved above; uncertain details are intentionally omitted.</p></div></article>}

      <Section index={0} spec={{ id: `${kind}-related`, eyebrow: "Keep exploring", title: model.relatedTitle, blurb: "The next useful thing should always be one tap away.", layout: "rail", items: model.related, variant: kind === "news" ? "news" : kind === "creator" ? "portrait" : kind === "live" ? "live" : "landscape", priority: true }} />
      {model.related.length === 0 && <section className="shell my-[var(--section-gap)] rounded-3xl border border-hairline bg-card p-8 text-center"><h2 className="font-display text-2xl font-bold">More is being recorded.</h2><p className="mt-2 text-sm text-muted-foreground">Browse the wider catalogue while this page fills out.</p><Link to="/discover" className="press mt-5 inline-flex rounded-full bg-[var(--green-action)] px-5 py-2.5 text-sm font-semibold text-white">Discover something new</Link></section>}
    </>
  );
}
