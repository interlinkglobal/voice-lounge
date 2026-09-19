import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Crown, Headphones, Search } from "lucide-react";
import { Section } from "@/components/sections/SectionRenderer";
import type { SectionSpec } from "@/components/sections/types";
import { useLibrary } from "@/components/system/library";
import { EditableMembershipCard } from "@/components/premium/EditableMembershipCard";
import { SearchFilterBar } from "@/components/search/SearchFilterBar";
import { useYouTubeFeed } from "@/components/youtube/YouTubeFeedProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { demoProfile, episodes, podcasts } from "@/lib/content/catalog";
import { pageCards, chipsFor, type SearchFilter } from "@/lib/voice-lounge/page-data";
import type { YouTubeFeedVideo } from "@/lib/youtube.functions";
import { PAGE_INFO, SECTION_TITLES, routeName, type PageKey } from "@/lib/voice-lounge/routes";
import {
  actionFor,
  blurbFor,
  editorialBody,
  faqFor,
  layoutFor,
  NewsletterPanel,
  statsFor,
  stepsFor,
  variantFor,
} from "./RoutePanels";
import { cn } from "@/lib/utils";

export type { PageKey } from "@/lib/voice-lounge/routes";

const HERO_MEMBERSHIP_CARDS = [
  {
    id: "casey-t-special-viewer",
    kind: "image",
    src: "https://res.cloudinary.com/dlokees9a/image/upload/v1789548231/card_2_wcrvmy.png",
    alt: "The Voice Lounge premium special viewer card for Casey T.",
    href: "/watch",
  },
  {
    id: "sihle-p-editable-premium-member",
    kind: "component",
    alt: "Editable Voice Lounge premium member card for Sihle P.",
    href: "/premium",
    change: {
      name: "Sihle P.",
      color: "#18e97a",
      date: "18 SEP 2026",
      plan: "PREMIUM MEMBER",
    },
  },
] as const;

function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 62);
}

function makeSection(
  page: PageKey,
  title: string,
  index: number,
  query = "",
  youtubeVideos: YouTubeFeedVideo[] = [],
  searchFilter: SearchFilter = "all",
): SectionSpec {
  const layout = layoutFor(page, title, index);
  const t = title.toLowerCase();
  const spec: SectionSpec = {
    id: `${String(index + 1).padStart(2, "0")}-${slugify(title)}`,
    eyebrow: routeName(page),
    title,
    blurb: blurbFor(page, title),
    layout,
    tone: page === "premium" || t.includes("premium") ? "gold" : t.includes("live") ? "green" : "default",
    priority: page === "premium" ? index < 6 : index < 3,
    action: actionFor(page, title),
  };

  if (layout === "chips") spec.chips = chipsFor(title);
  else if (layout === "faq") spec.faq = faqFor(page);
  else if (layout === "stats") spec.stats = statsFor(page, title);
  else if (layout === "steps") spec.steps = stepsFor();
  else if (layout === "quote") spec.quote = { text: "Premium should not feel like more interface. It should feel like less friction.", who: "Voice Lounge Product Desk", role: "Experience principle" };
  else if (layout === "panel" || layout === "split") {
    spec.body = editorialBody(page, title);
    if (layout === "split") spec.items = pageCards(page, title, index, query, youtubeVideos, searchFilter).slice(0, 4);
  } else if (layout !== "cta") {
    spec.items = pageCards(page, title, index, query, youtubeVideos, searchFilter);
    spec.variant = variantFor(page, title);
    if (layout === "grid") spec.columns = 4;
  }

  if (layout === "cta") {
    spec.body = t.includes("newsletter") || t.includes("follow the voice") ? <NewsletterPanel /> : undefined;
    spec.action = spec.action ?? { label: page === "account" ? "Discover something new" : "Keep exploring", to: page === "account" ? "/discover" : "/podcasts" };
  }
  return spec;
}

function HomeMembershipCards() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    // Warm the CDN cache for the next flips without bundling any card asset.
    HERO_MEMBERSHIP_CARDS.forEach((card) => {
      if (card.kind !== "image") return;
      const image = new Image();
      image.src = card.src;
    });

    const timer = window.setInterval(
      () => setActive((index) => (index + 1) % HERO_MEMBERSHIP_CARDS.length),
      2800,
    );
    return () => window.clearInterval(timer);
  }, []);

  const activeCard = HERO_MEMBERSHIP_CARDS[active] ?? HERO_MEMBERSHIP_CARDS[0];

  return (
    <div className="relative min-h-[15rem] sm:min-h-[18rem] md:min-h-[25rem]" style={{ perspective: "1200px" }}>
      <div className="absolute inset-[8%_2%_0_8%] rounded-[3rem] bg-[radial-gradient(circle_at_50%_45%,color-mix(in_oklab,var(--green)_20%,transparent),transparent_58%)] blur-2xl" />
      <div className="absolute inset-0 grid place-items-center">
        <Link
          key={activeCard.id}
          to={activeCard.href}
          aria-label={activeCard.alt}
          className="media-shine block w-[94%] max-w-[32rem] overflow-hidden rounded-[1.75rem] [transform-style:preserve-3d] md:max-w-[48rem] md:rounded-[2rem]"
        >
          {activeCard.kind === "image" ? (
            <img
              src={activeCard.src}
              alt={activeCard.alt}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              draggable={false}
              className="vl-hero-card-flip block h-auto w-full select-none drop-shadow-[0_24px_34px_rgba(0,0,0,0.5)]"
            />
          ) : (
            <EditableMembershipCard
              change={activeCard.change}
              className="vl-hero-card-flip block w-full select-none drop-shadow-[0_24px_34px_rgba(0,0,0,0.5)]"
            />
          )}
        </Link>
      </div>
    </div>
  );
}

function PremiumMembershipCard() {
  const card = HERO_MEMBERSHIP_CARDS[0];
  return (
    <div className="relative min-h-[16rem] sm:min-h-[20rem] md:min-h-[25rem]" style={{ perspective: "1200px" }}>
      <div className="absolute inset-[10%_3%] rounded-[3rem] bg-[radial-gradient(circle_at_50%_45%,color-mix(in_oklab,var(--gold)_24%,transparent),transparent_62%)] blur-2xl" />
      <Link to={card.href} aria-label={card.alt} className="media-shine premium-geometry absolute inset-0 grid place-items-center overflow-hidden">
        <img src={card.src} alt={card.alt} loading="eager" decoding="async" fetchPriority="high" draggable={false} className="block h-auto w-[96%] max-w-[48rem] select-none drop-shadow-[0_28px_38px_rgba(0,0,0,0.52)]" style={{ animation: "vl-float 6s ease-in-out infinite" }} />
      </Link>
    </div>
  );
}

function HeroVisual({ page }: { page: PageKey }) {
  if (page === "home") return <HomeMembershipCards />;
  if (page === "premium") return <PremiumMembershipCard />;
  return null;
}

function PlatformHero({
  page,
  query = "",
  searchFilter = "all",
}: {
  page: PageKey;
  query?: string;
  searchFilter?: SearchFilter;
}) {
  const info = PAGE_INFO[page];
  const youtubeFeed = useYouTubeFeed();
  const youtubeLed = page === "discover" || page === "shows" || page === "episodes" || page === "watch";
  const youtubeReady = youtubeFeed?.status === "ready";
  const firstTitle = SECTION_TITLES[page][0];
  const premium = page === "premium";
  const live = page === "live";
  const hasHeroVisual = page === "home" || page === "premium";
  return (
    <section id={`01-${slugify(firstTitle)}`} aria-labelledby={`01-${slugify(firstTitle)}-h`} className={cn("vl-section-enter grain hero-wash relative isolate overflow-hidden border-b border-hairline", premium && "bg-[radial-gradient(circle_at_80%_8%,color-mix(in_oklab,var(--gold)_24%,transparent),transparent_34%)]")} data-route-section="1">
      <div className={cn("shell tv-safe grid min-h-[clamp(32rem,74vh,52rem)] items-center gap-6 py-[clamp(3rem,8vw,8rem)]", hasHeroVisual && "md:grid-cols-[minmax(0,0.95fr)_minmax(22rem,1.05fr)]")}>
        <div className="vl-component-enter relative z-10 max-w-3xl">
          <div className="mb-4 flex flex-wrap items-center gap-2"><span className={cn("hyper-glass rounded-full px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.2em]", premium ? "text-[var(--gold)]" : "text-[var(--green)]")}>{firstTitle}</span>{live && <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--live)] px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-white"><span className="size-1.5 rounded-full bg-white" /> On air</span>}</div>
          <h1 id={`01-${slugify(firstTitle)}-h`} className={cn("font-display text-[var(--step-6)] font-black leading-[0.9] tracking-[-0.055em]", premium && "text-gold-foil")}>{info.title}</h1>
          <p className="mt-5 max-w-2xl text-[clamp(1rem,1.4vw,1.3rem)] leading-relaxed text-muted-foreground">{info.lede}</p>
          {page === "search" ? (
            <form action="/search" role="search" className="mt-7 flex max-w-2xl flex-col gap-2 sm:flex-row">
              <label htmlFor="hero-search" className="sr-only">Search everything</label>
              {searchFilter !== "all" && <input type="hidden" name="type" value={searchFilter} />}
              <div className="hyper-glass flex min-h-14 flex-1 items-center gap-3 rounded-full px-5">
                <Search className="size-5 text-muted-foreground" aria-hidden="true" />
                <input
                  id="hero-search"
                  name="q"
                  defaultValue={query}
                  placeholder="Search YouTube titles, descriptions, shows or creators"
                  className="w-full bg-transparent text-base outline-none"
                />
              </div>
              <button type="submit" className="press min-h-14 rounded-full bg-[var(--green-action)] px-7 font-bold text-white">Search</button>
            </form>
          ) : (
            <div className="mt-7 flex flex-wrap gap-2.5"><Link to={info.primary.to} preload="intent" className={cn("press inline-flex min-h-12 items-center gap-2 rounded-full px-6 font-bold", premium ? "bg-[var(--gold)] text-black shadow-gold" : "bg-[var(--green-action)] text-white shadow-glow")}>{premium ? <Crown className="size-4" /> : <Headphones className="size-4" />}{info.primary.label}</Link><Link to={info.secondary.to} preload="intent" className="press hyper-glass inline-flex min-h-12 items-center gap-2 rounded-full px-6 font-semibold">{info.secondary.label}<ArrowRight className="size-4" aria-hidden="true" /></Link></div>
          )}
          {youtubeLed && youtubeReady ? (
            <dl className="mt-8 grid max-w-2xl grid-cols-3 gap-2 border-t border-hairline pt-5">
              <div><dt className="text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">Channel videos</dt><dd className="mt-1 font-display text-xl font-black">{youtubeFeed.totalResults}</dd></div>
              <div><dt className="text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">Source</dt><dd className="mt-1 font-display text-xl font-black">YouTube</dd></div>
              <div><dt className="text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">Playback</dt><dd className="mt-1 font-display text-xl font-black">In-site</dd></div>
            </dl>
          ) : (
            <dl className="mt-8 grid max-w-2xl grid-cols-3 gap-2 border-t border-hairline pt-5"><div><dt className="text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">Catalogue</dt><dd className="mt-1 font-display text-xl font-black">{podcasts.length} shows</dd></div><div><dt className="text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">Episodes</dt><dd className="mt-1 font-display text-xl font-black">{episodes.length}+</dd></div><div><dt className="text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">Languages</dt><dd className="mt-1 font-display text-xl font-black">6 ready</dd></div></dl>
          )}
        </div>
        <HeroVisual page={page} />
      </div>
    </section>
  );
}

function ExtremeViewportStyles() {
  return <style>{`@keyframes vl-hero-card-flip{0%{opacity:0;transform:perspective(900px) rotateY(-88deg) scale(.94)}20%{opacity:1;transform:perspective(900px) rotateY(0deg) scale(1)}78%{opacity:1;transform:perspective(900px) rotateY(0deg) scale(1)}100%{opacity:0;transform:perspective(900px) rotateY(88deg) scale(.94)}}.vl-hero-card-flip{animation:vl-hero-card-flip 2.8s ease-in-out both;backface-visibility:hidden;transform-style:preserve-3d}@media(prefers-reduced-motion:reduce){.vl-hero-card-flip{animation:none}}@media(max-width:319px){:root{--gutter:.5rem;--rail-gap:.45rem;--section-gap:1.75rem;--step-6:clamp(1.8rem,12vw,2.35rem)}.rail-scroll{gap:.45rem;scroll-padding-inline:.5rem}.rail-scroll>*{width:calc(100vw - 1rem)!important;max-width:none!important}.card-lift:hover{transform:none}}@media(min-width:1920px) and (pointer:coarse){body{font-size:1.2rem}button,a{scroll-margin:8vh 5vw}:focus-visible{outline-width:4px;outline-offset:6px}.rail-scroll{gap:clamp(1rem,1.2vw,1.75rem)}}@media(min-width:3840px){:root{--gutter:6rem;--section-gap:7rem;--step-6:8rem}.shell{max-width:3360px}}`}</style>;
}

function AccountIntro() {
  const { saved } = useLibrary();
  const user = useAuth();

  if (!user) {
    return (
      <div className="shell mt-5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground vl-component-enter">
        <span className="hyper-glass rounded-full px-3 py-1.5">Signed out</span>
        <a href="/auth/google?returnTo=%2Faccount" className="press rounded-full bg-[var(--green-action)] px-3.5 py-1.5 font-semibold text-white">
          Continue with Google
        </a>
        <span className="hyper-glass rounded-full px-3 py-1.5">{saved.length} saved locally</span>
      </div>
    );
  }

  return (
    <div className="shell mt-5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground vl-component-enter">
      <span className="hyper-glass rounded-full px-3 py-1.5">{user.name}</span>
      <span className="hyper-glass rounded-full px-3 py-1.5">{user.email}</span>
      <span className="hyper-glass rounded-full px-3 py-1.5">Google connected</span>
      <span className="hyper-glass rounded-full px-3 py-1.5">{saved.length} saved</span>
    </div>
  );
}

export function PlatformPage({
  page,
  query = "",
  searchFilter = "all",
}: {
  page: PageKey;
  query?: string;
  searchFilter?: SearchFilter;
}) {
  const youtubeFeed = useYouTubeFeed();
  const youtubeVideos = youtubeFeed?.status === "ready" ? youtubeFeed.videos : [];
  const sections = SECTION_TITLES[page].slice(1).map((title, offset) =>
    makeSection(page, title, offset + 1, query, youtubeVideos, searchFilter),
  );
  return (
    <div className={cn("pb-[var(--section-gap)]", page === "premium" && "selection:bg-[color-mix(in_oklab,var(--gold)_35%,transparent)]")} data-primary-route={page} data-section-count="20">
      <ExtremeViewportStyles />
      <PlatformHero page={page} query={query} searchFilter={searchFilter} />
      {page === "search" && <SearchFilterBar query={query} active={searchFilter} />}
      {page === "account" && <AccountIntro />}
      {sections.map((spec, index) => <Section key={spec.id} spec={spec} index={index + 1} />)}
    </div>
  );
}

export function routeHead(page: PageKey) {
  const info = PAGE_INFO[page];
  const title = page === "home" ? "The Voice Lounge — South African podcasts, video and live" : `${routeName(page)} | The Voice Lounge`;
  return { meta: [{ title }, { name: "description", content: info.lede }, { property: "og:title", content: title }, { property: "og:description", content: info.lede }, { property: "og:type", content: "website" }] };
}
