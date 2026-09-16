import { ExternalLink, Play, Youtube } from "lucide-react";
import type { YouTubeFeedResult } from "@/lib/youtube.functions";

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

export function YouTubeFeedGrid({
  feed,
  standalone = false,
}: {
  feed: YouTubeFeedResult;
  standalone?: boolean;
}) {
  const channelName = feed.channelTitle || "The Voice Lounge";

  return (
    <section
      id="youtube-feed"
      aria-labelledby="youtube-feed-heading"
      className={standalone ? "shell py-[clamp(3rem,7vw,7rem)]" : "shell mt-[var(--section-gap)]"}
    >
      {standalone && (
        <div className="mb-[clamp(2rem,5vw,4.5rem)] max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-2 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--green)]">
            <Youtube className="size-4" aria-hidden="true" />
            Official YouTube feed
          </div>
          <h1 className="mt-5 font-display text-[var(--step-5)] font-black leading-[0.95] tracking-[-0.04em]">
            Watch {channelName} on YouTube.
          </h1>
          <p className="mt-4 max-w-2xl text-[var(--step-1)] leading-relaxed text-muted-foreground">
            Latest uploads from @THEVOICELOUNGE, collected directly from the YouTube Data API and presented inside The Voice Lounge catalogue.
          </p>
        </div>
      )}

      <header className="mb-6 flex flex-col gap-4 border-b border-hairline pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          {feed.channelThumbnail ? (
            <img
              src={feed.channelThumbnail}
              alt=""
              width={56}
              height={56}
              className="size-14 shrink-0 rounded-full border border-hairline object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span className="grid size-14 shrink-0 place-items-center rounded-full border border-hairline bg-surface-2 text-[var(--green)]">
              <Youtube className="size-6" aria-hidden="true" />
            </span>
          )}
          <div className="min-w-0">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--green)]">YouTube collection</p>
            <h2 id="youtube-feed-heading" className="truncate font-display text-[var(--step-3)] font-extrabold">
              {channelName}
            </h2>
            {feed.status === "ready" && (
              <p className="mt-1 text-sm text-muted-foreground">
                Showing {feed.videos.length} latest upload{feed.videos.length === 1 ? "" : "s"}
                {feed.totalResults > feed.videos.length ? ` from ${feed.totalResults} on the channel` : ""}.
              </p>
            )}
          </div>
        </div>

        <a
          href={feed.channelUrl}
          target="_blank"
          rel="noreferrer"
          className="press inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-hairline bg-surface-2 px-4 text-sm font-semibold hover:border-[var(--green)] hover:text-[var(--green)]"
        >
          Open channel
          <ExternalLink className="size-4" aria-hidden="true" />
        </a>
      </header>

      {feed.status !== "ready" ? (
        <div className="rounded-3xl border border-hairline bg-card p-[clamp(1.25rem,3vw,2.5rem)]">
          <div className="flex items-start gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-surface-2 text-[var(--green)]">
              <Youtube className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-display text-lg font-bold">
                {feed.status === "unconfigured" ? "YouTube connection awaiting environment variables" : "YouTube feed unavailable"}
              </h3>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">{feed.message}</p>
              {feed.status === "unconfigured" && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Expected server variables: <code>YOUTUBE_DATA_API_KEY</code> and <code>CHANNEL_ID</code>.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : feed.videos.length === 0 ? (
        <div className="rounded-3xl border border-hairline bg-card p-8 text-center">
          <h3 className="font-display text-xl font-bold">No public uploads were returned.</h3>
          <p className="mt-2 text-sm text-muted-foreground">The channel connection is valid, but there are no public videos to display yet.</p>
        </div>
      ) : (
        <div className="grid gap-[var(--rail-gap)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {feed.videos.map((video, index) => (
            <article
              key={video.id}
              className="card-lift group overflow-hidden rounded-2xl border border-hairline bg-card shadow-card"
            >
              <a href={video.watchUrl} target="_blank" rel="noreferrer" className="block">
                <div className="relative aspect-video overflow-hidden bg-black">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    loading={index < 4 ? "eager" : "lazy"}
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-[220ms] ease-[var(--ease-out-quick)] group-hover:scale-[1.035]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" aria-hidden="true" />
                  <span className="absolute bottom-3 left-3 grid size-11 place-items-center rounded-full bg-[var(--green-action)] text-white shadow-glow transition-transform group-hover:scale-105">
                    <Play className="size-5 fill-current" aria-hidden="true" />
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--green)]">
                    {publishedLabel(video.publishedAt)}
                  </p>
                  <h3 className="mt-2 line-clamp-2 font-display text-[1rem] font-bold leading-snug group-hover:underline">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="mt-2 line-clamp-2 text-[0.8rem] leading-5 text-muted-foreground">{video.description}</p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    Watch on YouTube <ExternalLink className="size-3.5" aria-hidden="true" />
                  </span>
                </div>
              </a>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
