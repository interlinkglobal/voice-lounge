import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ExternalLink,
  Globe2,
  Heart,
  Linkedin,
  MessageCircle,
  Play,
  Search,
  Send,
  Youtube,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { useYouTubeFeed } from "@/components/youtube/YouTubeFeedProvider";
import { useYouTubePlayer } from "@/components/youtube/YouTubePlayerProvider";
import { YouTubeVideoCard } from "@/components/youtube/YouTubeFeedGrid";
import { SmartImage } from "@/components/media/SmartImage";
import { AppSelect } from "@/components/ui/AppSelect";
import { categories, creators, podcasts } from "@/lib/content/catalog";
import {
  PODCAST_THUMBNAILS,
  normalizeProgrammeText,
  programmeVideos,
} from "@/lib/content/programme-directory";
import { formatDate } from "@/lib/content/adapters";
import { VOICE_LOUNGE } from "@/lib/voice-lounge/organization";
import { cn } from "@/lib/utils";
import { getYouTubeComments, type YouTubeComment, type YouTubeFeedVideo } from "@/lib/youtube.functions";

type DiscoverTab =
  | "topic"
  | "programme"
  | "person"
  | "format"
  | "language"
  | "province"
  | "mood"
  | "duration"
  | "date";

const DISCOVER_TABS: Array<{ id: DiscoverTab; label: string }> = [
  { id: "topic", label: "Topic" },
  { id: "programme", label: "Programme" },
  { id: "person", label: "Person" },
  { id: "format", label: "Format" },
  { id: "language", label: "Language" },
  { id: "province", label: "Province" },
  { id: "mood", label: "Mood" },
  { id: "duration", label: "Duration" },
  { id: "date", label: "Date" },
];

const PEOPLE_OPTIONS = [
  "Joshua Maponga",
  "Lee Generes",
  "Sivenathi Nazo",
  "Siyanda Vazi",
  "Siyambonga Jara",
  "Sihle Peter Cwenga",
  "Khanya Makhaphela",
  "Khanya Sakube",
  "Kuyasa Kela",
  "Vuyisa Mnyabiso",
  "Sesethu Maneli",
  "Pastor Gugu Mbuku",
  "Pastor Tetese",
  "Duke Maplanka",
];

const DISCOVER_OPTIONS: Record<DiscoverTab, string[]> = {
  topic: categories.map((item) => item.name),
  programme: podcasts.map((item) => item.title),
  person: PEOPLE_OPTIONS,
  format: ["Video", "Hybrid", "Audio"],
  language: ["English", "isiXhosa", "isiZulu", "Afrikaans", "Sesotho", "Setswana"],
  province: ["Eastern Cape", "Gauteng", "Western Cape", "KwaZulu-Natal", "Free State", "Limpopo", "Mpumalanga", "North West", "Northern Cape"],
  mood: ["Current affairs", "Deep dive", "Community", "Music", "Faith", "Culture", "Sport", "Lifestyle"],
  duration: ["Under 10 min", "10–30 min", "30–60 min", "60+ min"],
  date: ["Last 7 days", "Last 30 days", "Last 90 days", "2026"],
};

function podcastImage(id: string) {
  return PODCAST_THUMBNAILS[id] ?? null;
}

function matchesDuration(video: YouTubeFeedVideo, values: string[]) {
  if (!values.length) return true;
  const seconds = video.durationSec;
  if (seconds == null) return false;
  return values.some((value) => {
    if (value === "Under 10 min") return seconds < 600;
    if (value === "10–30 min") return seconds >= 600 && seconds < 1800;
    if (value === "30–60 min") return seconds >= 1800 && seconds < 3600;
    return seconds >= 3600;
  });
}

function matchesDate(video: YouTubeFeedVideo, values: string[]) {
  if (!values.length) return true;
  const published = +new Date(video.publishedAt);
  if (!Number.isFinite(published)) return false;
  const ageDays = (Date.now() - published) / 86_400_000;
  return values.some((value) => {
    if (value === "Last 7 days") return ageDays <= 7;
    if (value === "Last 30 days") return ageDays <= 30;
    if (value === "Last 90 days") return ageDays <= 90;
    return new Date(video.publishedAt).getFullYear() === 2026;
  });
}

export function DiscoverWorkspaceExperience() {
  const feed = useYouTubeFeed();
  const videos = feed?.status === "ready" ? feed.videos : [];
  const [activeTab, setActiveTab] = useState<DiscoverTab>("topic");
  const [query, setQuery] = useState("");
  const [contentType, setContentType] = useState<"all" | "videos" | "podcasts">("all");
  const [selected, setSelected] = useState<Record<DiscoverTab, string[]>>({
    topic: [],
    programme: [],
    person: [],
    format: [],
    language: [],
    province: [],
    mood: [],
    duration: [],
    date: [],
  });

  const selectedCount = Object.values(selected).reduce((sum, values) => sum + values.length, 0);
  const normalizedQuery = normalizeProgrammeText(query);

  const results = useMemo(() => {
    const topicTerms = selected.topic.map(normalizeProgrammeText);
    const programmeTerms = selected.programme.map(normalizeProgrammeText);
    const personTerms = selected.person.map(normalizeProgrammeText);
    const moodTerms = selected.mood.map(normalizeProgrammeText);

    const filteredVideos = contentType === "podcasts"
      ? []
      : videos
          .filter((video) => {
            const haystack = normalizeProgrammeText(`${video.title} ${video.description}`);
            if (normalizedQuery && !haystack.includes(normalizedQuery)) return false;
            if (topicTerms.length && !topicTerms.some((term) => haystack.includes(term))) return false;
            if (programmeTerms.length && !programmeTerms.some((term) => haystack.includes(term))) return false;
            if (personTerms.length && !personTerms.some((term) => haystack.includes(term))) return false;
            if (moodTerms.length && !moodTerms.some((term) => haystack.includes(term))) return false;
            if (selected.format.length && !selected.format.some((value) => value === "Video" || value === "Hybrid")) return false;
            if (selected.language.length && !selected.language.includes("English")) return false;
            if (selected.province.length && !selected.province.includes("Eastern Cape")) return false;
            if (!matchesDuration(video, selected.duration)) return false;
            if (!matchesDate(video, selected.date)) return false;
            return true;
          })
          .slice(0, 24);

    const filteredPodcasts = contentType === "videos"
      ? []
      : podcasts.filter((podcast) => {
          const category = categories.find((item) => item.id === podcast.categoryId)?.name ?? "";
          const haystack = normalizeProgrammeText(`${podcast.title} ${podcast.tagline} ${category}`);
          if (normalizedQuery && !haystack.includes(normalizedQuery)) return false;
          if (selected.topic.length && !selected.topic.includes(category)) return false;
          if (selected.programme.length && !selected.programme.includes(podcast.title)) return false;
          if (selected.format.length && !selected.format.includes(podcast.format)) return false;
          if (selected.language.length && !selected.language.includes(podcast.language)) return false;
          if (selected.province.length && !selected.province.includes(podcast.province)) return false;
          if (selected.person.length || selected.duration.length || selected.date.length) return false;
          return true;
        });

    return { videos: filteredVideos, podcasts: filteredPodcasts };
  }, [contentType, normalizedQuery, selected, videos]);

  function toggle(tab: DiscoverTab, value: string) {
    setSelected((current) => ({
      ...current,
      [tab]: current[tab].includes(value)
        ? current[tab].filter((item) => item !== value)
        : [...current[tab], value],
    }));
  }

  return (
    <div className="shell pb-[var(--section-gap)] pt-[clamp(1rem,2vw,1.5rem)]" data-primary-route="discover">
      <section aria-label="Discovery filters">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_15rem_auto]">
          <label className="relative block">
            <span className="sr-only">Search the Voice Lounge catalogue</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search titles, guests, topics and descriptions"
              className="min-h-12 w-full rounded-none border border-hairline bg-background pl-12 pr-4 outline-none focus:border-[var(--green)]"
            />
          </label>

          <AppSelect
            value={contentType}
            onValueChange={(value) => setContentType(value as typeof contentType)}
            ariaLabel="Content type"
            options={[
              { value: "all", label: "All content" },
              { value: "videos", label: "Videos only" },
              { value: "podcasts", label: "Podcasts only" },
            ]}
            className="min-h-12 w-full rounded-none lg:w-full"
          />

          <button
            type="button"
            onClick={() => {
              setQuery("");
              setContentType("all");
              setSelected({ topic: [], programme: [], person: [], format: [], language: [], province: [], mood: [], duration: [], date: [] });
            }}
            className="press min-h-12 border border-hairline px-5 text-sm font-bold"
          >
            Clear {selectedCount ? `(${selectedCount})` : ""}
          </button>
        </div>

        <div className="mt-4 overflow-x-auto border-y border-hairline" role="tablist" aria-label="Discovery filter groups">
          <div className="flex min-w-max">
            {DISCOVER_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "press min-h-12 border-r border-hairline px-4 text-sm font-bold",
                  activeTab === tab.id ? "bg-surface-2 text-foreground" : "text-muted-foreground",
                )}
              >
                {tab.label}
                {selected[tab.id].length ? <span className="ml-2 text-[var(--green)]">{selected[tab.id].length}</span> : null}
              </button>
            ))}
          </div>
        </div>

        <div className="border-b border-hairline py-4" role="tabpanel">
          <div className="flex flex-wrap gap-2">
            {DISCOVER_OPTIONS[activeTab].map((option) => {
              const active = selected[activeTab].includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggle(activeTab, option)}
                  className={cn(
                    "press min-h-11 rounded-full border px-4 text-sm font-semibold",
                    active
                      ? "border-[var(--green)] bg-[color-mix(in_oklab,var(--green)_12%,transparent)] text-foreground"
                      : "border-hairline text-muted-foreground hover:text-foreground",
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mt-6" aria-live="polite">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-hairline pb-3">
          <h1 className="font-display text-[clamp(1.5rem,4vw,2.5rem)] font-black">Discover</h1>
          <p className="text-xs text-muted-foreground">{results.videos.length + results.podcasts.length} matches shown</p>
        </div>

        {results.podcasts.length > 0 && (
          <div className="grid gap-3 md:grid-cols-2">
            {results.podcasts.map((podcast, index) => (
              <Link
                key={podcast.id}
                to="/podcasts/$slug"
                params={{ slug: podcast.slug }}
                className="press grid min-h-24 grid-cols-[6rem_minmax(0,1fr)_auto] items-center border border-hairline bg-card/35"
              >
                <SmartImage src={podcastImage(podcast.id)} fallbackRatio="1:1" alt="" className="h-full w-24 object-cover" loading="lazy" decoding="async" />
                <span className="min-w-0 px-4 py-3">
                  <span className="block truncate font-display font-black">{podcast.title}</span>
                  <span className="mt-1 block line-clamp-1 text-sm text-muted-foreground">{podcast.tagline}</span>
                </span>
                <ArrowRight className="mr-4 size-4 text-muted-foreground" aria-hidden="true" />
              </Link>
            ))}
          </div>
        )}

        {results.videos.length > 0 && (
          <div className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-3", results.podcasts.length && "mt-6")}>
            {results.videos.map((video, index) => (
              <YouTubeVideoCard key={video.id} video={video} priority={index < 3} className="w-full" />
            ))}
          </div>
        )}

        {results.videos.length === 0 && results.podcasts.length === 0 && (
          <div className="border border-hairline p-8 text-center">
            <Search className="mx-auto size-6 text-muted-foreground" aria-hidden="true" />
            <h2 className="mt-3 font-display text-xl font-bold">No exact matches</h2>
            <p className="mt-2 text-sm text-muted-foreground">Remove a filter or broaden the search.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function inferProgramme(video: YouTubeFeedVideo) {
  for (const podcast of podcasts) {
    if (programmeVideos([video], podcast.slug, podcast.title).length) return podcast;
  }
  return null;
}

export function EpisodesDirectoryExperience() {
  const feed = useYouTubeFeed();
  const player = useYouTubePlayer();
  const videos = feed?.status === "ready" ? feed.videos : [];
  const [programme, setProgramme] = useState("all");
  const [visible, setVisible] = useState(30);

  const filtered = useMemo(() => {
    const source = programme === "all"
      ? videos
      : (() => {
          const show = podcasts.find((item) => item.id === programme);
          return show ? programmeVideos(videos, show.slug, show.title) : [];
        })();
    return [...source].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  }, [programme, videos]);

  return (
    <div className="shell pb-[var(--section-gap)] pt-[clamp(1rem,2vw,1.5rem)]" data-primary-route="episodes">
      <div className="mb-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-black">Voice Lounge episodes</h1>
          <p className="mt-1 text-sm text-muted-foreground">Browse the official upload catalogue by programme.</p>
        </div>
        <AppSelect
          value={programme}
          onValueChange={(value) => {
            setProgramme(value);
            setVisible(30);
          }}
          ariaLabel="Filter episodes by programme"
          options={[
            { value: "all", label: "All programmes" },
            ...podcasts.map((podcast) => ({ value: podcast.id, label: podcast.title })),
          ]}
          className="w-full sm:w-64"
        />
      </div>

      <div className="grid gap-2 lg:grid-cols-2">
        {filtered.slice(0, visible).map((video) => {
          const show = inferProgramme(video);
          return (
            <button
              key={video.id}
              type="button"
              onClick={() => player.open(video)}
              className="press grid min-h-[5.25rem] grid-cols-[20%_minmax(0,1fr)_auto] items-stretch gap-0 overflow-hidden border border-hairline bg-card/35 text-left hover:border-[color-mix(in_oklab,var(--green)_45%,var(--hairline))]"
            >
              <span className="relative min-h-full overflow-hidden bg-black">
                <SmartImage src={video.thumbnail} fallbackRatio="16:9" alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
                <span className="absolute inset-0 grid place-items-center bg-black/18"><Play className="size-4 fill-white text-white" aria-hidden="true" /></span>
              </span>
              <span className="min-w-0 self-center px-3 py-2">
                <span className="block line-clamp-2 text-sm font-bold">{video.title}</span>
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                  {show?.title ?? "The Voice Lounge"}{video.publishedAt ? ` · ${formatDate(video.publishedAt)}` : ""}
                </span>
              </span>
              <Play className="mr-3 size-4 self-center text-[var(--green)]" aria-hidden="true" />
            </button>
          );
        })}
      </div>

      {visible < filtered.length && (
        <button
          type="button"
          onClick={() => setVisible((value) => value + 30)}
          className="press mt-5 min-h-11 w-full border border-hairline px-5 text-sm font-bold"
        >
          Load more episodes
        </button>
      )}
    </div>
  );
}

interface GuestProfile {
  name: string;
  description: string;
  aliases?: string[] | undefined;
  links?: Array<{ label: string; url: string; kind: "website" | "linkedin" }>;
}

const GUESTS: GuestProfile[] = [
  { name: "Lee Generes", description: "Music guest who joined Narcho Mabizela for a Voice Lounge conversation about her music journey, identity, ambition and entertainment." },
  { name: "Sivenathi Nazo", description: "Guest on Beyond The Grey for a conversation about Ward 18, local priorities, community issues and representation." },
  { name: "Siyanda Vazi", description: "Founder of Ubomi Foundation SA, featured on The Triumph in a conversation about child and community-development work.", links: [{ label: "Website", url: "https://infoubomifoundationsa.org/about", kind: "website" }] },
  { name: "Siyambonga Jara", description: "Wills and estate-planning specialist featured on The Breakfast Plug during National Wills Week.", links: [{ label: "LinkedIn", url: "https://za.linkedin.com/in/siyambonga-jara-6228795a", kind: "linkedin" }] },
  { name: "Sihle Peter Cwenga", description: "Beyond The Grey guest for a discussion breaking down issues raised in the President's recent letter." },
  { name: "Khanya Makhaphela", description: "Accounting professional featured in a Voice Lounge sit-down covering career development, professional challenges and owning an accounting firm.", aliases: ["Khanya Makapela"], links: [{ label: "LinkedIn", url: "https://za.linkedin.com/in/khanya-makapela-bap-sa-376732190", kind: "linkedin" }] },
  { name: "Khanya Sakube", description: "Beyond The Grey guest in a discussion about youth development, community-building and constructive recreational spaces." },
  { name: "Kuyasa Kela", description: "East London-born visual artist featured on Beyond The Grey discussing Xhosa identity, culture, heritage and whether art can challenge tradition.", links: [{ label: "Profile", url: "https://newworkwits.co.za/project/kuyasa-kela/", kind: "website" }, { label: "LinkedIn", url: "https://za.linkedin.com/in/kuyasa-kela-12a68912b", kind: "linkedin" }] },
  { name: "Vuyisa Mnyabiso", description: "Founder associated with the God Is Able Feeding Centre, featured in a community conversation about feeding more than 200 people weekly.", aliases: ["Vuyiswa Mnyabiso"] },
  { name: "Sesethu-Isipho Maneli", description: "Voice Lounge artist and guest whose appearances developed into a larger artist-development and recording story for the organisation.", aliases: ["Sesethu Maneli", "Sesethu"] },
  { name: "Pastor Gugu Mbuku", description: "Faith guest and presenter featured in sessions on spiritual empowerment, transitions, personal limitations and themes from I Had To Leave To Live." },
  { name: "Pastor Tetese", description: "Koinonia guest featured in spiritual reflection and biblical teaching around 1 Samuel 17:34." },
  { name: "Duke Maplanka Atterball", description: "Guest in a Voice Lounge conversation about migration, South African public life, human rights and ubuntu.", aliases: ["Duke Atterbell Maplanka", "Duke Maplanka"] },
  { name: "Joshua Maponga", description: "Recurring long-form guest in a cluster of Voice Lounge conversations on African identity, faith, spirituality, geopolitics and leadership.", links: [{ label: "Website", url: "http://www.joshuamaponga.com", kind: "website" }, { label: "LinkedIn", url: "https://za.linkedin.com/in/joshua-iii-marara-maponga-793ba921", kind: "linkedin" }] },
  { name: "Dr Noma Mbeki", description: "Refuel Lounge guest identified in the public Voice Lounge research baseline as an entrepreneur, philanthropist and musician in a long-form September 2026 upload." },
  { name: "Goldmax", description: "Music guest identified in the public Voice Lounge release record through an August 2026 Refuel Lounge interview.", aliases: ["Gold Max"] },
  { name: "Woza Bakzin", description: "Music guest identified in the public Voice Lounge release record through an August 2026 Refuel Lounge interview.", aliases: ["Woza Bakzin"] },
  { name: "Apostle S Khoza", description: "Named principal voice in a Voice Lounge on-demand catalogue item recovered in the public research baseline." },
];

export function GuestsExperience() {
  const feed = useYouTubeFeed();
  const videos = feed?.status === "ready" ? feed.videos : [];

  return (
    <div className="shell pb-[var(--section-gap)] pt-[clamp(1rem,3vw,2rem)]" data-primary-route="guests">
      <div className="mb-5 border-b border-hairline pb-4">
        <h1 className="font-display text-[clamp(2rem,5vw,4rem)] font-black tracking-[-0.05em]">Voice Lounge guests</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">Named guests recoverable from the public Voice Lounge catalogue and research baseline.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {GUESTS.map((guest) => {
          const terms = [guest.name, ...(guest.aliases ?? [])].map(normalizeProgrammeText);
          const appearance = videos.find((video) => {
            const haystack = normalizeProgrammeText(`${video.title} ${video.description}`);
            return terms.some((term) => haystack.includes(term));
          });
          return (
            <article key={guest.name} className="border border-hairline bg-card/40 p-5">
              <div className="flex items-start gap-4">
                <img
                  src={appearance?.thumbnail ?? "/voice-lounge-card-logo.png"}
                  alt={appearance ? `Voice Lounge appearance featuring ${guest.name}` : ""}
                  className="size-20 shrink-0 rounded-full border border-hairline bg-black object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="min-w-0">
                  <h2 className="font-display text-xl font-black">{guest.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{guest.description}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {appearance && (
                  <a href={appearance.watchUrl} target="_blank" rel="noreferrer" className="press inline-flex min-h-10 items-center gap-2 rounded-full border border-hairline px-3 text-xs font-bold">
                    <Youtube className="size-4" aria-hidden="true" /> Voice Lounge appearance
                  </a>
                )}
                {guest.links?.map((link) => (
                  <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="press inline-flex min-h-10 items-center gap-2 rounded-full border border-hairline px-3 text-xs font-bold">
                    {link.kind === "linkedin" ? <Linkedin className="size-4" aria-hidden="true" /> : <Globe2 className="size-4" aria-hidden="true" />}
                    {link.label}
                  </a>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export function CommunityExperience() {
  const user = useAuth();
  const [comments, setComments] = useState<YouTubeComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState("");
  const [visible, setVisible] = useState(12);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;
    void getYouTubeComments()
      .then((items) => {
        if (active) setComments(items);
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setCommentsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || visible >= comments.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible((value) => Math.min(value + 12, comments.length));
        }
      },
      { rootMargin: "320px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [comments.length, visible]);

  function submitComment(event: React.FormEvent) {
    event.preventDefault();
    if (!user) {
      window.location.assign("/login?returnTo=%2Fcommunity");
      return;
    }
    if (!draft.trim()) return;
    setNotice("Website comment publishing is not connected yet. Your draft has not been stored.");
  }

  return (
    <div className="shell pb-[var(--section-gap)] pt-[clamp(1rem,3vw,2rem)]" data-primary-route="community">
      <section className="mx-auto max-w-5xl">
        <form onSubmit={submitComment} className="border border-hairline bg-card/40 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full border border-hairline bg-surface-2">
              {user?.picture ? <SmartImage src={user.picture} fallbackRatio="1:1" alt="" className="size-full object-cover" referrerPolicy="no-referrer" /> : <MessageCircle className="size-4" aria-hidden="true" />}
            </div>
            <div className="min-w-0 flex-1">
              <label htmlFor="community-comment" className="font-display text-sm font-bold">Add a website comment</label>
              <textarea
                id="community-comment"
                value={draft}
                onChange={(event) => {
                  setDraft(event.target.value);
                  setNotice("");
                }}
                rows={3}
                placeholder={user ? "Share your thoughts…" : "Sign in to prepare a website comment…"}
                className="mt-2 w-full resize-y rounded-none border border-hairline bg-background p-3 text-sm outline-none focus:border-[var(--green)]"
              />
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">Website persistence is intentionally not connected yet.</p>
                <button type="submit" className="press inline-flex min-h-11 items-center gap-2 bg-[var(--green-action)] px-4 text-sm font-bold text-white">
                  <Send className="size-4" aria-hidden="true" /> {user ? "Post" : "Sign in"}
                </button>
              </div>
              {notice && <p role="status" className="mt-3 border border-hairline p-3 text-xs text-muted-foreground">{notice}</p>}
            </div>
          </div>
        </form>

        <div className="mt-5 border-b border-hairline pb-3">
          <h1 className="font-display text-2xl font-black">Community comments</h1>
          <p className="mt-1 text-sm text-muted-foreground">Recent public discussion from the official Voice Lounge YouTube channel, alongside the website comment interface.</p>
        </div>

        <div className="grid gap-4 py-4">
          {comments.slice(0, visible).map((comment, index) => {
            const alignRight = index % 2 === 1;
            return (
              <article
                key={comment.id}
                className={cn(
                  "w-[min(92%,44rem)] border border-hairline bg-card/45 p-4 sm:p-5",
                  alignRight ? "ml-auto" : "mr-auto",
                )}
              >
                <div className={cn("flex gap-3", alignRight && "sm:flex-row-reverse")}>
                  <SmartImage
                    src={comment.authorImage}
                    fallbackRatio="1:1"
                    alt=""
                    className="size-11 shrink-0 rounded-full border border-hairline bg-black object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className={cn("min-w-0 flex-1", alignRight && "sm:text-right")}>
                    <div className={cn("flex flex-wrap items-center gap-x-2 gap-y-1", alignRight && "sm:justify-end")}>
                      {comment.authorChannelUrl ? (
                        <a href={comment.authorChannelUrl} target="_blank" rel="noreferrer" className="font-bold hover:underline">{comment.authorName}</a>
                      ) : (
                        <span className="font-bold">{comment.authorName}</span>
                      )}
                      <span className="text-[0.65rem] font-black uppercase tracking-[0.12em] text-[var(--green)]">YouTube</span>
                      {comment.publishedAt && <span className="text-xs text-muted-foreground">{formatDate(comment.publishedAt)}</span>}
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6">{comment.text}</p>
                    <div className={cn("mt-3 flex items-center gap-4 text-xs text-muted-foreground", alignRight && "sm:justify-end")}>
                      <span className="inline-flex items-center gap-1"><Heart className="size-3.5" aria-hidden="true" /> {comment.likeCount}</span>
                      {comment.videoId && (
                        <a href={`https://www.youtube.com/watch?v=${encodeURIComponent(comment.videoId)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-foreground">
                          View video <ExternalLink className="size-3.5" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div ref={sentinelRef} aria-hidden="true" className="h-2" />
        {visible < comments.length && <p className="text-center text-xs text-muted-foreground">Loading more comments…</p>}

        {commentsLoading && (
          <div className="border border-hairline p-6 text-sm text-muted-foreground">Loading recent community comments…</div>
        )}
        {!commentsLoading && comments.length === 0 && (
          <div className="border border-hairline p-6 text-sm text-muted-foreground">No public YouTube comments were returned by the channel API.</div>
        )}
      </section>
    </div>
  );
}

function creatorShowNames(creatorId: string) {
  const creator = creators.find((item) => item.id === creatorId);
  if (!creator) return [];
  return creator.shows
    .map((id) => podcasts.find((podcast) => podcast.id === id)?.title)
    .filter((value): value is string => Boolean(value));
}

const AVAILABLE_CREATORS = creators.filter((creator) =>
  creator.id !== "crt-network"
  && (creator.artwork.src || creator.shows.length > 0),
);

export function CreatorsExperience() {
  return (
    <div className="shell pb-[var(--section-gap)] pt-[clamp(1rem,3vw,2rem)]" data-primary-route="creators">
      <div className="mb-5 border-b border-hairline pb-4">
        <h1 className="font-display text-[clamp(2rem,5vw,4rem)] font-black tracking-[-0.05em]">Creators & hosts</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">Only creator profiles with recoverable programme associations or usable public profile imagery are shown.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {AVAILABLE_CREATORS.map((creator) => {
          const shows = creatorShowNames(creator.id);
          return (
            <Link key={creator.id} to="/creators/$slug" params={{ slug: creator.slug }} className="press border border-hairline bg-card/40 p-4">
              {creator.artwork.src ? (
                <img src={creator.artwork.src} alt={creator.artwork.alt} className="aspect-square w-full object-cover" loading="lazy" decoding="async" />
              ) : (
                <div className="grid aspect-square w-full place-items-center bg-surface-2 font-display text-5xl font-black text-[var(--green)]" aria-hidden="true">
                  {creator.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                </div>
              )}
              <h2 className="mt-4 font-display text-xl font-black">{creator.name}</h2>
              <p className="mt-1 text-sm font-semibold text-[var(--green)]">{creator.role}</p>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{creator.bio}</p>
              {shows.length > 0 && <p className="mt-3 text-xs text-muted-foreground">{shows.join(" · ")}</p>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function CreatorStoryExperience({ slug }: { slug: string }) {
  const creator = creators.find((item) => item.slug === slug && item.id !== "crt-network");
  if (!creator || !(creator.artwork.src || creator.shows.length > 0)) {
    return (
      <div className="shell grid min-h-[65vh] place-items-center py-12 text-center">
        <div>
          <h1 className="font-display text-3xl font-black">Creator profile unavailable</h1>
          <Link to="/creators" className="mt-5 inline-flex min-h-11 items-center border border-hairline px-5 text-sm font-bold">Back to creators</Link>
        </div>
      </div>
    );
  }
  const shows = creatorShowNames(creator.id);

  return (
    <article className="shell mx-auto max-w-5xl py-[clamp(1.5rem,5vw,4rem)]">
      <div className="grid gap-6 md:grid-cols-[minmax(14rem,22rem)_minmax(0,1fr)] md:items-start">
        {creator.artwork.src ? (
          <img src={creator.artwork.src} alt={creator.artwork.alt} className="aspect-square w-full object-cover" />
        ) : (
          <div className="grid aspect-square w-full place-items-center bg-surface-2 font-display text-7xl font-black text-[var(--green)]" aria-hidden="true">
            {creator.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
          </div>
        )}
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--green)]">Voice Lounge creator</p>
          <h1 className="mt-2 font-display text-[clamp(2.5rem,7vw,5rem)] font-black leading-[.92] tracking-[-0.055em]">{creator.name}</h1>
          <p className="mt-3 text-lg font-semibold">{creator.role}</p>
          <div className="prose prose-neutral mt-6 max-w-none dark:prose-invert">
            <p>{creator.bio}</p>
            <p>
              The current public Voice Lounge programme record places {creator.name} within the East London, Eastern Cape media network
              {shows.length ? ` through ${shows.join(", ")}` : ""}. This profile intentionally stays within verified public programme associations rather than inventing private biography or contact details.
            </p>
            <p>
              The Voice Lounge publishes programme-derived video and interview content through its first-party website and official YouTube channel. As additional approved biography, social and production credits become available, this profile can expand without changing its canonical creator URL.
            </p>
          </div>
          {shows.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {creator.shows.map((id) => {
                const show = podcasts.find((podcast) => podcast.id === id);
                return show ? (
                  <Link key={id} to="/shows/$slug" params={{ slug: show.slug }} className="press min-h-10 rounded-full border border-hairline px-4 py-2 text-sm font-bold">{show.title}</Link>
                ) : null;
              })}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export function AboutResearchExperience() {
  return (
    <article className="pb-[var(--section-gap)]" data-primary-route="about">
      <header className="shell grid gap-6 border-b border-hairline py-[clamp(2rem,6vw,5rem)] lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,.75fr)] lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--green)]">The Voice Lounge · East London, South Africa</p>
          <h1 className="about-title mt-3 text-[clamp(2.8rem,7vw,6.25rem)] font-bold leading-[.94]">A multimedia home for Eastern Cape voices.</h1>
          <p className="mt-6 max-w-3xl text-[clamp(1rem,1.5vw,1.25rem)] leading-8 text-muted-foreground">
            The Voice Lounge is an East London multimedia organisation spanning online radio, video podcasts and interviews, recording-studio work, editorial coverage, artist development, mobile applications and commercial media.
          </p>
        </div>
        <img src="/voice-lounge-card-logo.png" alt="The Voice Lounge" className="mx-auto w-full max-w-sm object-contain" />
      </header>

      <div className="shell mx-auto max-w-6xl">
        <section className="grid gap-8 py-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <h2>What The Voice Lounge is</h2>
            <p>
              Public evidence shows a business that has moved well beyond a conventional podcast archive. The organisation began as a podcast concept and developed into a broader media operation built around online radio, filmed conversations, recurring programmes, a recording studio, news and editorial publishing, mobile apps, advertising products and record-label activity.
            </p>
            <p>
              South African press reporting dates the online-radio launch to <strong>1 August 2025</strong>. By 2026, the public programme schedule covered current affairs, music, interviews, sport, lifestyle, community development and faith. That breadth is why this website treats The Voice Lounge as a media network containing shows, episodes, people, articles and live broadcasts instead of flattening everything into one generic podcast feed.
            </p>
          </div>
          <aside className="border border-hairline bg-card/40 p-5">
            <h3 className="font-display text-lg font-black">Public identity</h3>
            <dl className="mt-4 grid gap-4 text-sm">
              <div><dt className="text-muted-foreground">Base</dt><dd className="mt-1 font-semibold">East London · Eastern Cape · South Africa</dd></div>
              <div><dt className="text-muted-foreground">Online radio launch</dt><dd className="mt-1 font-semibold">1 August 2025</dd></div>
              <div><dt className="text-muted-foreground">Public programme slate</dt><dd className="mt-1 font-semibold">18 recurring programme identities</dd></div>
            </dl>
          </aside>
        </section>

        <section className="border-t border-hairline py-[clamp(2.5rem,6vw,5rem)]">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="prose prose-neutral max-w-none dark:prose-invert">
              <h2>Programming built around people and place</h2>
              <p>
                The current schedule includes The Breakfast Plug, Beyond The Grey, Refuel Lounge, 3-2-6 Lounge, The VoiceLounge Sitting, The Sports Lounge, After Dark Lounge, Spirit & Truth, The Triumph Lounge, Solitude Lounge, Connect & Learn, The Weekend Gateaway, The Music Lounge, The Logos Moment, The Grace Connection, The Chapter Lounge, Rhythm & Sound Lounge and Koinonia — The Fellowship.
              </p>
              <p>
                These programmes connect the network to public life in the Eastern Cape while also reaching into national conversations on identity, religion, music, careers, social development and politics. Guests documented in the public catalogue include Joshua Maponga, Lee Generes, Sivenathi Nazo, Siyanda Vazi, Siyambonga Jara, Sihle Peter Cwenga, Khanya Makhaphela, Khanya Sakube, Kuyasa Kela, Vuyisa Mnyabiso, Sesethu Maneli, Pastor Gugu Mbuku and Pastor Tetese.
              </p>
              <p>
                The result is a catalogue whose strongest organising model is <em>show → episode/broadcast → clip → person</em>. That structure is more useful to listeners, search engines and research systems than a flat stream of disconnected cards.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                "/images/podcasts/beyond-the-grey.jpg",
                "/images/podcasts/refuel-lounge.jpg",
                "/images/podcasts/triumph-lounge.jpg",
                "/images/podcasts/koinonia-the-fellowship.jpg",
              ].map((src) => <img key={src} src={src} alt="" className="aspect-square w-full object-cover" loading="lazy" decoding="async" />)}
            </div>
          </div>
        </section>

        <section className="border-t border-hairline py-[clamp(2.5rem,6vw,5rem)]">
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <h2>Video, radio, studio and mobile distribution</h2>
            <p>
              The Voice Lounge distributes publicly through its own website, an official YouTube channel, Facebook, X and native Android and iOS applications. The public footprint is particularly video-centric: long-form interviews, show-derived segments and live material are distributed through YouTube while the first-party site provides programme context, Premium access, editorial coverage and organisation information.
            </p>
            <p>
              The recording studio adds another layer. Public contact material explicitly invites studio bookings, and press reporting connects the organisation to music production and artist development. In March 2026, Daily Dispatch reported that Sesethu Maneli became the first artist signed to The Voice Lounge's newly launched record label; later reporting covered a Voice Lounge-produced live recording.
            </p>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {VOICE_LOUNGE.socials.map((item) => (
              <a key={item.platform} href={item.url} target="_blank" rel="noreferrer" className="press flex min-h-14 items-center justify-between border border-hairline px-4 font-bold">
                {item.platform}<ExternalLink className="size-4" aria-hidden="true" />
              </a>
            ))}
            {VOICE_LOUNGE.apps.map((item) => (
              <a key={item.platform} href={item.url} target="_blank" rel="noreferrer" className="press flex min-h-14 items-center justify-between border border-hairline px-4 font-bold">
                {item.label}<ExternalLink className="size-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>

        <section className="border-t border-hairline py-[clamp(2.5rem,6vw,5rem)]">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="prose prose-neutral max-w-none dark:prose-invert">
              <h2>Audience and public reach</h2>
              <p>
                The research baseline found Facebook to be the strongest directly discoverable social signal, at approximately 214,100 followers on 20 September 2026. Earlier Daily Dispatch reporting recorded management claims of 67,000 subscribers and 18.8 million views by November 2025, followed by about 22 million Facebook views in early 2026. Those figures refer to different metrics and periods and should not be added together.
              </p>
              <p>
                The South African App Store listing also provided a different indicator of traction: the app was listed at No. 2 in Entertainment with a 4.5/5 rating from six ratings in the research snapshot, while Google Play showed 1K+ installs. These platform-specific indicators should remain separate from listening, viewing and social metrics.
              </p>
            </div>
            <div className="prose prose-neutral max-w-none dark:prose-invert">
              <h2>Commercial model</h2>
              <p>
                The Voice Lounge's public commercial proposition includes Premium membership, integrated advertising across live radio, video podcasts and editorial articles, host-read endorsements, sponsored podcast seasons, banners and in-house audio-advertising production. The website also positions the recording studio as a bookable service.
              </p>
              <p>
                Premium is publicly advertised at R9.99 per month after a seven-day trial, with benefits including uninterrupted live streaming, studio audio, exclusive podcasts, back-catalogue access, broadcaster shout-outs and real-time notifications or reminders.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-hairline py-[clamp(2.5rem,6vw,5rem)]">
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <h2>Leadership, editorial record and industry validation</h2>
            <p>
              Public reporting identifies Lungisa Sigobelwana as a senior Voice Lounge leader associated with the recording-studio and business operations. Daily Dispatch reported Thobeka Buswana's appointment as station manager in November 2025 and described her prior broadcasting and management experience. Music producer Nqubeko Mbatha has also appeared publicly around the organisation's record-label activity, although the research baseline does not establish a definitive current contractual title for him.
            </p>
            <p>
              Daily Dispatch and The Herald have documented station growth, management, artist development and Voice Lounge-associated music activity. The site's own news archive now preserves sourced summaries of relevant public reporting while linking readers back to original publishers where available.
            </p>
          </div>
        </section>

        <section className="border-t border-hairline py-[clamp(2.5rem,6vw,5rem)]">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="prose prose-neutral max-w-none dark:prose-invert">
              <h2>Research notes and known gaps</h2>
              <p>
                A useful research page must distinguish confirmed facts from gaps. The public research did not verify a canonical podcast RSS feed, Spotify show ID, Apple Podcasts show ID, lifetime episode total, complete production-team roster, official Instagram identity, TikTok account, LinkedIn company page, audited audience demographics, public rate card or complete sponsor roster.
              </p>
              <p>
                The official public contact record is clearer: 043 050 6570, +27 83 950 7019 and Info@thevoicelounge.co.za are published organisation contacts, with talent@thevoicelounge.co.za appearing in talent material. Public sources conflict on the current East London street address, so this site intentionally does not present an unverified street address as authoritative.
              </p>
              <p>
                This page is built from the project's 20 September 2026 public-research baseline. It is intended to evolve as first-party data, approved biographies, platform analytics and media documentation become available.
              </p>
            </div>
            <aside className="border border-hairline bg-card/40 p-5">
              <h3 className="font-display text-lg font-black">Research links</h3>
              <div className="mt-4 grid gap-2">
                <a href="https://www.thevoicelounge.co.za/" target="_blank" rel="noreferrer" className="press flex min-h-11 items-center justify-between border border-hairline px-3 text-sm font-bold">Legacy public site <ExternalLink className="size-4" /></a>
                <a href="https://www.youtube.com/@THEVOICELOUNGE" target="_blank" rel="noreferrer" className="press flex min-h-11 items-center justify-between border border-hairline px-3 text-sm font-bold">Official YouTube <ExternalLink className="size-4" /></a>
                <Link to="/news" className="press flex min-h-11 items-center justify-between border border-hairline px-3 text-sm font-bold">News archive <ArrowRight className="size-4" /></Link>
                <Link to="/guests" className="press flex min-h-11 items-center justify-between border border-hairline px-3 text-sm font-bold">Guest directory <ArrowRight className="size-4" /></Link>
                <Link to="/shows" className="press flex min-h-11 items-center justify-between border border-hairline px-3 text-sm font-bold">Programme schedule <ArrowRight className="size-4" /></Link>
              </div>
            </aside>
          </div>
        </section>

        <section className="border-y border-hairline py-[clamp(2.5rem,6vw,5rem)]">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <h2 className="font-display text-[clamp(2rem,5vw,4rem)] font-black tracking-[-0.05em]">Contact The Voice Lounge</h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">Business enquiries, studio bookings, talent and media conversations can use the organisation's published channels.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href={`mailto:${VOICE_LOUNGE.contact.email}`} className="press min-h-11 border border-hairline px-4 py-2.5 text-sm font-bold">{VOICE_LOUNGE.contact.email}</a>
              <a href={`tel:${VOICE_LOUNGE.contact.mobile.replace(/\s+/g, "")}`} className="press min-h-11 bg-[var(--green-action)] px-4 py-2.5 text-sm font-bold text-white">{VOICE_LOUNGE.contact.mobile}</a>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}
