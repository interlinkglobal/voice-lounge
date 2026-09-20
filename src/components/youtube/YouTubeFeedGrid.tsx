import { ExternalLink, Play, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";
import { useYouTubePlayer } from "@/components/youtube/YouTubePlayerProvider";
import type { YouTubeFeedResult, YouTubeFeedVideo } from "@/lib/youtube.functions";

function publishedLabel(value: string) {
  if (!value) return "Recent upload";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recent upload";
  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function YouTubeVideoCard({
  video,
  priority = false,
  className,
  compact = false,
  featured = false,
  animate = true,
}: {
  video: YouTubeFeedVideo;
  priority?: boolean;
  className?: string;
  compact?: boolean;
  featured?: boolean;
  animate?: boolean;
}) {
  const player = useYouTubePlayer();
  const open = () => player.open(video);

  if (compact) {
    return (
      <article className={cn(animate && "vl-component-enter", "group w-full", className)}>
        <div className="hyper-glass grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-3 rounded-xl px-2 py-2">
          <button type="button" onClick={open} aria-label={`Play ${video.title}`} className="media-shine relative aspect-video overflow-hidden rounded-lg bg-black">
            <img src={video.thumbnail} alt="" loading={priority ? "eager" : "lazy"} decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
            <span className="absolute inset-0 grid place-items-center bg-black/15 text-white" aria-hidden="true"><Play className="size-4 fill-current drop-shadow" /></span>
          </button>
          <button type="button" onClick={open} className="min-w-0 text-left">
            <span className="block truncate text-sm font-semibold group-hover:underline">{video.title}</span>
            <span className="block truncate text-xs text-muted-foreground">{publishedLabel(video.publishedAt)} · YouTube</span>
          </button>
          <a href={video.watchUrl} target="_blank" rel="noreferrer" aria-label={`Open ${video.title} on YouTube`} className="press grid size-8 place-items-center rounded-full text-muted-foreground hover:text-foreground"><ExternalLink className="size-4" aria-hidden="true" /></a>
        </div>
      </article>
    );
  }

  if (featured) {
    return (
      <article className={cn(animate && "vl-component-enter", "card-lift hyper-glass group overflow-hidden rounded-3xl", className)}>
        <div className="grid md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <button type="button" onClick={open} aria-label={`Play ${video.title}`} className="media-shine relative aspect-video overflow-hidden bg-black text-left md:aspect-auto md:min-h-[20rem]">
            <img src={video.thumbnail} alt={video.title} loading={priority ? "eager" : "lazy"} decoding="async" className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-out-quick)] group-hover:scale-[1.04]" />
            <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/[0.04]" aria-hidden="true" />
            <span className="absolute bottom-4 left-4 grid size-12 place-items-center rounded-full bg-[var(--green-action)] text-white shadow-glow transition-transform group-hover:scale-105"><Play className="size-5 fill-current" aria-hidden="true" /></span>
          </button>
          <div className="flex flex-col justify-center p-[clamp(1rem,2.5vw,2.25rem)]">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--green)]">YouTube · {publishedLabel(video.publishedAt)}</p>
            <button type="button" onClick={open} className="mt-3 text-left"><h3 className="font-display text-[var(--step-3)] font-extrabold leading-[1.05] hover:underline">{video.title}</h3></button>
            {video.description && <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{video.description}</p>}
            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" onClick={open} className="press inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--green-action)] px-4 text-sm font-semibold text-white shadow-glow"><Play className="size-4 fill-current" /> Play here</button>
              <a href={video.watchUrl} target="_blank" rel="noreferrer" className="press hyper-glass inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold">YouTube <ExternalLink className="size-4" aria-hidden="true" /></a>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={cn(animate && "vl-component-enter", "card-lift hyper-glass group overflow-hidden rounded-2xl", className)}>
      <button type="button" onClick={open} aria-label={`Play ${video.title}`} className="media-shine relative block aspect-video w-full overflow-hidden bg-black text-left">
        <img src={video.thumbnail} alt={video.title} loading={priority ? "eager" : "lazy"} decoding="async" className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-out-quick)] group-hover:scale-[1.04]" />
        <span className="absolute inset-0 bg-gradient-to-t from-black/48 via-transparent to-white/[0.04]" aria-hidden="true" />
        <span className="absolute bottom-3 left-3 grid size-11 place-items-center rounded-full bg-[var(--green-action)] text-white shadow-glow transition-transform group-hover:scale-105"><Play className="size-5 fill-current" aria-hidden="true" /></span>
      </button>
      <div className="p-4">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--green)]">{publishedLabel(video.publishedAt)}</p>
        <button type="button" onClick={open} className="mt-2 block w-full text-left"><h3 className="line-clamp-2 font-display text-[1rem] font-bold leading-snug hover:underline">{video.title}</h3></button>
        {video.description && <p className="mt-2 line-clamp-2 text-[0.8rem] leading-5 text-muted-foreground">{video.description}</p>}
        <div className="mt-4 flex items-center justify-between gap-2">
          <button type="button" onClick={open} className="press inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--green)]"><Play className="size-3.5 fill-current" /> Play here</button>
          <a href={video.watchUrl} target="_blank" rel="noreferrer" className="press inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">YouTube <ExternalLink className="size-3.5" aria-hidden="true" /></a>
        </div>
      </div>
    </article>
  );
}

export function YouTubeFeedGrid({ feed, standalone = false }: { feed: YouTubeFeedResult; standalone?: boolean }) {
  const channelName = feed.channelTitle || "The Voice Lounge";
  const orderedVideos = [...feed.videos].sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt),
  );

  return (
    <section id="youtube-feed" aria-labelledby="youtube-feed-heading" className={cn(!standalone && "vl-section-enter", standalone ? "shell py-[clamp(1rem,3vw,2rem)]" : "shell mt-[var(--section-gap)]")}>
      <header className={cn("hyper-glass mb-6 flex flex-col gap-4 rounded-[1.75rem] p-4 sm:flex-row sm:items-end sm:justify-between", !standalone && "vl-component-enter")}>
        <div className="flex min-w-0 items-center gap-3">
          {feed.channelThumbnail ? (
            <div className="media-shine size-14 shrink-0 overflow-hidden rounded-full"><img src={feed.channelThumbnail} alt="" width={56} height={56} className="h-full w-full object-cover" loading="lazy" decoding="async" /></div>
          ) : (
            <div className="media-shine size-14 shrink-0 overflow-hidden rounded-full"><img src="https://img.freepik.com/free-photo/professional-microphone-sound-recording-macro-photography_169016-23351.jpg" alt="" width={56} height={56} className="h-full w-full object-cover" loading="lazy" decoding="async" /></div>
          )}
          <div className="min-w-0">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--green)]">YouTube collection</p>
            <h2 id="youtube-feed-heading" className="truncate font-display text-[var(--step-3)] font-extrabold">{channelName}</h2>
            {feed.status === "ready" && <p className="mt-1 text-sm text-muted-foreground">Showing {orderedVideos.length} latest upload{orderedVideos.length === 1 ? "" : "s"}{feed.totalResults > orderedVideos.length ? ` from ${feed.totalResults} on the channel` : ""}.</p>}
          </div>
        </div>
        <a href={feed.channelUrl} target="_blank" rel="noreferrer" className="press hyper-glass inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold">Open channel <ExternalLink className="size-4" aria-hidden="true" /></a>
      </header>

      {feed.status !== "ready" ? (
        <div className="hyper-glass rounded-3xl p-[clamp(1.25rem,3vw,2.5rem)] vl-component-enter"><div className="flex items-start gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-surface-2 text-[var(--green)]"><Youtube className="size-5" aria-hidden="true" /></span><div><h3 className="font-display text-lg font-bold">{feed.status === "unconfigured" ? "YouTube connection awaiting environment variables" : "YouTube feed unavailable"}</h3><p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">{feed.message}</p>{feed.status === "unconfigured" && <p className="mt-3 text-xs text-muted-foreground">Expected server variables: <code>YOUTUBE_DATA_API_KEY</code> and <code>CHANNEL_ID</code>.</p>}</div></div></div>
      ) : feed.videos.length === 0 ? (
        <div className="hyper-glass rounded-3xl p-8 text-center vl-component-enter"><h3 className="font-display text-xl font-bold">No public uploads were returned.</h3><p className="mt-2 text-sm text-muted-foreground">The channel connection is valid, but there are no public videos to display yet.</p></div>
      ) : (
        <div className="grid gap-[var(--rail-gap)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{orderedVideos.map((video, index) => <YouTubeVideoCard key={video.id} video={video} priority={index < 4} animate={!standalone} className="w-full" />)}</div>
      )}
    </section>
  );
}
