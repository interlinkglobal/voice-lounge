import { Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Play,
  Radio,
  Search,
  WifiOff,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { AccountSaveButton } from "@/components/account/AccountSaveButton";
import { Artwork } from "@/components/media/Artwork";
import { SmartImage } from "@/components/media/SmartImage";
import { YouTubeVideoCard } from "@/components/youtube/YouTubeFeedGrid";
import { useYouTubeFeed } from "@/components/youtube/YouTubeFeedProvider";
import { categories, news, podcastBySlug, podcasts } from "@/lib/content/catalog";
import {
  PODCAST_THUMBNAILS,
  SHOW_SCHEDULE,
  normalizeProgrammeText,
  programmeVideos,
  type ScheduleDay,
} from "@/lib/content/programme-directory";
import { formatDate } from "@/lib/content/adapters";
import { getYouTubeLiveStatus, type YouTubeLiveStatus } from "@/lib/youtube.functions";

function podcastCategory(categoryId: string) {
  return categories.find((item) => item.id === categoryId)?.name ?? "Voice Lounge";
}

function podcastImage(podcastId: string) {
  return PODCAST_THUMBNAILS[podcastId] ?? null;
}

export function PodcastsDirectoryExperience() {
  const [query, setQuery] = useState("");
  const normalized = normalizeProgrammeText(query);

  const results = useMemo(
    () =>
      podcasts.filter((podcast) => {
        if (!normalized) return true;
        const haystack = normalizeProgrammeText(
          `${podcast.title} ${podcast.tagline} ${podcastCategory(podcast.categoryId)} ${podcast.language} ${podcast.format}`,
        );
        return haystack.includes(normalized);
      }),
    [normalized],
  );

  return (
    <div className="pb-[var(--section-gap)]" data-primary-route="podcasts">
      <section className="shell pt-[clamp(1rem,2vw,1.75rem)]">
        <label className="relative block border border-hairline bg-background">
          <span className="sr-only">Search podcasts</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search podcasts"
            className="h-14 w-full rounded-none bg-transparent pl-12 pr-4 text-base outline-none placeholder:text-muted-foreground focus:border-foreground"
          />
        </label>

        <div className="mt-3 flex items-center justify-between gap-4 border-b border-hairline pb-3 text-xs text-muted-foreground">
          <span>{results.length} podcasts</span>
          <span className="hidden sm:inline">Voice Lounge programme directory</span>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {results.map((podcast, index) => {
            const image = podcastImage(podcast.id);
            return (
              <article
                key={podcast.id}
                className="group grid min-h-[9.5rem] grid-cols-[38%_minmax(0,1fr)] overflow-hidden border border-hairline bg-card/45 transition-colors hover:border-[color-mix(in_oklab,var(--green)_48%,var(--hairline))] sm:grid-cols-[32%_minmax(0,1fr)]"
              >
                <Link to="/podcasts/$slug" params={{ slug: podcast.slug }} className="relative min-h-[9.5rem] overflow-hidden bg-black">
                  <SmartImage
                    src={image}
                    fallbackRatio="1:1"
                    alt={podcast.artwork.alt}
                    loading={index < 6 ? "eager" : "lazy"}
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                  />
                </Link>

                <div className="flex min-w-0 flex-col justify-between gap-3 p-[clamp(.85rem,2.2vw,1.25rem)]">
                  <Link to="/podcasts/$slug" params={{ slug: podcast.slug }} className="min-w-0">
                    <p className="text-[0.65rem] font-black uppercase tracking-[0.14em] text-[var(--green)]">
                      {podcastCategory(podcast.categoryId)}
                    </p>
                    <h2 className="mt-1 line-clamp-2 font-display text-[clamp(1rem,2vw,1.35rem)] font-black leading-tight">
                      {podcast.title}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">{podcast.tagline}</p>
                    <p className="mt-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      {podcast.language} · {podcast.format}
                    </p>
                  </Link>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-hairline pt-3">
                    <span className="truncate text-xs text-muted-foreground">Programme page</span>
                    <div className="flex gap-2">
                      <AccountSaveButton
                        contentType="podcast"
                        contentId={podcast.id}
                        title={podcast.title}
                        imageUrl={image}
                        collection="listen_later"
                        className="h-10 min-h-10 px-3"
                      />
                      <Link
                        to="/podcasts/$slug"
                        params={{ slug: podcast.slug }}
                        className="press inline-flex h-10 shrink-0 items-center gap-2 rounded-none bg-[var(--green-action)] px-4 text-sm font-semibold text-white shadow-[0_6px_18px_-8px_var(--green-deep)]"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {results.length === 0 && (
          <div className="mt-4 border border-hairline p-8 text-center">
            <Search className="mx-auto size-6 text-muted-foreground" aria-hidden="true" />
            <h2 className="mt-3 font-display text-xl font-bold">No podcast matches</h2>
            <p className="mt-1 text-sm text-muted-foreground">Try a show name, category or format.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function ProgrammeVideoGrid({
  title,
  slug,
  compact = false,
}: {
  title: string;
  slug: string;
  compact?: boolean | undefined;
}) {
  const feed = useYouTubeFeed();
  const videos = feed?.status === "ready" ? programmeVideos(feed.videos, slug, title) : [];

  if (feed?.status === "loading") {
    return <div className="h-40 animate-pulse border border-hairline bg-surface-2" aria-label="Loading programme videos" />;
  }

  if (feed?.status !== "ready") {
    return (
      <div className="border border-hairline p-6 text-sm text-muted-foreground">
        Voice Lounge video playback is temporarily unavailable.
      </div>
    );
  }

  if (!videos.length) {
    return (
      <div className="border border-hairline p-6">
        <h2 className="font-display text-xl font-bold">No matched uploads yet</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          This programme remains in the official schedule. Video cards will appear here when the Voice Lounge YouTube metadata matches this programme.
        </p>
      </div>
    );
  }

  return (
    <div className={compact ? "grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"}>
      {videos.map((video, index) => (
        <YouTubeVideoCard key={video.id} video={video} priority={index < 4} className="w-full" />
      ))}
    </div>
  );
}

export function PodcastDetailExperience({ slug }: { slug: string }) {
  const podcast = podcastBySlug(slug);
  if (!podcast) {
    return (
      <div className="shell grid min-h-[65vh] place-items-center py-12">
        <div className="text-center">
          <h1 className="font-display text-3xl font-black">Podcast not found</h1>
          <Link to="/podcasts" className="mt-5 inline-flex border border-hairline px-5 py-2.5 text-sm font-semibold">Back to podcasts</Link>
        </div>
      </div>
    );
  }

  const schedule = SHOW_SCHEDULE.find((item) => item.podcastId === podcast.id);
  const image = podcastImage(podcast.id);

  return (
    <div className="shell min-h-[calc(100vh-5rem)] py-[clamp(1rem,3vw,2.5rem)]">
      <section className="grid overflow-hidden border border-hairline bg-card/35 md:grid-cols-[minmax(15rem,28rem)_minmax(0,1fr)]">
        <div className="aspect-square bg-black md:aspect-auto md:min-h-[20rem]">
          <SmartImage src={image} fallbackRatio="1:1" alt={podcast.artwork.alt} className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col justify-center p-[clamp(1.25rem,4vw,3rem)]">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--green)]">{podcastCategory(podcast.categoryId)}</p>
          <h1 className="mt-2 font-display text-[clamp(2rem,5vw,4.5rem)] font-black leading-[.94] tracking-[-0.05em]">{podcast.title}</h1>
          <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{podcast.description}</p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
            {schedule && <span>{schedule.time}</span>}
            {schedule && <span>{schedule.host}</span>}
            <span>{podcast.language}</span>
          </div>
          <div className="mt-5">
            <AccountSaveButton
              contentType="podcast"
              contentId={podcast.id}
              title={podcast.title}
              imageUrl={image}
              collection="listen_later"
              label="Save podcast"
            />
          </div>
        </div>
      </section>

      <section className="mt-[clamp(1.5rem,4vw,3rem)]">
        <div className="mb-4 flex items-end justify-between border-b border-hairline pb-3">
          <h2 className="font-display text-2xl font-black">Watch & listen</h2>
          <span className="text-xs text-muted-foreground">Official Voice Lounge uploads</span>
        </div>
        <ProgrammeVideoGrid title={podcast.title} slug={podcast.slug} compact />
      </section>
    </div>
  );
}

function ScheduleCard({ entry, index }: { entry: (typeof SHOW_SCHEDULE)[number]; index: number }) {
  const show = podcasts.find((item) => item.id === entry.podcastId);
  if (!show) return null;
  const image = podcastImage(show.id);

  return (
    <Link
      to="/shows/$slug"
      params={{ slug: show.slug }}
      className="group relative min-h-[24rem] overflow-hidden border border-hairline bg-black sm:min-h-[28rem]"
    >
      <SmartImage
        src={image}
        fallbackRatio="9:16"
        alt=""
        loading={index < 6 ? "eager" : "lazy"}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black via-black/22 to-black/5" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-white sm:p-6">
        <span className="inline-flex bg-[var(--green-action)] px-3 py-1.5 text-xs font-black tracking-[0.08em]">{entry.time}</span>
        <h3 className="mt-4 font-display text-[clamp(1.35rem,3vw,2rem)] font-black uppercase leading-tight">{show.title}</h3>
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-white/70">{entry.host}</p>
      </div>
    </Link>
  );
}

export function ShowsDirectoryExperience() {
  const days: ScheduleDay[] = ["Monday–Friday", "Saturday", "Sunday"];

  return (
    <div className="shell pb-[var(--section-gap)] pt-[clamp(1rem,3vw,2rem)]" data-primary-route="shows">
      {days.map((day, dayIndex) => {
        const entries = SHOW_SCHEDULE.filter((item) => item.day === day);
        return (
          <section key={day} className={dayIndex ? "mt-[clamp(2.5rem,6vw,5rem)]" : ""}>
            <h1 className="mb-5 font-display text-[clamp(2rem,5vw,4.5rem)] font-black tracking-[-0.05em]">{day}</h1>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {entries.map((entry, index) => <ScheduleCard key={`${entry.podcastId}-${entry.day}-${entry.time}`} entry={entry} index={index} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function ShowDetailExperience({ slug }: { slug: string }) {
  const show = podcastBySlug(slug);
  if (!show) {
    return (
      <div className="shell grid min-h-[65vh] place-items-center py-12">
        <div className="text-center">
          <h1 className="font-display text-3xl font-black">Show not found</h1>
          <Link to="/shows" className="mt-5 inline-flex border border-hairline px-5 py-2.5 text-sm font-semibold">Back to shows</Link>
        </div>
      </div>
    );
  }

  const schedules = SHOW_SCHEDULE.filter((item) => item.podcastId === show.id);

  return (
    <div className="shell min-h-[calc(100vh-5rem)] py-[clamp(1rem,3vw,2.5rem)]">
      <section className="relative min-h-[19rem] overflow-hidden border border-hairline bg-black">
        <SmartImage src={podcastImage(show.id)} fallbackRatio="16:9" alt="" className="absolute inset-0 h-full w-full object-cover opacity-55" />
        <span className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/20" aria-hidden="true" />
        <div className="relative z-10 flex min-h-[19rem] max-w-3xl flex-col justify-end p-[clamp(1.25rem,5vw,3rem)] text-white">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--green)]">Voice Lounge show</p>
          <h1 className="mt-2 font-display text-[clamp(2.4rem,7vw,5rem)] font-black leading-[.9] tracking-[-0.06em]">{show.title}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            {schedules.map((item) => (
              <span key={`${item.day}-${item.time}`} className="border border-white/20 bg-black/30 px-3 py-1.5 text-xs font-semibold">
                {item.day} · {item.time} · {item.host}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-[clamp(1.5rem,4vw,3rem)]">
        <div className="mb-4 border-b border-hairline pb-3">
          <h2 className="font-display text-2xl font-black">Videos & podcasts</h2>
        </div>
        <ProgrammeVideoGrid title={show.title} slug={show.slug} />
      </section>
    </div>
  );
}

export function NewsExperience() {
  const sorted = [...news].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));

  return (
    <div className="shell pb-[var(--section-gap)] pt-[clamp(1rem,3vw,2rem)]" data-primary-route="news">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sorted.map((article, index) => (
          <article key={article.id} className="flex min-w-0 flex-col overflow-hidden border border-hairline bg-card">
            <Link to="/news/$slug" params={{ slug: article.slug }} className="block">
              <Artwork artwork={article.artwork} label={article.headline} priority={index < 3} />
            </Link>
            <div className="flex flex-1 flex-col p-5">
              <p className="text-[0.68rem] font-black uppercase tracking-[0.15em] text-[var(--green)]">{article.section}</p>
              <h2 className="mt-2 font-display text-xl font-black leading-tight">{article.headline}</h2>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{article.standfirst}</p>
              <p className="mt-4 text-xs text-muted-foreground">{article.author} · {formatDate(article.publishedAt)} · {article.readingMinutes} min read</p>
              <div className="mt-auto flex gap-2 pt-5">
                <Link
                  to="/news/$slug"
                  params={{ slug: article.slug }}
                  className="press inline-flex min-h-10 flex-1 items-center justify-center bg-[var(--green-action)] px-4 text-sm font-bold text-white"
                >
                  Read
                </Link>
                <AccountSaveButton
                  contentType="article"
                  contentId={article.id}
                  title={article.headline}
                  imageUrl={article.artwork.src}
                  className="min-h-10"
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function WatchExperience() {
  const feed = useYouTubeFeed();
  const videos = useMemo(
    () => feed?.status === "ready"
      ? [...feed.videos].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
      : [],
    [feed],
  );
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    if (!currentId && videos[0]) setCurrentId(videos[0].id);
  }, [currentId, videos]);

  const current = videos.find((video) => video.id === currentId) ?? videos[0];

  const next = () => {
    if (!current || videos.length < 2) return;
    const recent = new Set([current.id, ...history.slice(-5)]);
    const pool = videos.filter((video) => !recent.has(video.id));
    const candidates = pool.length ? pool : videos.filter((video) => video.id !== current.id);
    const picked = candidates[Math.floor(Math.random() * candidates.length)];
    if (!picked) return;
    setHistory((items) => [...items, current.id].slice(-30));
    setCurrentId(picked.id);
  };

  const previous = () => {
    const prior = history[history.length - 1];
    if (!prior) return;
    setHistory((items) => items.slice(0, -1));
    setCurrentId(prior);
  };

  if (feed?.status !== "ready" || !current) {
    return (
      <div className="shell grid min-h-[70vh] place-items-center py-10 text-center">
        <div><h1 className="font-display text-2xl font-black">Watch is temporarily unavailable</h1><p className="mt-2 text-sm text-muted-foreground">{feed?.message}</p></div>
      </div>
    );
  }

  return (
    <div className="shell pb-[var(--section-gap)] pt-[clamp(1rem,3vw,2rem)]" data-primary-route="watch">
      <section className="mx-auto max-w-5xl">
        <div className="mb-3 flex items-center justify-end gap-2" aria-label="Watch navigation">
            <button
              type="button"
              onClick={previous}
              disabled={!history.length}
              className="press inline-flex min-h-11 items-center gap-2 border border-hairline px-4 text-sm font-bold disabled:opacity-35"
            >
              <ChevronLeft className="size-4" aria-hidden="true" /> Prev
            </button>
            <button
              type="button"
              onClick={next}
              className="press inline-flex min-h-11 items-center gap-2 bg-[var(--green-action)] px-4 text-sm font-bold text-white"
            >
              Next <ChevronRight className="size-4" aria-hidden="true" />
            </button>
        </div>

        <div className="mb-3 min-w-0 text-center">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--green)]">Now watching</p>
          <h1 className="mx-auto mt-1 line-clamp-2 max-w-4xl font-display text-[clamp(1.15rem,2.4vw,1.8rem)] font-black">{current.title}</h1>
        </div>

        <div className="mx-auto w-full max-w-4xl overflow-hidden border border-hairline bg-black text-white shadow-lift">
          <div className="aspect-video w-full bg-black">
            <iframe
              key={current.id}
              src={`${current.embedUrl}?autoplay=0&rel=0&playsinline=1&modestbranding=1`}
              title={current.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          {current.description && (
            <div className="border-t border-white/10 p-4 sm:p-5">
              <p className="line-clamp-2 text-sm leading-6 text-white/65">{current.description}</p>
            </div>
          )}
        </div>

        <p className="mx-auto mt-3 max-w-4xl text-xs text-muted-foreground">
          The newest upload is shown first. Next selections are randomized from the complete paginated Voice Lounge upload pool.
        </p>
      </section>
    </div>
  );
}

export function LiveExperience() {
  const feed = useYouTubeFeed();
  const videos = feed?.status === "ready" ? feed.videos : [];
  const initialLive = videos.find((video) => video.liveBroadcastContent === "live");
  const [liveStatus, setLiveStatus] = useState<YouTubeLiveStatus | null>(
    initialLive
      ? {
          configured: true,
          isLive: true,
          channelId: feed?.channelId ?? "",
          videoId: initialLive.id,
          title: initialLive.title,
          permanentEmbedUrl: feed?.channelId
            ? `https://www.youtube.com/embed/live_stream?channel=${encodeURIComponent(feed.channelId)}`
            : null,
          videoEmbedUrl: initialLive.embedUrl,
          checkedAt: new Date().toISOString(),
        }
      : null,
  );

  useEffect(() => {
    let active = true;
    let timer: number | undefined;

    const checkLive = async () => {
      try {
        const status = await getYouTubeLiveStatus();
        if (active) setLiveStatus(status);
      } catch (error) {
        console.warn("[live-page] live polling failed", error);
      }
    };

    void checkLive();
    timer = window.setInterval(checkLive, 60_000);
    return () => {
      active = false;
      if (timer) window.clearInterval(timer);
    };
  }, []);

  const previousLives = videos
    .filter((video) => video.id !== liveStatus?.videoId && video.wasLive)
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));

  const liveEmbed = liveStatus?.isLive
    ? (liveStatus.permanentEmbedUrl ?? liveStatus.videoEmbedUrl)
    : null;

  return (
    <div className="shell pb-[var(--section-gap)] pt-[clamp(1rem,3vw,2rem)]" data-primary-route="live">
      {liveEmbed ? (
        <section className="overflow-hidden border border-[color-mix(in_oklab,var(--live)_55%,var(--hairline))] bg-black text-white">
          <div className="aspect-video">
            <iframe
              src={`${liveEmbed}${liveEmbed.includes("?") ? "&" : "?"}autoplay=1&rel=0&playsinline=1&modestbranding=1`}
              title={liveStatus?.title ?? "The Voice Lounge live"}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <div className="p-5 sm:p-6">
            <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--live)]"><Radio className="size-4" aria-hidden="true" /> Live now</p>
            <h1 className="mt-2 font-display text-[clamp(1.5rem,4vw,2.75rem)] font-black">{liveStatus?.title ?? "The Voice Lounge Live"}</h1>
            <p className="mt-2 text-xs text-white/55">Live status refreshes automatically every minute from the YouTube Data API.</p>
          </div>
        </section>
      ) : (
        <section className="hero-wash grain grid min-h-[52vh] place-items-center border border-hairline p-6 text-center">
          <div className="max-w-2xl">
            <span className="mx-auto grid size-16 place-items-center border border-hairline bg-background/35"><WifiOff className="size-7 text-muted-foreground" aria-hidden="true" /></span>
            <h1 className="mt-5 font-display text-[clamp(2rem,6vw,4.5rem)] font-black tracking-[-0.05em]">There isn’t a live broadcast right now.</h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground">This page checks the channel automatically. Scroll below to watch previous Voice Lounge live broadcasts and event streams.</p>
          </div>
        </section>
      )}

      <section className="mt-[clamp(2rem,5vw,4rem)]">
        <div className="mb-4 flex items-end justify-between border-b border-hairline pb-3">
          <h2 className="font-display text-2xl font-black">Previous lives</h2>
          <span className="text-xs text-muted-foreground">{previousLives.length} broadcasts</span>
        </div>
        {previousLives.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {previousLives.map((video, index) => <YouTubeVideoCard key={video.id} video={video} priority={index < 4} className="w-full" />)}
          </div>
        ) : (
          <div className="border border-hairline p-6 text-sm text-muted-foreground">
            No completed live broadcasts are currently marked in the YouTube feed.
          </div>
        )}
      </section>
    </div>
  );
}
