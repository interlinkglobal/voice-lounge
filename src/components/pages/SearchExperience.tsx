import { Search } from "lucide-react";
import { MediaCard } from "@/components/media/MediaCard";
import { SearchFilterBar } from "@/components/search/SearchFilterBar";
import { YouTubeVideoCard } from "@/components/youtube/YouTubeFeedGrid";
import { useYouTubeFeed } from "@/components/youtube/YouTubeFeedProvider";
import { universalSearch } from "@/lib/content/adapters";
import { searchYouTubeVideos, type SearchFilter } from "@/lib/voice-lounge/page-data";
import type { MediaCardModel } from "@/lib/content/types";

function localMatchesFilter(card: MediaCardModel, filter: SearchFilter) {
  if (filter === "all") return true;
  if (filter === "podcasts") return card.kind === "podcast" || card.kind === "show";
  if (filter === "episodes") return card.kind === "episode";
  if (filter === "creators") return card.kind === "creator";
  if (filter === "guests") return card.kind === "guest";
  if (filter === "news") return card.kind === "news";
  if (filter === "live") return card.kind === "live";
  return false;
}

function ResultSection({
  title,
  items,
  creatorStyle = false,
}: {
  title: string;
  items: MediaCardModel[];
  creatorStyle?: boolean;
}) {
  if (!items.length) return null;

  return (
    <section className="border-t border-hairline pt-5">
      <div className="mb-4 flex items-end justify-between gap-3">
        <h2 className="font-display text-2xl font-black">{title}</h2>
        <span className="text-xs text-muted-foreground">{items.length} result{items.length === 1 ? "" : "s"}</span>
      </div>
      <div className={creatorStyle ? "grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}>
        {items.map((item) => (
          <MediaCard
            key={item.id}
            item={item}
            variant={creatorStyle ? "creator" : item.kind === "news" ? "news" : "standard"}
            className="w-full"
            showWatch={false}
          />
        ))}
      </div>
    </section>
  );
}

export function SearchExperience({
  query,
  filter,
}: {
  query: string;
  filter: SearchFilter;
}) {
  const feed = useYouTubeFeed();
  const term = query.trim();
  const local = term
    ? universalSearch(term)
        .map((hit) => hit.card)
        .filter((card) => localMatchesFilter(card, filter))
    : [];
  const youtube = term && (filter === "all" || filter === "videos") && feed.status === "ready"
    ? searchYouTubeVideos(feed.videos, term).slice(0, 24)
    : [];

  const shows = local.filter((item) => item.kind === "podcast" || item.kind === "show");
  const guests = local.filter((item) => item.kind === "guest");
  const creators = local.filter((item) => item.kind === "creator");
  const episodes = local.filter((item) => item.kind === "episode");
  const articles = local.filter((item) => item.kind === "news");
  const live = local.filter((item) => item.kind === "live");
  const hasAny = youtube.length + local.length > 0;

  return (
    <div className="pb-[var(--section-gap)]" data-primary-route="search">
      <section className="shell py-[clamp(1.5rem,4vw,3.5rem)]">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--green)]">Search The Voice Lounge</p>
        <h1 className="mt-2 font-display text-[clamp(2.2rem,6vw,4.75rem)] font-black tracking-[-0.055em]">
          Find videos, people and programmes.
        </h1>
        <form action="/search" role="search" className="mt-6 flex max-w-4xl flex-col gap-2 sm:flex-row">
          {filter !== "all" && <input type="hidden" name="type" value={filter} />}
          <label className="flex min-h-13 flex-1 items-center gap-3 rounded-2xl border border-hairline bg-card px-4">
            <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="sr-only">Search The Voice Lounge</span>
            <input
              name="q"
              defaultValue={query}
              autoFocus={!query}
              placeholder="Video title, guest, show, presenter or topic"
              className="w-full bg-transparent text-base outline-none"
            />
          </label>
          <button type="submit" className="press min-h-13 rounded-2xl bg-[var(--green-action)] px-7 font-bold text-white">
            Search
          </button>
        </form>
      </section>

      <SearchFilterBar query={query} active={filter} />

      <div className="shell mt-7 grid gap-8">
        {!term && (
          <div className="rounded-3xl border border-hairline bg-card p-8 text-center">
            <Search className="mx-auto size-7 text-[var(--green)]" aria-hidden="true" />
            <h2 className="mt-3 font-display text-2xl font-black">Search the whole Voice Lounge catalogue</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Search official YouTube uploads, shows, guests, creators, episodes and newsroom records from one place.
            </p>
          </div>
        )}

        {term && (filter === "all" || filter === "videos") && (
          <section className="border-t border-hairline pt-5">
            <div className="mb-4 flex items-end justify-between gap-3">
              <h2 className="font-display text-2xl font-black">Official YouTube videos</h2>
              <span className="text-xs text-muted-foreground">
                {feed.status === "loading" ? "Searching channel…" : `${youtube.length} results`}
              </span>
            </div>
            {feed.status === "loading" ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => <div key={index} className="aspect-video animate-pulse rounded-2xl border border-hairline bg-surface-2" />)}
              </div>
            ) : youtube.length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {youtube.map((video, index) => <YouTubeVideoCard key={video.id} video={video} priority={index < 4} className="w-full" animate={false} />)}
              </div>
            ) : (
              <p className="border border-hairline p-5 text-sm text-muted-foreground">No official YouTube upload matched this query.</p>
            )}
          </section>
        )}

        <ResultSection title="Shows & podcasts" items={shows} />
        <ResultSection title="Guests" items={guests} creatorStyle />
        <ResultSection title="Creators & presenters" items={creators} creatorStyle />
        <ResultSection title="Episodes" items={episodes} />
        <ResultSection title="News & press" items={articles} />
        <ResultSection title="Live" items={live} />

        {term && feed.status !== "loading" && !hasAny && (
          <div className="rounded-3xl border border-hairline bg-card p-8 text-center">
            <h2 className="font-display text-2xl font-black">No result found</h2>
            <p className="mt-2 text-sm text-muted-foreground">Try a programme name, presenter, guest, topic or shorter phrase.</p>
          </div>
        )}
      </div>
    </div>
  );
}
