import { Link } from "@tanstack/react-router";
import {
  Bookmark,
  CircleUserRound,
  Crown,
  Heart,
  Languages,
  Loader2,
  MessageCircle,
  Plus,
  Send,
  Trash2,
  UserRound,
  WalletCards,
} from "lucide-react";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { EditableMembershipCard } from "@/components/premium/EditableMembershipCard";
import { AppSelect } from "@/components/ui/AppSelect";
import {
  SITE_LANGUAGES,
  useTranslationLanguage,
  type SiteLanguage,
} from "@/components/system/TranslationProvider";
import { createMembershipCardViewModel } from "@/lib/membership/card";
import type { MembershipPlan } from "@/lib/auth/supabase";
import { cn } from "@/lib/utils";

type AccountTab = "overview" | "membership" | "playlists" | "activity" | "language" | "contact";

interface ProfileRow {
  user_id: string;
  display_name: string | null;
  picture_url: string | null;
  preferred_language: SiteLanguage;
  membership_plan: MembershipPlan;
  next_billing_at: string | null;
  card_message: string | null;
}

interface PlaylistRow {
  id: string;
  name: string;
  description: string | null;
  updated_at: string;
}

interface PlaylistItemRow {
  id: string;
  playlist_id: string;
  content_type: string;
  content_id: string;
  title: string | null;
  image_url: string | null;
}

interface SavedRow {
  id: string;
  collection: string;
  content_type: string;
  content_id: string;
  title: string | null;
  image_url: string | null;
  created_at: string;
}

interface LikeRow {
  id: string;
  content_type: string;
  content_id: string;
  created_at: string;
}

interface CommentRow {
  id: string;
  content_type: string;
  content_id: string;
  body: string;
  created_at: string;
}

interface ContactRow {
  id: string;
  category: string;
  subject: string;
  status: string;
  created_at: string;
}

interface BillingRow {
  id: string;
  reference: string;
  product: string;
  amount_minor: number;
  currency: string;
  status: string;
  next_billing_at: string | null;
  created_at: string;
}

interface AccountPayload {
  profile: ProfileRow | null;
  playlists: PlaylistRow[];
  playlistItems: PlaylistItemRow[];
  saved: SavedRow[];
  likes: LikeRow[];
  comments: CommentRow[];
  contacts: ContactRow[];
  billing: BillingRow[];
}

const EMPTY: AccountPayload = {
  profile: null,
  playlists: [],
  playlistItems: [],
  saved: [],
  likes: [],
  comments: [],
  contacts: [],
  billing: [],
};

const TABS: Array<{ id: AccountTab; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "membership", label: "Membership" },
  { id: "playlists", label: "Playlists" },
  { id: "activity", label: "Activity & data" },
  { id: "language", label: "Language" },
  { id: "contact", label: "Contact" },
];

function formatDate(value?: string | null) {
  if (!value) return "Not scheduled";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not scheduled";
  return new Intl.DateTimeFormat("en-ZA", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function planLabel(plan: MembershipPlan) {
  if (plan === "paid") return "Premium";
  if (plan === "guest") return "Guest";
  return "Free";
}

export function AccountExperience() {
  const user = useAuth();
  const { language, setLanguage } = useTranslationLanguage();
  const [tab, setTab] = useState<AccountTab>("overview");
  const [data, setData] = useState<AccountPayload>(EMPTY);
  const [loading, setLoading] = useState(Boolean(user));
  const [notice, setNotice] = useState("");
  const [playlistName, setPlaylistName] = useState("");
  const [contactCategory, setContactCategory] = useState("general");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [premiumActive, setPremiumActive] = useState(false);
  const [profileName, setProfileName] = useState(user?.name ?? "");

  const reload = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await fetch("/api/account", { headers: { Accept: "application/json" }, cache: "no-store" });
      const payload = (await response.json().catch(() => ({}))) as Partial<AccountPayload> & { error?: string };
      if (!response.ok) throw new Error(payload.error || "Account data could not be loaded.");
      const next = { ...EMPTY, ...payload };
      setData(next);
      setProfileName(next.profile?.display_name?.trim() || user.name);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Account data could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    void reload();
    void fetch("/api/premium/status", { headers: { Accept: "application/json" }, cache: "no-store" })
      .then(async (response) => {
        const payload = (await response.json().catch(() => ({}))) as { active?: boolean };
        if (response.ok) setPremiumActive(Boolean(payload.active));
      })
      .catch(() => undefined);
  }, [user?.id]);

  if (!user) {
    return (
      <main className="shell grid min-h-[70vh] place-items-center py-12">
        <section className="hyper-glass w-full max-w-xl rounded-[2rem] p-[clamp(1.5rem,4vw,2.5rem)] text-center">
          <CircleUserRound className="mx-auto size-10 text-[var(--green)]" aria-hidden="true" />
          <h1 className="mt-4 font-display text-4xl font-black">Your Voice Lounge account</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            Sign in to manage membership, playlists, language, activity and requests.
          </p>
          <Link
            to="/login"
            search={{ returnTo: "/account" }}
            className="press mt-6 inline-flex min-h-12 items-center rounded-full bg-[var(--green-action)] px-6 font-bold text-white"
          >
            Sign in
          </Link>
        </section>
      </main>
    );
  }

  const profilePlan = data.profile?.membership_plan ?? user.plan;
  const effectivePlan: MembershipPlan = profilePlan === "guest" ? "guest" : premiumActive ? "paid" : profilePlan;
  const cardUser = {
    ...user,
    plan: effectivePlan,
    name: data.profile?.display_name?.trim() || user.name,
    nextBillingAt: data.profile?.next_billing_at || user.nextBillingAt,
    cardMessage: data.profile?.card_message || user.cardMessage,
  };
  const card = createMembershipCardViewModel(cardUser, "000000");
  const nextBilling = data.profile?.next_billing_at ?? data.billing[0]?.next_billing_at ?? user.nextBillingAt;
  const activityCount = data.likes.length + data.comments.length + data.saved.length;

  const postAction = async (body: Record<string, unknown>) => {
    setNotice("");
    const response = await fetch("/api/account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    if (!response.ok) throw new Error(payload.error || "Account action failed.");
    await reload();
  };

  const updateProfileName = async () => {
    const name = profileName.trim();
    if (!name) return;
    setNotice("");
    try {
      const response = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_name: name }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string; profile?: ProfileRow };
      if (!response.ok) throw new Error(payload.error || "Profile could not be updated.");
      if (payload.profile) setData((current) => ({ ...current, profile: payload.profile ?? current.profile }));
      setNotice("Profile updated.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Profile could not be updated.");
    }
  };

  const updateLanguage = async (next: string) => {
    const value = next as SiteLanguage;
    setNotice("");
    try {
      const response = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferred_language: value }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Language preference could not be saved.");
      setData((current) => ({
        ...current,
        profile: current.profile ? { ...current.profile, preferred_language: value } : current.profile,
      }));
      setLanguage(value);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Language preference could not be saved.");
    }
  };

  const createPlaylist = async () => {
    const name = playlistName.trim();
    if (!name) return;
    try {
      await postAction({ action: "create_playlist", name });
      setPlaylistName("");
      setNotice("Playlist created.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Playlist could not be created.");
    }
  };

  const submitContact = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await postAction({
        action: "submit_contact",
        category: contactCategory,
        subject: contactSubject,
        message: contactMessage,
      });
      setContactSubject("");
      setContactMessage("");
      setNotice("Your request has been submitted to Voice Lounge.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Request could not be submitted.");
    }
  };

  return (
    <main className="pb-[var(--section-gap)]" data-primary-route="account">
      <section className="shell pt-[clamp(1.25rem,4vw,3rem)]">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,.85fr)_minmax(28rem,1.15fr)] xl:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--green)]">Your Voice Lounge</p>
            <h1 className="mt-2 font-display text-[clamp(2.5rem,7vw,5.5rem)] font-black leading-[.92] tracking-[-0.055em]">
              {cardUser.name}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              Membership, saved content, playlists, language and first-party activity across The Voice Lounge.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs">
              <span className="border border-hairline px-3 py-2"><strong>{planLabel(effectivePlan)}</strong> plan</span>
              <span className="border border-hairline px-3 py-2"><strong>{data.saved.length}</strong> saved</span>
              <span className="border border-hairline px-3 py-2"><strong>{data.playlists.length}</strong> playlists</span>
              <span className="border border-hairline px-3 py-2"><strong>{activityCount}</strong> activity items</span>
            </div>
          </div>
          <div className="mx-auto w-full max-w-3xl">
            <EditableMembershipCard model={card} className="w-full" />
          </div>
        </div>

        <nav aria-label="Account sections" className="mt-8 overflow-x-auto border-b border-hairline">
          <div className="flex min-w-max gap-1 pb-2">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                aria-current={tab === item.id ? "page" : undefined}
                className={cn(
                  "press min-h-11 px-4 text-sm font-bold",
                  tab === item.id ? "bg-[var(--green-action)] text-white" : "border border-hairline text-muted-foreground",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        {notice && <p role="status" className="mt-4 border border-hairline bg-card/40 p-3 text-sm">{notice}</p>}
        {loading && (
          <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Loading account data
          </div>
        )}

        {!loading && tab === "overview" && (
          <section className="mt-6 grid gap-4 lg:grid-cols-3">
            <article className="border border-hairline bg-card/40 p-5">
              <WalletCards className="size-5 text-[var(--gold)]" aria-hidden="true" />
              <h2 className="mt-3 font-display text-xl font-black">Membership</h2>
              <p className="mt-2 text-sm text-muted-foreground">{planLabel(effectivePlan)} · {nextBilling ? `Next billing ${formatDate(nextBilling)}` : "No billing date"}</p>
              <button onClick={() => setTab("membership")} className="press mt-4 text-sm font-bold text-[var(--green)]">Manage membership</button>
            </article>
            <article className="border border-hairline bg-card/40 p-5">
              <Bookmark className="size-5 text-[var(--green)]" aria-hidden="true" />
              <h2 className="mt-3 font-display text-xl font-black">Your library</h2>
              <p className="mt-2 text-sm text-muted-foreground">{data.saved.length} saved items across {data.playlists.length} playlists.</p>
              <button onClick={() => setTab("playlists")} className="press mt-4 text-sm font-bold text-[var(--green)]">Open playlists</button>
            </article>
            <article className="border border-hairline bg-card/40 p-5">
              <MessageCircle className="size-5 text-[var(--green)]" aria-hidden="true" />
              <h2 className="mt-3 font-display text-xl font-black">Your activity</h2>
              <p className="mt-2 text-sm text-muted-foreground">{data.comments.length} comments · {data.likes.length} likes.</p>
              <button onClick={() => setTab("activity")} className="press mt-4 text-sm font-bold text-[var(--green)]">Manage activity</button>
            </article>
          </section>
        )}

        {!loading && tab === "membership" && (
          <section className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <article className="border border-hairline bg-card/40 p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--gold)]">Current plan</p>
                  <h2 className="mt-2 font-display text-3xl font-black">{planLabel(effectivePlan)}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {effectivePlan === "paid" ? "Full Premium access is active." : effectivePlan === "guest" ? "Guest access is active." : "Free membership is active."}
                  </p>
                </div>
                {effectivePlan === "free" && (
                  <Link to="/premium" className="press inline-flex min-h-11 items-center gap-2 bg-[var(--gold)] px-5 font-bold text-black">
                    <Crown className="size-4" aria-hidden="true" /> Upgrade
                  </Link>
                )}
              </div>
              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="border-t border-hairline pt-3"><dt className="text-xs text-muted-foreground">Next billing</dt><dd className="mt-1 font-semibold">{formatDate(nextBilling)}</dd></div>
                <div className="border-t border-hairline pt-3"><dt className="text-xs text-muted-foreground">Payments recorded</dt><dd className="mt-1 font-semibold">{data.billing.length}</dd></div>
              </dl>
            </article>
            <aside className="border border-hairline p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">Plan appearance</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Free uses green, Premium uses metallic gold, and Guest combines black, green and gold. The same card model is used throughout the site.
              </p>
            </aside>
          </section>
        )}

        {!loading && tab === "playlists" && (
          <section className="mt-6">
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="sr-only" htmlFor="playlist-name">Playlist name</label>
              <input id="playlist-name" value={playlistName} onChange={(event) => setPlaylistName(event.target.value)} placeholder="New playlist name" className="min-h-11 flex-1 border border-hairline bg-background px-4 outline-none focus:border-[var(--green)]" />
              <button type="button" onClick={() => void createPlaylist()} className="press inline-flex min-h-11 items-center justify-center gap-2 bg-[var(--green-action)] px-5 font-bold text-white"><Plus className="size-4" /> Create playlist</button>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {data.playlists.map((playlist) => {
                const items = data.playlistItems.filter((item) => item.playlist_id === playlist.id);
                return (
                  <article key={playlist.id} className="border border-hairline bg-card/40 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div><h2 className="font-display text-xl font-black">{playlist.name}</h2><p className="mt-1 text-xs text-muted-foreground">{items.length} items · Updated {formatDate(playlist.updated_at)}</p></div>
                      <button type="button" aria-label={`Delete ${playlist.name}`} onClick={() => void postAction({ action: "delete_playlist", id: playlist.id })} className="press grid size-9 place-items-center border border-hairline text-muted-foreground"><Trash2 className="size-4" /></button>
                    </div>
                    <div className="mt-4 grid gap-2">
                      {items.slice(0,5).map((item) => <div key={item.id} className="truncate border-t border-hairline pt-2 text-sm">{item.title || item.content_id}</div>)}
                      {!items.length && <p className="text-sm text-muted-foreground">Save content, then organize it here.</p>}
                    </div>
                  </article>
                );
              })}
              {!data.playlists.length && <div className="border border-hairline p-6 text-sm text-muted-foreground">Create your first playlist to organize Voice Lounge videos, podcasts, episodes and shows.</div>}
            </div>
            {data.saved.length > 0 && (
              <div className="mt-8">
                <h2 className="font-display text-2xl font-black">Saved content</h2>
                <div className="mt-3 grid gap-2">
                  {data.saved.map((item) => (
                    <div key={item.id} className="grid gap-3 border border-hairline p-3 text-sm sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{item.title || item.content_id}</p>
                        <p className="mt-1 text-xs uppercase text-muted-foreground">{item.content_type} · {item.collection.replace("_"," ")}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {data.playlists.length > 0 && ["video","podcast","episode","show"].includes(item.content_type) && (
                          <AppSelect
                            value={undefined}
                            onValueChange={(playlistId) => void postAction({
                              action: "add_playlist_item",
                              playlist_id: playlistId,
                              content_type: item.content_type,
                              content_id: item.content_id,
                              title: item.title,
                              image_url: item.image_url,
                            })}
                            options={data.playlists.map((playlist) => ({ value: playlist.id, label: `Add to ${playlist.name}` }))}
                            placeholder="Add to playlist"
                            ariaLabel={`Add ${item.title || item.content_id} to playlist`}
                            className="w-full sm:w-48"
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => void postAction({
                            action: "unsave_content",
                            collection: item.collection,
                            content_type: item.content_type,
                            content_id: item.content_id,
                          })}
                          className="press grid size-10 place-items-center border border-hairline text-muted-foreground"
                          aria-label={`Remove ${item.title || item.content_id} from saved content`}
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {!loading && tab === "activity" && (
          <section className="mt-6 grid gap-4 lg:grid-cols-2">
            <article className="border border-hairline bg-card/40 p-5">
              <div className="flex items-center gap-2"><MessageCircle className="size-5 text-[var(--green)]" /><h2 className="font-display text-xl font-black">Website comments</h2></div>
              <div className="mt-4 grid gap-3">
                {data.comments.map((comment) => (
                  <div key={comment.id} className="border-t border-hairline pt-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="line-clamp-3 text-sm leading-6">{comment.body}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{comment.content_id} · {formatDate(comment.created_at)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void postAction({ action: "delete_comment", id: comment.id })}
                        className="press grid size-9 shrink-0 place-items-center border border-hairline text-muted-foreground"
                        aria-label="Delete comment"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))}
                {!data.comments.length && <p className="text-sm text-muted-foreground">No website comments yet.</p>}
              </div>
            </article>
            <article className="border border-hairline bg-card/40 p-5">
              <div className="flex items-center gap-2"><Heart className="size-5 text-[var(--green)]" /><h2 className="font-display text-xl font-black">Likes & personal data</h2></div>
              <div className="mt-4 grid gap-4">
                <label className="grid gap-2 text-sm font-bold">
                  Display name
                  <span className="flex gap-2">
                    <input value={profileName} onChange={(event) => setProfileName(event.target.value)} className="min-h-11 min-w-0 flex-1 border border-hairline bg-background px-3 font-normal outline-none focus:border-[var(--green)]" />
                    <button type="button" onClick={() => void updateProfileName()} className="press min-h-11 border border-hairline px-4">Save</button>
                  </span>
                </label>
                <dl className="grid gap-3 text-sm">
                  <div className="border-t border-hairline pt-3"><dt className="text-muted-foreground">Email</dt><dd className="mt-1 break-all font-semibold">{user.email}</dd></div>
                  <div className="border-t border-hairline pt-3"><dt className="text-muted-foreground">Authentication</dt><dd className="mt-1 font-semibold">{user.provider}</dd></div>
                  <div className="border-t border-hairline pt-3"><dt className="text-muted-foreground">Preferred language</dt><dd className="mt-1 font-semibold">{SITE_LANGUAGES.find((item) => item.value === (data.profile?.preferred_language || language))?.label}</dd></div>
                </dl>
                <div>
                  <p className="text-sm font-bold">Voice Lounge likes · {data.likes.length}</p>
                  <div className="mt-2 grid gap-2">
                    {data.likes.slice(0,12).map((like) => (
                      <div key={like.id} className="flex items-center justify-between gap-3 border-t border-hairline pt-2 text-xs">
                        <span className="min-w-0 truncate">{like.content_type} · {like.content_id}</span>
                        <button type="button" onClick={() => void postAction({ action: "remove_like", content_type: like.content_type, content_id: like.content_id })} className="press text-muted-foreground hover:text-foreground">Remove</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </section>
        )}

        {!loading && tab === "language" && (
          <section className="mt-6 max-w-2xl border border-hairline bg-card/40 p-5 sm:p-6">
            <Languages className="size-6 text-[var(--green)]" aria-hidden="true" />
            <h2 className="mt-3 font-display text-2xl font-black">Website language</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Your selection is stored against this account so it can follow you between devices.</p>
            <div className="mt-5">
              <AppSelect
                value={data.profile?.preferred_language || language}
                onValueChange={(value) => void updateLanguage(value)}
                options={SITE_LANGUAGES}
                ariaLabel="Preferred Voice Lounge language"
                className="w-full sm:w-64"
              />
            </div>
          </section>
        )}

        {!loading && tab === "contact" && (
          <section className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <form onSubmit={submitContact} className="border border-hairline bg-card/40 p-5 sm:p-6">
              <Send className="size-5 text-[var(--green)]" aria-hidden="true" />
              <h2 className="mt-3 font-display text-2xl font-black">Contact Voice Lounge</h2>
              <div className="mt-5 grid gap-4">
                <div><label className="mb-2 block text-sm font-bold">Request type</label><AppSelect value={contactCategory} onValueChange={setContactCategory} ariaLabel="Contact request type" options={[
                  { value: "guest", label: "I want to be a guest" },
                  { value: "general", label: "General enquiry" },
                  { value: "advertising", label: "Advertising / partnership" },
                  { value: "studio", label: "Studio enquiry" },
                  { value: "press", label: "Press / media" },
                  { value: "support", label: "Technical support" },
                ]} className="w-full" /></div>
                <label className="grid gap-2 text-sm font-bold">Subject<input required value={contactSubject} onChange={(event) => setContactSubject(event.target.value)} className="min-h-11 border border-hairline bg-background px-3 font-normal outline-none focus:border-[var(--green)]" /></label>
                <label className="grid gap-2 text-sm font-bold">Message<textarea required rows={6} value={contactMessage} onChange={(event) => setContactMessage(event.target.value)} className="border border-hairline bg-background p-3 font-normal outline-none focus:border-[var(--green)]" /></label>
                <button type="submit" className="press inline-flex min-h-11 items-center justify-center gap-2 bg-[var(--green-action)] px-5 font-bold text-white"><Send className="size-4" /> Submit request</button>
              </div>
            </form>
            <aside className="border border-hairline p-5">
              <UserRound className="size-5 text-[var(--gold)]" aria-hidden="true" />
              <h2 className="mt-3 font-display text-xl font-black">Your requests</h2>
              <div className="mt-4 grid gap-3">
                {data.contacts.slice(0,8).map((item) => <div key={item.id} className="border-t border-hairline pt-3"><p className="font-semibold">{item.subject}</p><p className="mt-1 text-xs text-muted-foreground">{item.category} · {item.status} · {formatDate(item.created_at)}</p></div>)}
                {!data.contacts.length && <p className="text-sm text-muted-foreground">No requests submitted yet.</p>}
              </div>
            </aside>
          </section>
        )}
      </section>
    </main>
  );
}
