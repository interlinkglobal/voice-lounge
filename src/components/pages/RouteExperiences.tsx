import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Filter, Search, SlidersHorizontal } from "lucide-react";
import { useYouTubeFeed } from "@/components/youtube/YouTubeFeedProvider";
import { YouTubeVideoCard } from "@/components/youtube/YouTubeFeedGrid";
import { WatchButton } from "@/components/media/WatchButton";
import { categories, podcasts } from "@/lib/content/catalog";
import { stockImageForSeed } from "@/lib/stock-images";
import { cn } from "@/lib/utils";

const DISCOVER_TABS = [
  { id: "topic", label: "Topic" },
  { id: "mood", label: "Mood" },
  { id: "format", label: "Format" },
  { id: "language", label: "Language" },
  { id: "province", label: "Province" },
] as const;

type DiscoverTab = (typeof DISCOVER_TABS)[number]["id"];

const DISCOVER_OPTIONS: Record<DiscoverTab, string[]> = {
  topic: categories.slice(0, 14).map((item) => item.name),
  mood: ["Quick hit", "Deep dive", "Laugh", "Learn", "Debate", "Unwind", "Culture", "Business"],
  format: ["Audio", "Video", "Hybrid"],
  language: ["English", "isiZulu", "isiXhosa", "Sesotho", "Setswana", "Afrikaans"],
  province: ["Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Free State", "Limpopo", "Mpumalanga", "North West", "Northern Cape"],
};

function normalize(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, " ").trim();
}

export function DiscoverExperience() {
  const feed = useYouTubeFeed();
  const videos = feed?.status === "ready" ? feed.videos : [];
  const [activeTab, setActiveTab] = useState<DiscoverTab>("topic");
  const [draft, setDraft] = useState<Record<DiscoverTab, string[]>>({
    topic: [],
    mood: [],
    format: [],
    language: [],
    province: [],
  });
  const [applied, setApplied] = useState<Record<DiscoverTab, string[]> | null>(null);

  const selectedCount = Object.values(draft).reduce((total, values) => total + values.length, 0);

  const results = useMemo(() => {
    if (!applied) return { videos: [], podcasts: [] };

    const topicTerms = applied.topic.map(normalize);
    const moodTerms = applied.mood.map(normalize);

    const filteredVideos = [...videos]
      .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
      .filter((video) => {
        const haystack = normalize(`${video.title} ${video.description}`);
        const topicMatch = !topicTerms.length || topicTerms.some((term) => haystack.includes(term));
        const moodMatch = !moodTerms.length || moodTerms.some((term) => haystack.includes(term));
        return topicMatch && moodMatch;
      })
      .slice(0, 12);

    const filteredPodcasts = podcasts
      .filter((podcast) => {
        const category = categories.find((item) => item.id === podcast.categoryId)?.name;
        const topicMatch = !applied.topic.length || applied.topic.includes(category ?? "");
        const formatMatch = !applied.format.length || applied.format.includes(podcast.format);
        const languageMatch = !applied.language.length || applied.language.includes(podcast.language);
        const provinceMatch = !applied.province.length || applied.province.includes(podcast.province);
        return topicMatch && formatMatch && languageMatch && provinceMatch;
      })
      .slice(0, 12);

    return { videos: filteredVideos, podcasts: filteredPodcasts };
  }, [applied, videos]);

  function toggle(tab: DiscoverTab, option: string) {
    setDraft((current) => ({
      ...current,
      [tab]: current[tab].includes(option)
        ? current[tab].filter((item) => item !== option)
        : [...current[tab], option],
    }));
  }

  return (
    <div className="min-h-[72vh] pb-32" data-primary-route="discover">
      <section className="shell pt-[clamp(2rem,5vw,5rem)]">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--green)]">Discover workspace</p>
            <h1 className="mt-3 max-w-4xl font-display text-[clamp(2.8rem,7vw,6rem)] font-black leading-[0.9] tracking-[-0.06em]">
              Filter the catalogue, then find.
            </h1>
            <p className="mt-4 max-w-2xl text-[clamp(1rem,1.3vw,1.2rem)] leading-7 text-muted-foreground">
              Choose what matters now. Nothing is rendered until you apply the filters.
            </p>
          </div>
          <div className="rounded-2xl border border-hairline bg-surface-2 px-4 py-3 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{selectedCount}</span> filters staged
          </div>
        </div>

        <div className="mt-8 overflow-x-auto border-b border-hairline">
          <div className="flex min-w-max gap-1">
            {DISCOVER_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "press relative px-5 py-4 text-sm font-bold",
                  activeTab === tab.id ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {tab.label}
                {draft[tab.id].length > 0 && (
                  <span className="ml-2 rounded-full bg-[var(--green-action)] px-2 py-0.5 text-[0.65rem] text-white">
                    {draft[tab.id].length}
                  </span>
                )}
                {activeTab === tab.id && <span className="absolute inset-x-3 bottom-0 h-0.5 bg-[var(--green)]" />}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 min-h-44 rounded-[2rem] border border-hairline bg-card/45 p-[clamp(1rem,3vw,2rem)]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-[var(--green)]" aria-hidden="true" />
            <h2 className="font-display text-xl font-bold">{DISCOVER_TABS.find((tab) => tab.id === activeTab)?.label}</h2>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {DISCOVER_OPTIONS[activeTab].map((option) => {
              const active = draft[activeTab].includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggle(activeTab, option)}
                  className={cn(
                    "press inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold",
                    active
                      ? "border-[var(--green)] bg-[color-mix(in_oklab,var(--green)_14%,transparent)] text-foreground"
                      : "border-hairline bg-surface-2 text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active && <Check className="size-3.5" aria-hidden="true" />}
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {!applied ? (
        <section className="shell mt-[var(--section-gap)]">
          <div className="grid min-h-64 place-items-center rounded-[2.5rem] border border-dashed border-hairline bg-card/25 text-center">
            <div className="max-w-md px-6">
              <Filter className="mx-auto size-7 text-[var(--green)]" aria-hidden="true" />
              <h2 className="mt-4 font-display text-2xl font-bold">Your results will appear here</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Select tabs and filters, then use the Find button.</p>
            </div>
          </div>
        </section>
      ) : (
        <section className="shell mt-[var(--section-gap)]">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--gold)]">Filtered results</p>
              <h2 className="mt-2 font-display text-[var(--step-3)] font-black">Made for this selection</h2>
            </div>
            <button type="button" onClick={() => setApplied(null)} className="press rounded-full border border-hairline px-4 py-2 text-sm font-semibold">Reset results</button>
          </div>

          {results.videos.length > 0 && (
            <div className="mt-7">
              <p className="mb-3 text-sm font-bold text-muted-foreground">Videos</p>
              <div className="grid gap-[var(--rail-gap)] sm:grid-cols-2 xl:grid-cols-3">
                {results.videos.map((video, index) => (
                  <YouTubeVideoCard key={video.id} video={video} priority={index < 3} className="w-full" />
                ))}
              </div>
            </div>
          )}

          {results.podcasts.length > 0 && (
            <div className="mt-10">
              <p className="mb-3 text-sm font-bold text-muted-foreground">Podcasts</p>
              <div className="grid gap-3 md:grid-cols-2">
                {results.podcasts.map((podcast) => (
                  <Link
                    key={podcast.id}
                    to="/podcasts/$slug"
                    params={{ slug: podcast.slug }}
                    className="press flex items-center gap-4 rounded-2xl border border-hairline bg-card/50 p-3"
                  >
                    <img src={stockImageForSeed(podcast.artwork.seed)} alt="" className="size-16 shrink-0 rounded-xl object-cover" loading="lazy" decoding="async" />
                    <span className="min-w-0">
                      <span className="block truncate font-display font-bold">{podcast.title}</span>
                      <span className="mt-1 block line-clamp-1 text-sm text-muted-foreground">{podcast.tagline}</span>
                    </span>
                    <ArrowRight className="ml-auto size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.videos.length === 0 && results.podcasts.length === 0 && (
            <div className="mt-7 rounded-[2rem] border border-hairline bg-card/45 p-10 text-center">
              <Search className="mx-auto size-6 text-muted-foreground" aria-hidden="true" />
              <h3 className="mt-3 font-display text-xl font-bold">No exact matches</h3>
              <p className="mt-2 text-sm text-muted-foreground">Remove one or two filters and try again.</p>
            </div>
          )}
        </section>
      )}

      <button
        type="button"
        onClick={() => setApplied(draft)}
        className="press fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,var(--gutter))] z-40 inline-flex min-h-14 items-center gap-2 rounded-full bg-[var(--green-action)] px-7 font-black text-white shadow-[0_18px_50px_-18px_var(--green-deep)]"
      >
        <Search className="size-4" aria-hidden="true" />
        Find
      </button>
    </div>
  );
}

export function PodcastsExperience() {
  return (
    <div className="pb-[var(--section-gap)]" data-primary-route="podcasts">
      <section className="shell pt-[clamp(2.5rem,6vw,6rem)]">
        <div className="max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--gold)]">Podcast directory</p>
          <h1 className="mt-3 font-display text-[clamp(3rem,8vw,7rem)] font-black leading-[0.88] tracking-[-0.065em]">
            Shows built to be heard.
          </h1>
          <p className="mt-5 max-w-2xl text-[clamp(1rem,1.3vw,1.2rem)] leading-7 text-muted-foreground">
            A dense catalogue of South African voices without video-card chrome.
          </p>
        </div>

        <div className="mt-[clamp(2rem,5vw,4rem)] grid gap-4 xl:grid-cols-2">
          {podcasts.map((podcast, index) => (
            <article
              key={podcast.id}
              className="group grid min-h-[9.5rem] grid-cols-[28%_minmax(0,1fr)] overflow-hidden rounded-[999px] border border-hairline bg-card/55 p-2 pr-[clamp(.9rem,2vw,1.5rem)] transition-colors hover:border-[color-mix(in_oklab,var(--green)_46%,var(--hairline))]"
            >
              <Link to="/podcasts/$slug" params={{ slug: podcast.slug }} className="relative overflow-hidden rounded-full bg-black">
                <img
                  src={stockImageForSeed(podcast.artwork.seed)}
                  alt={podcast.artwork.alt}
                  loading={index < 6 ? "eager" : "lazy"}
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.045]"
                />
              </Link>
              <div className="flex min-w-0 items-center gap-3 pl-[clamp(.75rem,2vw,1.4rem)]">
                <Link to="/podcasts/$slug" params={{ slug: podcast.slug }} className="min-w-0 flex-1">
                  <p className="text-[0.65rem] font-black uppercase tracking-[0.15em] text-[var(--green)]">{[podcast.language, podcast.format].filter(Boolean).join(" · ") || "Voice Lounge programme"}</p>
                  <h2 className="mt-1 truncate font-display text-[clamp(1rem,2vw,1.45rem)] font-black">{podcast.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">{podcast.tagline}</p>
                </Link>
                <WatchButton targetId={podcast.id} label="Play" size="sm" className="shrink-0" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export function ShowsExperience() {
  const feed = useYouTubeFeed();
  const videos = feed?.status === "ready"
    ? [...feed.videos].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
    : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeShow = podcasts[activeIndex] ?? podcasts[0];
  const activeName = activeShow?.title ?? "The Voice Lounge";
  const normalizedName = normalize(activeName);
  const selected = videos
    .filter((video) => normalize(`${video.title} ${video.description}`).includes(normalizedName))
    .slice(0, 8);
  const feature = selected[0];

  return (
    <div className="pb-[var(--section-gap)]" data-primary-route="shows">
      <section className="shell pt-[clamp(2rem,5vw,4rem)]">
        <div className="flex flex-col gap-5 border-b border-hairline pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--green)]">Shows</p>
            <h1 className="mt-2 font-display text-[clamp(2.8rem,7vw,5.8rem)] font-black leading-[0.9] tracking-[-0.06em]">Choose a room.</h1>
          </div>
          <div className="max-w-full overflow-x-auto">
            <div className="flex min-w-max gap-2 pb-1">
              {podcasts.map((show, index) => (
                <button
                  key={show.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "press rounded-full border px-4 py-2 text-sm font-bold",
                    index === activeIndex
                      ? "border-[var(--gold)] bg-[color-mix(in_oklab,var(--gold)_10%,transparent)] text-[var(--gold)]"
                      : "border-hairline bg-surface-2 text-muted-foreground hover:text-foreground",
                  )}
                >
                  {show.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        <article className="relative mt-6 min-h-[78vh] overflow-hidden rounded-[clamp(1.5rem,4vw,3.5rem)] border border-hairline bg-[#050706]">
          {feature && (
            <img
              src={feature.thumbnail}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-28 blur-[1px]"
              loading="eager"
              decoding="async"
            />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,8,6,.98)_0%,rgba(3,8,6,.88)_42%,rgba(3,8,6,.58)_100%)]" />
          <div className="relative z-10 flex min-h-[78vh] flex-col justify-between p-[clamp(1.25rem,4vw,3.5rem)]">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--gold)]">Now browsing</p>
              <h2 className="mt-3 font-display text-[clamp(3rem,8vw,7rem)] font-black leading-[0.86] tracking-[-0.07em]">{activeName}</h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/65">
                {activeShow?.description ?? "A programme listed on The Voice Lounge's public schedule."} YouTube items appear here only when the official channel metadata contains this programme name; no arbitrary video matching is used.
              </p>
            </div>

            {selected.length > 0 ? (
              <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {selected.slice(0, 8).map((video, index) => (
                  <YouTubeVideoCard key={`${activeName}-${video.id}`} video={video} priority={index < 4} className="w-full" />
                ))}
              </div>
            ) : (
              <div className="mt-10 rounded-3xl border border-white/10 bg-black/25 p-8 text-white/70">
                No verified YouTube mapping was found for this programme in the current channel metadata. The programme remains listed because it is present on the official Voice Lounge schedule.
              </div>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
