import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Globe2, Headphones, LogIn, LogOut, ShieldCheck, Zap } from "lucide-react";
import type { CardVariant } from "@/components/media/MediaCard";
import type { SectionSpec } from "@/components/sections/types";
import { demoProfile, episodes, liveEvents, plans, podcasts, creators } from "@/lib/content/catalog";
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
  if (page === "about") return "How The Voice Lounge thinks about the work, the audience and the future of African audio.";
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
    { q: "Can I watch after a live event ends?", a: "Yes. Events marked for replay move into the replay catalogue after processing." },
    { q: "Do reminders send real notifications?", a: "This build stores reminder intent locally; production push and email delivery can be connected later." },
    { q: "Are live audience counts verified?", a: "Counts in this seeded build are demonstration values, not real audience measurement." },
  ];
  return [
    { q: "What is Voice Lounge Premium?", a: "A mock membership experience for ad-free listening, early access, premium rooms and enhanced media quality." },
    { q: "Will I be charged?", a: "No. This interface demonstrates the intended membership flow and does not process a real payment." },
    { q: "Can I cancel?", a: "The production membership system should support self-service cancellation and clear billing controls." },
  ];
}

export function statsFor(page: PageKey, title: string) {
  const t = title.toLowerCase();
  if (page === "account" && t.includes("profile")) return [
    { k: "Member", v: demoProfile.displayName }, { k: "Home", v: demoProfile.city },
    { k: "Minutes listened", v: demoProfile.minutesListened.toLocaleString("en-ZA") }, { k: "Languages", v: String(demoProfile.languages.length) },
  ];
  if (page === "account" && t.includes("premium")) return [
    { k: "Plan", v: demoProfile.premium ? "Premium" : "Lounge" }, { k: "Status", v: "Active" }, { k: "Devices", v: "3 / 6" }, { k: "Renewal", v: "Monthly" },
  ];
  if (page === "about" && t.includes("audience")) return [
    { k: "Home market", v: "South Africa" }, { k: "Formats", v: "Audio + Video" }, { k: "Languages", v: "6 ready" }, { k: "Ambition", v: "Africa-wide" },
  ];
  if (page === "premium") return [
    { k: "Ad breaks", v: "0" }, { k: "Early access", v: "Included" }, { k: "Devices", v: "Up to 6" }, { k: "Member rooms", v: "Included" },
  ];
  return [
    { k: "Catalogue", v: `${podcasts.length} shows` }, { k: "Episodes", v: `${episodes.length} seeded` }, { k: "Creators", v: `${creators.length} voices` }, { k: "Live", v: `${liveEvents.length} events` },
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
      <div><p className="font-display text-lg font-bold">{title}</p><p className="mt-1 max-w-xl text-sm text-muted-foreground">This demo stores the interface state locally. Production account persistence can attach it to the signed-in profile.</p></div>
      <button type="button" aria-pressed={enabled} onClick={() => setEnabled((v) => !v)} className={cn("press inline-flex min-w-32 items-center justify-center rounded-full px-5 py-3 text-sm font-semibold", enabled ? "bg-[var(--green-action)] text-white" : "border border-hairline bg-surface-2")}>{enabled ? "Enabled" : "Disabled"}</button>
    </div>
  );
}

export function NewsletterPanel() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  return (
    <form className="mt-5 flex max-w-xl flex-col gap-2 sm:flex-row" onSubmit={(e) => { e.preventDefault(); if (email.includes("@")) setSubmitted(true); }}>
      <label className="sr-only" htmlFor="newsletter-email">Email address</label>
      <input id="newsletter-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.co.za" className="min-h-12 flex-1 rounded-full border border-hairline bg-surface-2 px-4 outline-none" />
      <button type="submit" className="press min-h-12 rounded-full bg-[var(--green-action)] px-6 font-semibold text-white">{submitted ? "You're on the list" : "Follow The Voice"}</button>
    </form>
  );
}

function PremiumPlans() {
  return (
    <div className="grid gap-3 lg:grid-cols-3">
      {plans.map((plan) => (
        <article key={plan.id} className={cn("relative rounded-3xl border p-5 sm:p-7", plan.highlight ? "border-[color-mix(in_oklab,var(--gold)_60%,transparent)] bg-[color-mix(in_oklab,var(--gold)_9%,var(--card))] shadow-gold" : "border-hairline bg-card")}>
          {plan.highlight && <span className="absolute right-4 top-4 rounded-full bg-[var(--gold)] px-3 py-1 text-xs font-black text-black">Most curated</span>}
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
  const rows = [["Advertising", "Included", "None"], ["Early Originals", "Standard release", "Early access"], ["Offline saves", "—", "Included"], ["Creator rooms", "—", "Included"], ["Devices", "2", "6"]];
  return <div className="overflow-x-auto rounded-2xl border border-hairline"><table className="w-full min-w-[34rem] text-left text-sm"><thead className="bg-surface-2"><tr><th className="p-4">Experience</th><th className="p-4">Lounge</th><th className="p-4 text-[var(--gold)]">Premium</th></tr></thead><tbody>{rows.map((row) => <tr key={row[0]} className="border-t border-hairline"><th className="p-4 font-semibold">{row[0]}</th><td className="p-4 text-muted-foreground">{row[1]}</td><td className="p-4 font-semibold">{row[2]}</td></tr>)}</tbody></table></div>;
}

function MockCheckout() {
  const [selected, setSelected] = useState("premium");
  const [complete, setComplete] = useState(false);
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
      <div className="rounded-3xl border border-[color-mix(in_oklab,var(--gold)_40%,transparent)] bg-[color-mix(in_oklab,var(--gold)_7%,var(--card))] p-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold)]">Mock checkout</p><h3 className="mt-2 font-display text-2xl font-extrabold">Choose the experience</h3>
        <div className="mt-4 grid gap-2">{plans.filter((p) => p.priceZar > 0).map((plan) => <button key={plan.id} type="button" onClick={() => setSelected(plan.id.replace("plan-", ""))} className={cn("press flex items-center justify-between rounded-2xl border p-4 text-left", selected === plan.id.replace("plan-", "") ? "border-[var(--gold)] bg-[color-mix(in_oklab,var(--gold)_10%,transparent)]" : "border-hairline")}><span><strong>{plan.name}</strong><span className="block text-xs text-muted-foreground">{plan.summary}</span></span><span className="font-display text-xl font-black">R{plan.priceZar}</span></button>)}</div>
      </div>
      <div className="rounded-3xl border border-hairline bg-card p-5"><ShieldCheck className="size-8 text-[var(--green)]" aria-hidden="true" /><h3 className="mt-3 font-display text-xl font-bold">{complete ? "Preview complete" : "No payment will be taken"}</h3><p className="mt-2 text-sm text-muted-foreground">This is a polished membership preview. A real billing provider is intentionally not connected.</p><button type="button" onClick={() => setComplete(true)} className="press mt-5 w-full rounded-full bg-[var(--gold)] px-5 py-3 font-bold text-black">{complete ? "Premium preview activated" : "Preview membership"}</button></div>
    </div>
  );
}

function CommunityPanel({ title }: { title: string }) {
  const [vote, setVote] = useState<string | null>(null);
  return <div><p className="font-display text-lg font-bold">{title}</p><p className="mt-1 text-sm text-muted-foreground">A lightweight community interaction ready for authenticated user data later.</p><div className="mt-4 flex flex-wrap gap-2">{["More long-form interviews", "More live rooms", "More isiZulu shows"].map((option) => <button type="button" key={option} onClick={() => setVote(option)} className={cn("press rounded-full border px-4 py-2 text-sm", vote === option ? "border-[var(--green)] bg-[color-mix(in_oklab,var(--green)_12%,transparent)]" : "border-hairline")}>{vote === option ? "✓ " : ""}{option}</button>)}</div></div>;
}

export function editorialBody(page: PageKey, title: string) {
  const t = title.toLowerCase();
  if (page === "premium" && t.includes("membership tier")) return <PremiumPlans />;
  if (page === "premium" && t.includes("comparison")) return <PremiumComparison />;
  if (page === "premium" && t.includes("checkout")) return <div className="grid gap-6"><div className="grid gap-3 md:grid-cols-3">{faqFor("premium").map((item) => <article key={item.q} className="rounded-2xl border border-hairline bg-surface-2 p-4"><h3 className="font-display font-bold">{item.q}</h3><p className="mt-2 text-sm text-muted-foreground">{item.a}</p></article>)}</div><MockCheckout /></div>;
  if (page === "account" && t.includes("account security")) return <AccountSecurityPanel />;
  if (page === "account") return <PreferencePanel title={title} />;
  if (page === "community" && (t.includes("poll") || t.includes("challenge"))) return <CommunityPanel title={title} />;
  if (page === "live" && t.includes("set reminder")) return <PreferencePanel title="Live reminders" />;
  if (page === "search" && t.includes("no-result")) return <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-display text-lg font-bold">Nothing useful yet?</p><p className="text-sm text-muted-foreground">Try a creator, city, category or topic instead of a full sentence.</p></div><Link to="/discover" className="press rounded-full bg-[var(--green-action)] px-5 py-3 text-sm font-semibold text-white">Open discovery</Link></div>;
  if (page === "about") return <div className="grid gap-4 md:grid-cols-3">{[["Local first", "South African voices lead the catalogue and editorial agenda."], ["Format agnostic", "Audio, video, live rooms and reporting share one discovery system."], ["Built to travel", "The architecture is ready for more languages, markets and creator models."]].map(([k, v]) => <div key={k} className="rounded-2xl bg-surface-2 p-4"><p className="font-display font-bold">{k}</p><p className="mt-1 text-sm text-muted-foreground">{v}</p></div>)}</div>;
  return <div className="grid gap-4 md:grid-cols-3"><div className="rounded-2xl bg-surface-2 p-4"><Zap className="size-5 text-[var(--green)]" /><p className="mt-3 font-display font-bold">Fast by design</p><p className="mt-1 text-sm text-muted-foreground">Priority content arrives first; the rest streams in as you approach it.</p></div><div className="rounded-2xl bg-surface-2 p-4"><Globe2 className="size-5 text-[var(--gold)]" /><p className="mt-3 font-display font-bold">South African context</p><p className="mt-1 text-sm text-muted-foreground">Language, province and creator identity stay visible throughout discovery.</p></div><div className="rounded-2xl bg-surface-2 p-4"><Headphones className="size-5 text-[var(--green)]" /><p className="mt-3 font-display font-bold">Made to continue</p><p className="mt-1 text-sm text-muted-foreground">The persistent player keeps the active episode alive while you browse.</p></div></div>;
}
