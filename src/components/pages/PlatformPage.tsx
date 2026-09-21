import { Link } from "@tanstack/react-router";
import { useEffect, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ArrowRight, Crown, Headphones, LogIn, Search } from "lucide-react";
import { Section } from "@/components/sections/SectionRenderer";
import type { SectionSpec } from "@/components/sections/types";
import { useLibrary } from "@/components/system/library";
import { EditableMembershipCard, MEMBERSHIP_CARD_ASSETS } from "@/components/premium/EditableMembershipCard";
import { SearchFilterBar } from "@/components/search/SearchFilterBar";
import { useYouTubeFeed } from "@/components/youtube/YouTubeFeedProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { episodes, podcasts } from "@/lib/content/catalog";
import { createMembershipCardViewModel } from "@/lib/membership/card";
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

const VISITOR_NUMBER_KEY = "tvl-view-number";
function randomVisitorNumber() {
  const minimum = 100000;
  const range = 900000;

  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const value = crypto.getRandomValues(new Uint32Array(1))[0] ?? 0;
    return String(minimum + (value % range));
  }

  return String(minimum + Math.floor(Math.random() * range));
}

function useVisitorNumber() {
  const [visitorNumber, setVisitorNumber] = useState("000000");

  useEffect(() => {
    try {
      const existing = window.sessionStorage.getItem(VISITOR_NUMBER_KEY);
      if (existing) {
        setVisitorNumber(existing);
        return;
      }

      const generated = randomVisitorNumber();
      window.sessionStorage.setItem(VISITOR_NUMBER_KEY, generated);
      setVisitorNumber(generated);
    } catch {
      setVisitorNumber(randomVisitorNumber());
    }
  }, []);

  return visitorNumber;
}

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

function MembershipCardVisual({ premium = false }: { premium?: boolean }) {
  const user = useAuth();
  const visitorNumber = useVisitorNumber();
  const card = createMembershipCardViewModel(user, visitorNumber);

  useEffect(() => {
    [MEMBERSHIP_CARD_ASSETS.logo, MEMBERSHIP_CARD_ASSETS.badge].forEach((src) => {
      const image = new Image();
      image.decoding = "async";
      image.src = src;
    });
  }, []);

  return (
    <div
      className={cn(
        "relative min-h-[15rem] sm:min-h-[18rem] md:min-h-[25rem]",
        premium && "sm:min-h-[20rem]",
      )}
      style={{ perspective: "1200px" }}
    >
      <div
        className={cn(
          "absolute inset-[8%_2%_0_8%] rounded-[3rem] blur-2xl",
          premium
            ? "bg-[radial-gradient(circle_at_50%_45%,color-mix(in_oklab,var(--gold)_20%,transparent),transparent_62%)]"
            : "bg-[radial-gradient(circle_at_50%_45%,color-mix(in_oklab,var(--green)_20%,transparent),transparent_58%)]",
        )}
      />
      <div className="absolute inset-0 grid place-items-center">
        <Link
          to={user ? "/account" : "/login"}
          aria-label={user ? `Membership card for ${user.name}` : "Free viewer welcome card"}
          className="media-shine block w-[94%] max-w-[32rem] overflow-hidden rounded-[4.2%] [transform-style:preserve-3d] md:max-w-[48rem]"
        >
          <EditableMembershipCard
            model={card}
            className="vl-hero-card-enter block w-full select-none"
          />
        </Link>
      </div>
    </div>
  );
}

function HomeMembershipCards() {
  const user = useAuth();
  const visitorNumber = useVisitorNumber();
  const card = createMembershipCardViewModel(user, visitorNumber);
  const [interacting, setInteracting] = useState(false);

  useEffect(() => {
    [MEMBERSHIP_CARD_ASSETS.logo, MEMBERSHIP_CARD_ASSETS.badge].forEach((src) => {
      const image = new Image();
      image.decoding = "async";
      image.src = src;
    });
  }, []);

  function updateTilt(event: ReactPointerEvent<HTMLAnchorElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    event.currentTarget.style.setProperty("--tilt-x", `${((0.5 - py) * 3.2).toFixed(2)}deg`);
    event.currentTarget.style.setProperty("--tilt-y", `${((px - 0.5) * 4.5).toFixed(2)}deg`);
  }

  function resetTilt(target: HTMLAnchorElement) {
    target.style.setProperty("--tilt-x", "0deg");
    target.style.setProperty("--tilt-y", "0deg");
  }

  return (
    <div className="relative min-h-[15rem] sm:min-h-[18rem] md:min-h-[25rem]" style={{ perspective: "1200px" }}>
      <div className="absolute inset-[8%_2%_0_8%] rounded-[3rem] bg-[radial-gradient(circle_at_50%_45%,color-mix(in_oklab,var(--green)_20%,transparent),transparent_58%)] blur-2xl" />
      <div className="absolute inset-0 grid place-items-center">
        <Link
          to={user ? "/account" : "/login"}
          aria-label={user ? `Membership card for ${user.name}` : "Free viewer welcome card"}
          className="hero-card-tilt hero-card-shimmer media-shine block w-[94%] max-w-[32rem] overflow-hidden rounded-[4.2%] md:max-w-[48rem]"
          data-interacting={interacting ? "true" : "false"}
          onPointerEnter={() => setInteracting(true)}
          onPointerMove={updateTilt}
          onPointerLeave={(event) => {
            resetTilt(event.currentTarget);
            setInteracting(false);
          }}
          onPointerDown={(event) => {
            setInteracting(true);
            updateTilt(event);
          }}
          onPointerUp={(event) => {
            resetTilt(event.currentTarget);
            setInteracting(false);
          }}
          onPointerCancel={(event) => {
            resetTilt(event.currentTarget);
            setInteracting(false);
          }}
        >
          <EditableMembershipCard
            model={card}
            className="block w-full select-none"
          />
        </Link>
      </div>
    </div>
  );
}

function PremiumMembershipCard() {
  return <MembershipCardVisual premium />;
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
  query?: string | undefined;
  searchFilter?: SearchFilter | undefined;
}) {
  const info = PAGE_INFO[page];
  const youtubeFeed = useYouTubeFeed();
  const youtubeLed = page === "discover" || page === "shows" || page === "episodes" || page === "watch";
  const youtubeReady = youtubeFeed?.status === "ready";
  const firstTitle = SECTION_TITLES[page][0];
  const heroBadge = page === "home" ? "The Voice Lounge" : firstTitle;
  const premium = page === "premium";
  const live = page === "live";
  const hasHeroVisual = page === "home" || page === "premium";
  return (
    <section id={`01-${slugify(firstTitle)}`} aria-labelledby={`01-${slugify(firstTitle)}-h`} className={cn("vl-section-enter grain hero-wash relative isolate overflow-hidden border-b border-hairline", premium && "bg-[radial-gradient(circle_at_80%_8%,color-mix(in_oklab,var(--gold)_24%,transparent),transparent_34%)]")} data-route-section="1">
      <div className={cn("shell tv-safe grid min-h-[clamp(32rem,74vh,52rem)] items-center gap-6 py-[clamp(3rem,8vw,8rem)]", hasHeroVisual && "md:grid-cols-[minmax(0,0.95fr)_minmax(22rem,1.05fr)]")}>
        <div className="vl-component-enter relative z-10 max-w-3xl">
          <div className="mb-4 flex flex-wrap items-center gap-2"><span className={cn("hyper-glass rounded-full px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.2em]", premium ? "text-[var(--gold)]" : "text-[var(--green)]")}>{heroBadge}</span>{live && <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--live)] px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-white"><span className="size-1.5 rounded-full bg-white" /> On air</span>}</div>
          <h1 id={`01-${slugify(firstTitle)}-h`} className={cn("font-display text-[var(--step-6)] font-black leading-[0.9] tracking-[-0.055em]", premium && "text-gold-foil")}>{info.title}</h1>
          <p className="mt-5 max-w-2xl text-[clamp(1rem,1.4vw,1.3rem)] leading-relaxed text-muted-foreground">
            {page === "home" ? "Sign in to The Voice Lounge for a customized experience" : info.lede}
          </p>
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
          ) : page === "home" ? (
            <div className="mt-7 flex flex-wrap gap-2.5">
              <Link to="/login" search={{ auth: undefined, returnTo: "/account" }} preload="intent" className="press inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--green-action)] px-6 font-bold text-white shadow-glow">
                <LogIn className="size-4" aria-hidden="true" />
                Sign In
              </Link>
              <Link to="/youtube" preload="intent" className="press hyper-glass inline-flex min-h-12 items-center gap-2 rounded-full px-6 font-semibold">
                <Headphones className="size-4" aria-hidden="true" />
                Watch Now
              </Link>
            </div>
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
            <dl className="mt-8 grid max-w-2xl grid-cols-3 gap-2 border-t border-hairline pt-5"><div><dt className="text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">Programme guide</dt><dd className="mt-1 font-display text-xl font-black">{podcasts.length}</dd></div><div><dt className="text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">Public catalogue</dt><dd className="mt-1 font-display text-xl font-black">{episodes.length}</dd></div><div><dt className="text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">Home</dt><dd className="mt-1 font-display text-xl font-black">East London</dd></div></dl>
          )}
        </div>
        <HeroVisual page={page} />
      </div>
    </section>
  );
}

function ExtremeViewportStyles() {
  return <style>{`@keyframes vl-hero-card-enter{0%{opacity:0;transform:perspective(900px) rotateY(-76deg) scale(.96)}100%{opacity:1;transform:perspective(900px) rotateY(0deg) scale(1)}}@keyframes vl-hero-card-flip{0%{opacity:0;transform:perspective(900px) rotateY(-88deg) scale(.94)}20%{opacity:1;transform:perspective(900px) rotateY(0deg) scale(1)}78%{opacity:1;transform:perspective(900px) rotateY(0deg) scale(1)}100%{opacity:0;transform:perspective(900px) rotateY(88deg) scale(.94)}}.vl-hero-card-enter{animation:vl-hero-card-enter .72s cubic-bezier(.16,1,.3,1) both;backface-visibility:hidden;transform-style:preserve-3d}.vl-hero-card-flip{animation:vl-hero-card-flip 2.8s ease-in-out both;backface-visibility:hidden;transform-style:preserve-3d}@media(prefers-reduced-motion:reduce){.vl-hero-card-enter,.vl-hero-card-flip{animation:none}}@media(max-width:319px){:root{--gutter:.5rem;--rail-gap:.45rem;--section-gap:1.75rem;--step-6:clamp(1.8rem,12vw,2.35rem)}.rail-scroll{gap:.45rem;scroll-padding-inline:.5rem}.rail-scroll>*{width:calc(100vw - 1rem)!important;max-width:none!important}.card-lift:hover{transform:none}}@media(min-width:1920px) and (pointer:coarse){body{font-size:1.2rem}button,a{scroll-margin:8vh 5vw}:focus-visible{outline-width:4px;outline-offset:6px}.rail-scroll{gap:clamp(1rem,1.2vw,1.75rem)}}@media(min-width:3840px){:root{--gutter:6rem;--section-gap:7rem;--step-6:8rem}.shell{max-width:3360px}}`}</style>;
}

function AccountIntro() {
  const { saved } = useLibrary();
  const user = useAuth();

  if (!user) {
    return (
      <div className="shell mt-5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground vl-component-enter">
        <span className="hyper-glass rounded-full px-3 py-1.5">Signed out</span>
        <Link to="/login" search={{ auth: undefined, returnTo: "/account" }} className="press rounded-full bg-[var(--green-action)] px-3.5 py-1.5 font-semibold text-white">
          Sign in
        </Link>
        <span className="hyper-glass rounded-full px-3 py-1.5">{saved.length} saved locally</span>
      </div>
    );
  }

  return (
    <div className="shell mt-5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground vl-component-enter">
      <span className="hyper-glass rounded-full px-3 py-1.5">{user.name}</span>
      <span className="hyper-glass rounded-full px-3 py-1.5">{user.email}</span>
      <span className="hyper-glass rounded-full px-3 py-1.5">{user.provider === "google" ? "Google connected" : "Email connected"}</span>
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
  query?: string | undefined;
  searchFilter?: SearchFilter | undefined;
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
  const title = page === "home" ? "The Voice Lounge — Eastern Cape radio, podcasts, video and studio" : `${routeName(page)} | The Voice Lounge`;
  return { meta: [{ title }, { name: "description", content: info.lede }, { property: "og:title", content: title }, { property: "og:description", content: info.lede }, { property: "og:type", content: "website" }] };
}
