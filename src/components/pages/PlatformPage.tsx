import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Crown, Headphones, Search } from "lucide-react";
import { Section } from "@/components/sections/SectionRenderer";
import type { SectionSpec } from "@/components/sections/types";
import { useLibrary } from "@/components/system/library";
import { demoProfile, episodes, podcasts } from "@/lib/content/catalog";
import { pageCards, chipsFor } from "@/lib/voice-lounge/page-data";
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
    src: "/card 2.png",
    alt: "The Voice Lounge premium special viewer card for Casey T.",
    href: "/watch",
  },
  {
    id: "emihle-s-special-guest-host",
    src: "/card 1.png",
    alt: "The Voice Lounge premium special guest host card for Emihle S.",
    href: "/shows",
  },
  {
    id: "sihle-p-premium-member",
    src: "/card 3.png",
    alt: "The Voice Lounge premium member card for Sihle P.",
    href: "/premium",
  },
] as const;

function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 62);
}

function makeSection(page: PageKey, title: string, index: number, query = ""): SectionSpec {
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
    if (layout === "split") spec.items = pageCards(page, title, index, query).slice(0, 4);
  } else if (layout !== "cta") {
    spec.items = pageCards(page, title, index, query);
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
    const timer = window.setInterval(() => setActive((index) => (index + 1) % HERO_MEMBERSHIP_CARDS.length), 1500);
    return () => window.clearInterval(timer);
  }, []);

  const mobileCard = HERO_MEMBERSHIP_CARDS[active] ?? HERO_MEMBERSHIP_CARDS[0];

  return (
    <div className="relative min-h-[15rem] sm:min-h-[18rem] md:min-h-[25rem]" style={{ perspective: "1200px" }}>
      <div className="absolute inset-[8%_2%_0_8%] rounded-[3rem] bg-[radial-gradient(circle_at_50%_45%,color-mix(in_oklab,var(--green)_20%,transparent),transparent_58%)] blur-2xl" />

      <div className="absolute inset-0 grid place-items-center md:hidden">
        <Link key={mobileCard.id} to={mobileCard.href} aria-label={mobileCard.alt} className="block w-[94%] max-w-[32rem] [transform-style:preserve-3d]">
          <img
            src={mobileCard.src}
            alt={mobileCard.alt}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            draggable={false}
            className="vl-mobile-card-flip block h-auto w-full select-none drop-shadow-[0_22px_30px_rgba(0,0,0,0.5)]"
          />
        </Link>
      </div>

      <div className="absolute inset-0 hidden md:block">
        {HERO_MEMBERSHIP_CARDS.map((card, i) => {
          const transforms = [
            "translate3d(-11%,8%,0) rotateY(16deg) rotateZ(-7deg)",
            "translate3d(25%,-3%,55px) rotateY(-10deg) rotateZ(5deg)",
            "translate3d(4%,38%,95px) rotateY(7deg) rotateZ(-1deg)",
          ];
          return (
            <Link
              key={card.id}
              to={card.href}
              aria-label={card.alt}
              className={cn(
                "absolute w-[64%] transition-[filter] duration-200 hover:brightness-110 focus-visible:brightness-110",
                i === 0 ? "left-[4%] top-[14%]" : i === 1 ? "right-[2%] top-[5%]" : "left-[20%] top-[40%]",
              )}
              style={{ transform: transforms[i], transformStyle: "preserve-3d" }}
            >
              <img
                src={card.src}
                alt={card.alt}
                loading="eager"
                decoding="async"
                fetchPriority={i === 2 ? "high" : "auto"}
                draggable={false}
                className="block h-auto w-full select-none drop-shadow-[0_24px_34px_rgba(0,0,0,0.48)]"
                style={{ animation: `vl-float ${4.2 + i * 0.65}s ease-in-out ${i * -0.7}s infinite` }}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function PremiumMembershipCard() {
  const card = HERO_MEMBERSHIP_CARDS[0];
  return (
    <div className="relative min-h-[16rem] sm:min-h-[20rem] md:min-h-[25rem]" style={{ perspective: "1200px" }}>
      <div className="absolute inset-[10%_3%] rounded-[3rem] bg-[radial-gradient(circle_at_50%_45%,color-mix(in_oklab,var(--gold)_24%,transparent),transparent_62%)] blur-2xl" />
      <Link to={card.href} aria-label={card.alt} className="absolute inset-0 grid place-items-center">
        <img
          src={card.src}
          alt={card.alt}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          draggable={false}
          className="block h-auto w-[96%] max-w-[48rem] select-none drop-shadow-[0_28px_38px_rgba(0,0,0,0.52)]"
          style={{ animation: "vl-float 6s ease-in-out infinite" }}
        />
      </Link>
    </div>
  );
}

function HeroVisual({ page }: { page: PageKey }) {
  if (page === "home") return <HomeMembershipCards />;
  if (page === "premium") return <PremiumMembershipCard />;
  return null;
}

function PlatformHero({ page, query = "" }: { page: PageKey; query?: string }) {
  const info = PAGE_INFO[page];
  const firstTitle = SECTION_TITLES[page][0];
  const premium = page === "premium";
  const live = page === "live";
  const hasHeroVisual = page === "home" || page === "premium";
  return (
    <section id={`01-${slugify(firstTitle)}`} aria-labelledby={`01-${slugify(firstTitle)}-h`} className={cn("grain hero-wash relative isolate overflow-hidden border-b border-hairline", premium && "bg-[radial-gradient(circle_at_80%_8%,color-mix(in_oklab,var(--gold)_24%,transparent),transparent_34%)]")} data-route-section="1">
      <div className={cn("shell tv-safe grid min-h-[clamp(32rem,74vh,52rem)] items-center gap-6 py-[clamp(3rem,8vw,8rem)]", hasHeroVisual && "md:grid-cols-[minmax(0,0.95fr)_minmax(22rem,1.05fr)]")}>
        <div className="relative z-10 max-w-3xl">
          <div className="mb-4 flex flex-wrap items-center gap-2"><span className={cn("rounded-full border px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.2em]", premium ? "border-[var(--gold)] text-[var(--gold)]" : "border-[var(--green)] text-[var(--green)]")}>{firstTitle}</span>{live && <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--live)] px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-white"><span className="size-1.5 rounded-full bg-white" /> On air</span>}</div>
          <h1 id={`01-${slugify(firstTitle)}-h`} className={cn("font-display text-[var(--step-6)] font-black leading-[0.9] tracking-[-0.055em]", premium && "text-gold-foil")}>{info.title}</h1>
          <p className="mt-5 max-w-2xl text-[clamp(1rem,1.4vw,1.3rem)] leading-relaxed text-muted-foreground">{info.lede}</p>
          {page === "search" ? (
            <form action="/search" role="search" className="mt-7 flex max-w-2xl flex-col gap-2 sm:flex-row"><label htmlFor="hero-search" className="sr-only">Search everything</label><div className="flex min-h-14 flex-1 items-center gap-3 rounded-full border border-hairline bg-[var(--glass)] px-5 backdrop-blur"><Search className="size-5 text-muted-foreground" aria-hidden="true" /><input id="hero-search" name="q" defaultValue={query} placeholder="Try “Amapiano”, “business” or a creator name" className="w-full bg-transparent text-base outline-none" /></div><button type="submit" className="press min-h-14 rounded-full bg-[var(--green-action)] px-7 font-bold text-white">Search</button></form>
          ) : (
            <div className="mt-7 flex flex-wrap gap-2.5"><Link to={info.primary.to} preload="intent" className={cn("press inline-flex min-h-12 items-center gap-2 rounded-full px-6 font-bold", premium ? "bg-[var(--gold)] text-black shadow-gold" : "bg-[var(--green-action)] text-white shadow-glow")}>{premium ? <Crown className="size-4" /> : <Headphones className="size-4" />}{info.primary.label}</Link><Link to={info.secondary.to} preload="intent" className="press inline-flex min-h-12 items-center gap-2 rounded-full border border-hairline bg-[var(--glass)] px-6 font-semibold backdrop-blur">{info.secondary.label}<ArrowRight className="size-4" aria-hidden="true" /></Link></div>
          )}
          <dl className="mt-8 grid max-w-2xl grid-cols-3 gap-2 border-t border-hairline pt-5"><div><dt className="text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">Catalogue</dt><dd className="mt-1 font-display text-xl font-black">{podcasts.length} shows</dd></div><div><dt className="text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">Episodes</dt><dd className="mt-1 font-display text-xl font-black">{episodes.length}+</dd></div><div><dt className="text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">Languages</dt><dd className="mt-1 font-display text-xl font-black">6 ready</dd></div></dl>
        </div>
        <HeroVisual page={page} />
      </div>
    </section>
  );
}

function ExtremeViewportStyles() {
  return <style>{`@keyframes vl-mobile-card-flip{0%{opacity:0;transform:perspective(900px) rotateY(-88deg) scale(.94)}20%{opacity:1;transform:perspective(900px) rotateY(0deg) scale(1)}78%{opacity:1;transform:perspective(900px) rotateY(0deg) scale(1)}100%{opacity:0;transform:perspective(900px) rotateY(88deg) scale(.94)}}.vl-mobile-card-flip{animation:vl-mobile-card-flip 1.5s ease-in-out both;backface-visibility:hidden}@media(prefers-reduced-motion:reduce){.vl-mobile-card-flip{animation:none}}@media(max-width:319px){:root{--gutter:.5rem;--rail-gap:.45rem;--section-gap:1.75rem;--step-6:clamp(1.8rem,12vw,2.35rem)}.rail-scroll{gap:.45rem;scroll-padding-inline:.5rem}.rail-scroll>*{width:calc(100vw - 1rem)!important;max-width:none!important}.card-lift:hover{transform:none}}@media(min-width:1920px) and (pointer:coarse){body{font-size:1.2rem}button,a{scroll-margin:8vh 5vw}:focus-visible{outline-width:4px;outline-offset:6px}.rail-scroll{gap:clamp(1rem,1.2vw,1.75rem)}}@media(min-width:3840px){:root{--gutter:6rem;--section-gap:7rem;--step-6:8rem}.shell{max-width:3360px}}`}</style>;
}

function AccountIntro() {
  const { saved } = useLibrary();
  return <div className="shell mt-5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><span className="rounded-full border border-hairline bg-surface-2 px-3 py-1.5">{demoProfile.handle}</span><span className="rounded-full border border-hairline bg-surface-2 px-3 py-1.5">{saved.length} saved</span><span className="rounded-full border border-hairline bg-surface-2 px-3 py-1.5">Member since 2024</span></div>;
}

export function PlatformPage({ page, query = "" }: { page: PageKey; query?: string }) {
  const sections = SECTION_TITLES[page].slice(1).map((title, offset) => makeSection(page, title, offset + 1, query));
  return <div className={cn("pb-[var(--section-gap)]", page === "premium" && "selection:bg-[color-mix(in_oklab,var(--gold)_35%,transparent)]")} data-primary-route={page} data-section-count="20"><ExtremeViewportStyles /><PlatformHero page={page} query={query} />{page === "account" && <AccountIntro />}{sections.map((spec, index) => <Section key={spec.id} spec={spec} index={index + 1} />)}</div>;
}

export function routeHead(page: PageKey) {
  const info = PAGE_INFO[page];
  const title = page === "home" ? "The Voice Lounge — South African podcasts, video and live" : `${routeName(page)} | The Voice Lounge`;
  return { meta: [{ title }, { name: "description", content: info.lede }, { property: "og:title", content: title }, { property: "og:description", content: info.lede }, { property: "og:type", content: "website" }] };
}
