import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Globe2, Headphones, LogIn, LogOut, ShieldCheck, Zap } from "lucide-react";
import type { CardVariant } from "@/components/media/MediaCard";
import type { SectionSpec } from "@/components/sections/types";
import { episodes, plans, podcasts, creators } from "@/lib/content/catalog";
import { VERIFIED_APPS, VERIFIED_SOCIALS, VOICE_LOUNGE } from "@/lib/voice-lounge/organization";
import type { PageKey } from "@/lib/voice-lounge/routes";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";

export function blurbFor(page: PageKey, title: string) {
  const t = title.toLowerCase();
  if (t.includes("live")) return "Programming happening now, starting soon or ready to replay.";
  if (t.includes("creator") || t.includes("host")) return "The people shaping South African audio, video and conversation.";
  if (t.includes("news") || page === "news") return "Reporting and editorial from The Voice Lounge newsroom.";
  if (t.includes("premium")) return "A quieter, faster and more considered layer of the platform.";
  if (t.includes("search")) return "Narrow the catalogue without losing the joy of stumbling onto something unexpected.";
  if (t.includes("continue")) return "Resume exactly where you left off across listening and viewing.";
  if (t.includes("category") || t.includes("browse")) return "Move through the catalogue by subject, language, place and format.";
  if (page === "community") return "Recommendations and reactions from listeners across the platform.";
  if (page === "about") return "The public story of an East London multimedia organisation that grew from podcasting into online radio, studio production, editorial work, a record label and mobile apps.";
  return "A curated shelf from across The Voice Lounge, refreshed with South African voices.";
}

export function variantFor(page: PageKey, title: string): CardVariant {
  const t = title.toLowerCase();
  if (page === "creators" || t.includes("creator") || t.includes("host") || t.includes("voices")) return "creator";
  if (page === "news" || t.includes("news") || t.includes("stories")) return "news";
  if (page === "live" || t.includes("live")) return "live";
  if (page === "premium" || t.includes("premium")) return "premium";
  if (page === "watch" || t.includes("video") || t.includes("clips") || t.includes("session")) return "landscape";
  if (t.includes("continue")) return "continue";
  return "standard";
}

export function layoutFor(page: PageKey, title: string, index: number): SectionSpec["layout"] {
  const t = title.toLowerCase();
  if (t.includes("faq") && page !== "premium") return "faq";
  if (t.includes("final ") || t.includes(" cta") || t.includes("join/sign-in") || t.includes("become a")) return "cta";
  if (t.includes("browse by") || t.includes("language spotlight") || t.includes("all categories") || t.includes("search by") || t.includes("choose your mood") || t.includes("trending categories") || t.includes("emerging categories")) return "chips";
  if (page === "account") {
    if (t.includes("continue") || t.includes("saved") || t.includes("history") || t.includes("following") || t.includes("watch later") || t.includes("playlists")) return "rail";
    if (t.includes("profile details") || t.includes("premium membership")) return "stats";
    if (t.includes("language")) return "chips";
    return "panel";
  }
  if (page === "about") {
    if (t.includes("timeline")) return "steps";
    if (t.includes("audience")) return "stats";
    if (t.includes("creators") || t.includes("team")) return "rail";
    if (t.includes("contact")) return "cta";
    return index % 3 === 0 ? "split" : "panel";
  }
  if (page === "premium") {
    if (t.includes("membership tier") || t.includes("comparison") || t.includes("checkout") || t.includes("multi-device") || t.includes("member profile")) return "panel";
    if (t.includes("testimonials")) return "quote";
    if (t.includes("benefits") || t.includes("audio quality")) return "stats";
    if (t.includes("final join")) return "cta";
  }
  if (page === "community" && (t.includes("poll") || t.includes("guidelines") || t.includes("challenge"))) return "panel";
  if (page === "search" && (t.includes("recent searches") || t.includes("trending searches") || t.includes("related searches"))) return "chips";
  if (page === "search" && t.includes("no-result")) return "panel";
  if (page === "live" && t.includes("set reminder")) return "panel";
  if (t.includes("featured") || t.includes("editor's") || t.includes("top result")) return index % 2 ? "featured" : "editorial";
  if (t.includes("top 10") || t.includes("charts") || t.includes("most played") || t.includes("most read")) return "ranked";
  if (t.includes("complete ") || t.includes("directory") || t.includes("library") || t.includes("explorer") || t.includes("archive")) return "grid";
  if (index % 7 === 0) return "mosaic";
  return "rail";
}

export function faqFor(page: PageKey) {
  if (page === "live") return [
    { q: "Is the new website's live player connected?", a: "Not yet. Gate 1 replaces invented content with verified Voice Lounge information; live-stream integration is a separate production system." },
    { q: "Where is The Voice Lounge based?", a: "The public research identifies The Voice Lounge as an East London / Eastern Cape media organisation." },
    { q: "When did the online-radio operation launch?", a: "South African press reporting records the launch date as 1 August 2025." },
  ];
  return [
    { q: "What is Voice Lounge Premium?", a: "The public Voice Lounge website advertises a seven-day trial followed by R9.99 per month, with premium live and podcast benefits." },
    { q: "Will this upgraded preview charge me?", a: "No. Payment processing is not connected in Gate 1, so this interface cannot create a paid subscription." },
    { q: "Where else can I use The Voice Lounge?", a: "Verified Android and iOS applications are publicly available, alongside the official website, YouTube, Facebook and X profiles." },
  ];
}

export function statsFor(page: PageKey, title: string) {
  const t = title.toLowerCase();
  if (page === "account" && t.includes("profile")) return [
    { k: "Authentication", v: "Supabase" },
    { k: "Saved library", v: "Browser-local" },
    { k: "Account sync", v: "Not connected" },
    { k: "Identity", v: "Email / Google" },
  ];
  if (page === "account" && t.includes("premium")) return [
    { k: "Public price", v: `R${VOICE_LOUNGE.premium.monthlyPriceZar}/month` },
    { k: "Trial", v: `${VOICE_LOUNGE.premium.trialDays} days` },
    { k: "Billing", v: "Not connected" },
    { k: "Source", v: "Public site" },
  ];
  if (page === "about" && t.includes("audience")) return [
    { k: "Home", v: "East London" },
    { k: "Province", v: "Eastern Cape" },
    { k: "Online radio", v: "Since 1 Aug 2025" },
    { k: "Footprint", v: "Web + apps + social" },
  ];
  if (page === "premium") return [
    { k: "Price", v: `R${VOICE_LOUNGE.premium.monthlyPriceZar}/month` },
    { k: "Trial", v: `${VOICE_LOUNGE.premium.trialDays} days` },
    { k: "Public benefit", v: "Premium streams" },
    { k: "Billing here", v: "Not connected" },
  ];
  return [
    { k: "Programmes", v: String(podcasts.length) },
    { k: "Public catalogue", v: `${episodes.length} items` },
    { k: "Listed voices", v: String(creators.filter((item) => item.id !== "crt-network").length) },
    { k: "Home", v: "East London" },
  ];
}

export function stepsFor() {
  return [
    { k: "Listen", v: "Start with a show, episode or live room." },
    { k: "Follow", v: "Keep the creators you care about close." },
    { k: "Return", v: "Resume across history, saves and playlists." },
    { k: "Go deeper", v: "Move from episodes into news, community and events." },
  ];
}

export function actionFor(page: PageKey, title: string) {
  const t = title.toLowerCase();
  if (t.includes("premium") || page === "premium") return { label: "Explore Premium", to: "/premium" };
  if (t.includes("creator")) return { label: "Meet creators", to: "/creators" };
  if (t.includes("news")) return { label: "Read the newsroom", to: "/news" };
  if (t.includes("live")) return { label: "Open Live", to: "/live" };
  if (t.includes("community")) return { label: "Join the conversation", to: "/community" };
  if (t.includes("podcast")) return { label: "Browse podcasts", to: "/podcasts" };
  if (t.includes("video") || t.includes("watch")) return { label: "Watch", to: "/watch" };
  if (t.includes("discover") || t.includes("surprise")) return { label: "Discover more", to: "/discover" };
  return undefined;
}


function AccountSecurityPanel() {
  const user = useAuth();

  if (!user) {
    return (
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg font-bold">Sign in to The Voice Lounge</p>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Google sign-in creates a secure server-side session. Your Google password is never handled by The Voice Lounge.
          </p>
        </div>
        <a
          href="/auth/google?returnTo=%2Faccount"
          className="press inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--green-action)] px-5 font-semibold text-white"
        >
          <LogIn className="size-4" aria-hidden="true" />
          Continue with Google
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        {user.picture ? (
          <img src={user.picture} alt="" referrerPolicy="no-referrer" className="size-12 rounded-full object-cover" />
        ) : (
          <div className="grid size-12 place-items-center rounded-full border border-hairline bg-surface-2">
            <ShieldCheck className="size-5 text-[var(--green)]" aria-hidden="true" />
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-bold">{user.name}</p>
          <p className="truncate text-sm text-muted-foreground">{user.email}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--green)]">Google account connected</p>
        </div>
      </div>
      <form action="/auth/logout" method="post">
        <button type="submit" className="press inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-hairline bg-surface-2 px-5 font-semibold">
          <LogOut className="size-4" aria-hidden="true" />
          Sign out
        </button>
      </form>
    </div>
  );
}

function PreferencePanel({ title }: { title: string }) {
  const [enabled, setEnabled] = useState(true);
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div><p className="font-display text-lg font-bold">{title}</p><p className="mt-1 max-w-xl text-sm text-muted-foreground">This preference currently stays on this browser. Account-backed persistence is not connected yet.</p></div>
      <button type="button" aria-pressed={enabled} onClick={() => setEnabled((v) => !v)} className={cn("press inline-flex min-w-32 items-center justify-center rounded-full px-5 py-3 text-sm font-semibold", enabled ? "bg-[var(--green-action)] text-white" : "border border-hairline bg-surface-2")}>{enabled ? "Enabled" : "Disabled"}</button>
    </div>
  );
}

export function NewsletterPanel() {
  return (
    <div className="mt-5">
      <p className="font-display text-lg font-bold">Follow The Voice Lounge</p>
      <p className="mt-1 max-w-xl text-sm text-muted-foreground">No verified public newsletter was found in the research. Use the confirmed social channels and native apps instead.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {VERIFIED_SOCIALS.map((item) => <a key={item.platform} href={item.url} target="_blank" rel="noreferrer" className="press rounded-full border border-hairline px-4 py-2 text-sm font-semibold">{item.platform}</a>)}
        {VERIFIED_APPS.map((item) => <a key={item.platform} href={item.url} target="_blank" rel="noreferrer" className="press rounded-full border border-hairline px-4 py-2 text-sm font-semibold">{item.label}</a>)}
      </div>
    </div>
  );
}

function PremiumPlans() {
  return (
    <div className="grid gap-3 lg:grid-cols-3">
      {plans.map((plan) => (
        <article key={plan.id} className={cn("relative rounded-3xl border p-5 sm:p-7", plan.highlight ? "border-[color-mix(in_oklab,var(--gold)_60%,transparent)] bg-[color-mix(in_oklab,var(--gold)_9%,var(--card))] shadow-gold" : "border-hairline bg-card")}>
          {plan.highlight && <span className="absolute right-4 top-4 rounded-full bg-[var(--gold)] px-3 py-1 text-xs font-black text-black">Public offer</span>}
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold)]">{plan.name}</p>
          <p className="mt-3 font-display text-4xl font-black">{plan.priceZar === 0 ? "Free" : `R${plan.priceZar}`}{plan.priceZar > 0 && <span className="ml-1 text-sm font-medium text-muted-foreground">/ month</span>}</p>
          <p className="mt-2 text-sm text-muted-foreground">{plan.summary}</p>
          <ul className="mt-5 grid gap-2 text-sm">{plan.perks.map((perk) => <li key={perk} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-[var(--green)]" aria-hidden="true" /><span>{perk}</span></li>)}</ul>
        </article>
      ))}
    </div>
  );
}

function PremiumComparison() {
  return (
    <div className="rounded-3xl border border-hairline bg-card p-5 sm:p-7">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold)]">Publicly advertised premium</p>
      <h3 className="mt-2 font-display text-2xl font-black">7-day trial · R9.99/month</h3>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">The verified public proposition includes uninterrupted live streaming, studio audio, exclusive podcasts, premium back-catalogues, broadcaster shout-outs and real-time notifications/reminders. Payment activation is intentionally outside Gate 1.</p>
    </div>
  );
}

function PremiumAccessStatus() {
  return (
    <div className="rounded-3xl border border-hairline bg-card p-5 sm:p-7">
      <ShieldCheck className="size-8 text-[var(--green)]" aria-hidden="true" />
      <h3 className="mt-3 font-display text-xl font-bold">No payment flow is connected here</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">Gate 1 establishes factual pricing and benefits only. A future billing implementation must confirm the current processor and subscription semantics before charging users.</p>
    </div>
  );
}

function CommunityPanel({ title }: { title: string }) {
  const [vote, setVote] = useState<string | null>(null);
  return <div><p className="font-display text-lg font-bold">{title}</p><p className="mt-1 text-sm text-muted-foreground">A lightweight community interaction ready for authenticated user data later.</p><div className="mt-4 flex flex-wrap gap-2">{["More long-form interviews", "More programme clips", "More live schedule updates"].map((option) => <button type="button" key={option} onClick={() => setVote(option)} className={cn("press rounded-full border px-4 py-2 text-sm", vote === option ? "border-[var(--green)] bg-[color-mix(in_oklab,var(--green)_12%,transparent)]" : "border-hairline")}>{vote === option ? "✓ " : ""}{option}</button>)}</div></div>;
}

export function editorialBody(page: PageKey, title: string) {
  const t = title.toLowerCase();
  if (page === "premium" && t.includes("membership tier")) return <PremiumPlans />;
  if (page === "premium" && t.includes("comparison")) return <PremiumComparison />;
  if (page === "premium" && (t.includes("access") || t.includes("checkout"))) return <div className="grid gap-6"><div className="grid gap-3 md:grid-cols-3">{faqFor("premium").map((item) => <article key={item.q} className="rounded-2xl border border-hairline bg-surface-2 p-4"><h3 className="font-display font-bold">{item.q}</h3><p className="mt-2 text-sm text-muted-foreground">{item.a}</p></article>)}</div><PremiumAccessStatus /></div>;
  if (page === "account" && t.includes("account security")) return <AccountSecurityPanel />;
  if (page === "account") return <PreferencePanel title={title} />;
  if (page === "community" && (t.includes("poll") || t.includes("challenge"))) return <CommunityPanel title={title} />;
  if (page === "live" && t.includes("set reminder")) return <PreferencePanel title="Live reminders" />;
  if (page === "search" && t.includes("no-result")) return <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-display text-lg font-bold">Nothing useful yet?</p><p className="text-sm text-muted-foreground">Try a creator, city, category or topic instead of a full sentence.</p></div><Link to="/discover" className="press rounded-full bg-[var(--green-action)] px-5 py-3 text-sm font-semibold text-white">Open discovery</Link></div>;
  if (page === "about") return <div className="grid gap-4 md:grid-cols-3">{[["East London", "The Voice Lounge publicly positions itself as an Eastern Cape media hub based in East London."], ["From podcast to multimedia", "Press reporting documents growth from a podcast concept into online radio, a recording studio and record-label activity."], ["Public footprint", "The organisation publishes through its website, YouTube, Facebook, X and verified Android and iOS apps."]].map(([k, v]) => <div key={k} className="rounded-2xl bg-surface-2 p-4"><p className="font-display font-bold">{k}</p><p className="mt-1 text-sm text-muted-foreground">{v}</p></div>)}</div>;
  return <div className="grid gap-4 md:grid-cols-3"><div className="rounded-2xl bg-surface-2 p-4"><Zap className="size-5 text-[var(--green)]" /><p className="mt-3 font-display font-bold">Fast by design</p><p className="mt-1 text-sm text-muted-foreground">Priority content arrives first; the rest streams in as you approach it.</p></div><div className="rounded-2xl bg-surface-2 p-4"><Globe2 className="size-5 text-[var(--gold)]" /><p className="mt-3 font-display font-bold">South African context</p><p className="mt-1 text-sm text-muted-foreground">Language, province and creator identity stay visible throughout discovery.</p></div><div className="rounded-2xl bg-surface-2 p-4"><Headphones className="size-5 text-[var(--green)]" /><p className="mt-3 font-display font-bold">Made to continue</p><p className="mt-1 text-sm text-muted-foreground">The persistent player keeps the active episode alive while you browse.</p></div></div>;
}
