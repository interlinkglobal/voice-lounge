import { Link } from "@tanstack/react-router";
import {
  Bookmark,
  CircleUserRound,
  Crown,
  Heart,
  Languages,
  LayoutDashboard,
  Library,
  Loader2,
  LogOut,
  Menu,
  MessageCircle,
  Plus,
  Send,
  Trash2,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

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
import { TiltSurface } from "@/components/system/TiltSurface";

type AccountView = "overview" | "membership" | "library" | "activity" | "language" | "contact";

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

const NAV: Array<{
  id: AccountView;
  label: string;
  icon: typeof LayoutDashboard;
}> = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "membership", label: "Membership", icon: WalletCards },
  { id: "library", label: "Library & playlists", icon: Library },
  { id: "activity", label: "Activity & data", icon: Heart },
  { id: "language", label: "Language", icon: Languages },
  { id: "contact", label: "Contact Voice Lounge", icon: Send },
];

function formatDate(value?: string | null) {
  if (!value) return "Not scheduled";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not scheduled";
  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function planLabel(plan: MembershipPlan) {
  if (plan === "paid") return "Premium";
  if (plan === "guest") return "Guest";
  return "Free";
}

function SectionHeading({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <header className="border-b border-hairline pb-5">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--green)]">{eyebrow}</p>
      <h1 className="mt-2 font-display text-[clamp(1.9rem,4vw,3.2rem)] font-black tracking-[-0.045em]">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{copy}</p>
    </header>
  );
}

export function AccountExperience() {
  const user = useAuth();
  const { language, setLanguage } = useTranslationLanguage();
  const [view, setView] = useState<AccountView>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [data, setData] = useState<AccountPayload>(EMPTY);
  const [loading, setLoading] = useState(Boolean(user));
  const [notice, setNotice] = useState("");
  const [playlistName, setPlaylistName] = useState("");
  const [contactCategory, setContactCategory] = useState("general");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [premiumActive, setPremiumActive] = useState(false);
  const [profileName, setProfileName] = useState(user?.name ?? "");

  const reload = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await fetch("/api/account", {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
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
  }, [user]);

  useEffect(() => {
    if (!user) return;
    void reload();
    void fetch("/api/premium/status", {
      headers: { Accept: "application/json" },
      cache: "no-store",
    })
      .then(async (response) => {
        const payload = (await response.json().catch(() => ({}))) as { active?: boolean };
        if (response.ok) setPremiumActive(Boolean(payload.active));
      })
      .catch(() => undefined);
  }, [reload, user?.id]);

  if (!user) {
    return (
      <section className="grid min-h-[70vh] place-items-center bg-background px-5 py-12">
        <section className="w-full max-w-lg border border-hairline bg-card p-[clamp(1.5rem,4vw,2.5rem)] text-center">
          <CircleUserRound className="mx-auto size-9 text-[var(--green)]" aria-hidden="true" />
          <h1 className="mt-4 font-display text-3xl font-black">Your Voice Lounge account</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            Sign in to manage membership, playlists, language, activity and requests.
          </p>
          <Link
            to="/login"
            search={{ returnTo: "/account" }}
            className="press mt-6 inline-flex min-h-11 items-center bg-[var(--green-action)] px-5 font-bold text-white"
          >
            Sign in
          </Link>
        </section>
      </section>
    );
  }

  const profilePlan = data.profile?.membership_plan ?? user.plan;
  const effectivePlan: MembershipPlan =
    profilePlan === "guest" ? "guest" : premiumActive ? "paid" : profilePlan;
  const cardUser = {
    ...user,
    plan: effectivePlan,
    name: data.profile?.display_name?.trim() || user.name,
    nextBillingAt: data.profile?.next_billing_at || user.nextBillingAt,
    cardMessage: data.profile?.card_message || user.cardMessage,
  };
  const card = createMembershipCardViewModel(cardUser, "000000");
  const nextBilling =
    data.profile?.next_billing_at ?? data.billing[0]?.next_billing_at ?? user.nextBillingAt;

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

  const selectView = (next: AccountView) => {
    setView(next);
    setMobileOpen(false);
    setNotice("");
  };

  const updateProfileName = async () => {
    const name = profileName.trim();
    if (!name) return;
    try {
      const response = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_name: name }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
        profile?: ProfileRow;
      };
      if (!response.ok) throw new Error(payload.error || "Profile could not be updated.");
      if (payload.profile) {
        setData((current) => ({ ...current, profile: payload.profile ?? current.profile }));
      }
      setNotice("Profile updated.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Profile could not be updated.");
    }
  };

  const updateLanguage = async (next: string) => {
    const value = next as SiteLanguage;
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
        profile: current.profile
          ? { ...current.profile, preferred_language: value }
          : current.profile,
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
      setNotice("Your request has been submitted.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Request could not be submitted.");
    }
  };

  const navigation = (
    <nav className="grid gap-1" aria-label="Account">
      {NAV.map((item) => {
        const Icon = item.icon;
        const active = view === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => selectView(item.id)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "press flex min-h-11 items-center gap-3 px-3 text-left text-sm font-semibold",
              active
                ? "bg-[color-mix(in_oklab,var(--green)_14%,transparent)] text-[var(--green)]"
                : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background text-foreground" data-primary-route="account">
      <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-hairline bg-background/95 px-4 backdrop-blur-xl lg:hidden">
        <div className="min-w-0">
          <p className="truncate font-display font-black">{cardUser.name}</p>
          <p className="text-xs text-muted-foreground">{planLabel(effectivePlan)} account</p>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          aria-expanded={mobileOpen}
          aria-label="Toggle account menu"
          className="press grid size-10 place-items-center border border-hairline"
        >
          {mobileOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </button>
      </header>

      {mobileOpen && (
        <div className="fixed inset-x-3 top-20 z-50 border border-hairline bg-background p-3 shadow-lift lg:hidden">
          {navigation}
          <div className="mt-3 border-t border-hairline pt-3">
            <form action="/auth/logout" method="post">
              <button
                type="submit"
                className="press flex min-h-11 w-full items-center gap-2 border border-hairline px-3 text-left text-sm font-semibold"
              >
                <LogOut className="size-4" aria-hidden="true" />
                Log out
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid min-h-screen lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="hidden border-r border-hairline bg-[#050806] p-5 text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--green)]">The Voice Lounge</p>
            <h2 className="mt-1 font-display text-2xl font-black">My account</h2>
            <p className="mt-2 text-xs leading-5 text-white/45">Your membership and personal Voice Lounge workspace.</p>
          </div>

          <div className="mt-7 flex-1">{navigation}</div>

          <div className="border border-white/10 bg-white/[0.04] p-3">
            <p className="truncate text-sm font-semibold">{cardUser.name}</p>
            <p className="truncate text-xs text-white/45">{user.email}</p>
            <div className="mt-3 flex items-center justify-between gap-2">
              <span className="text-[0.65rem] font-black uppercase tracking-[0.15em] text-[var(--gold)]">
                {planLabel(effectivePlan)}
              </span>
              <form action="/auth/logout" method="post">
                <button type="submit" className="press inline-flex min-h-9 items-center gap-1.5 text-xs text-white/55 hover:text-white">
                  <LogOut className="size-3.5" aria-hidden="true" /> Log out
                </button>
              </form>
            </div>
          </div>
        </aside>

        <section className="min-w-0 px-[clamp(1rem,3vw,2.5rem)] py-[clamp(1.5rem,4vw,3rem)]">
          {notice && (
            <p role="status" className="mb-4 border border-hairline bg-card p-3 text-sm">
              {notice}
            </p>
          )}

          {loading ? (
            <div className="flex min-h-[50vh] items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Loading account
            </div>
          ) : null}

          {!loading && view === "overview" && (
            <div>
              <SectionHeading
                eyebrow="Dashboard"
                title="Your Voice Lounge"
                copy="A concise view of your membership and personal activity."
              />

              <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(18rem,.75fr)]">
                <div className="mx-auto w-full max-w-3xl xl:mx-0">
                  <TiltSurface maxTilt={4} className="rounded-[4.8%]">
                    <EditableMembershipCard model={card} className="w-full" />
                  </TiltSurface>
                </div>
                <div className="grid content-start gap-3">
                  <button type="button" onClick={() => selectView("membership")} className="press border border-hairline bg-card p-4 text-left">
                    <WalletCards className="size-5 text-[var(--gold)]" aria-hidden="true" />
                    <p className="mt-3 text-xs uppercase tracking-[0.13em] text-muted-foreground">Membership</p>
                    <p className="mt-1 font-display text-xl font-black">{planLabel(effectivePlan)}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{nextBilling ? `Next billing ${formatDate(nextBilling)}` : "No billing scheduled"}</p>
                  </button>
                  <button type="button" onClick={() => selectView("library")} className="press border border-hairline bg-card p-4 text-left">
                    <Bookmark className="size-5 text-[var(--green)]" aria-hidden="true" />
                    <p className="mt-3 text-xs uppercase tracking-[0.13em] text-muted-foreground">Library</p>
                    <p className="mt-1 font-display text-xl font-black">{data.saved.length} saved</p>
                    <p className="mt-1 text-xs text-muted-foreground">{data.playlists.length} playlists</p>
                  </button>
                  <button type="button" onClick={() => selectView("activity")} className="press border border-hairline bg-card p-4 text-left">
                    <MessageCircle className="size-5 text-[var(--green)]" aria-hidden="true" />
                    <p className="mt-3 text-xs uppercase tracking-[0.13em] text-muted-foreground">Activity</p>
                    <p className="mt-1 font-display text-xl font-black">{data.comments.length} comments</p>
                    <p className="mt-1 text-xs text-muted-foreground">{data.likes.length} Voice Lounge likes</p>
                  </button>
                </div>
              </section>
            </div>
          )}

          {!loading && view === "membership" && (
            <div>
              <SectionHeading
                eyebrow="Membership"
                title="Plan & billing"
                copy="Your current access level and billing information."
              />
              <section className="mt-6 grid gap-4 lg:grid-cols-2">
                <article className="border border-hairline bg-card p-5">
                  <Crown className="size-5 text-[var(--gold)]" aria-hidden="true" />
                  <p className="mt-4 text-xs font-black uppercase tracking-[0.15em] text-muted-foreground">Current plan</p>
                  <h2 className="mt-1 font-display text-3xl font-black">{planLabel(effectivePlan)}</h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {effectivePlan === "paid"
                      ? "Premium access is active."
                      : effectivePlan === "guest"
                        ? "Guest access is active."
                        : "Free membership is active."}
                  </p>
                  {effectivePlan === "free" && (
                    <Link to="/premium" className="press mt-5 inline-flex min-h-11 items-center bg-[var(--gold)] px-5 font-bold text-black">
                      Upgrade to Premium
                    </Link>
                  )}
                </article>

                <article className="border border-hairline bg-card p-5">
                  <p className="text-xs font-black uppercase tracking-[0.15em] text-muted-foreground">Billing</p>
                  <dl className="mt-4 grid gap-4 text-sm">
                    <div className="border-t border-hairline pt-3">
                      <dt className="text-muted-foreground">Next billing</dt>
                      <dd className="mt-1 font-semibold">{formatDate(nextBilling)}</dd>
                    </div>
                    <div className="border-t border-hairline pt-3">
                      <dt className="text-muted-foreground">Recorded payments</dt>
                      <dd className="mt-1 font-semibold">{data.billing.length}</dd>
                    </div>
                  </dl>
                </article>
              </section>
            </div>
          )}

          {!loading && view === "library" && (
            <div>
              <SectionHeading
                eyebrow="Library"
                title="Saved content & playlists"
                copy="Keep videos, podcasts and shows organized without leaving your account."
              />

              <section className="mt-6">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <label htmlFor="playlist-name" className="sr-only">Playlist name</label>
                  <input
                    id="playlist-name"
                    value={playlistName}
                    onChange={(event) => setPlaylistName(event.target.value)}
                    placeholder="New playlist"
                    className="min-h-11 flex-1 border border-hairline bg-background px-4 outline-none focus:border-[var(--green)]"
                  />
                  <button type="button" onClick={() => void createPlaylist()} className="press inline-flex min-h-11 items-center justify-center gap-2 bg-[var(--green-action)] px-5 font-bold text-white">
                    <Plus className="size-4" aria-hidden="true" /> Create
                  </button>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {data.playlists.map((playlist) => {
                    const items = data.playlistItems.filter((item) => item.playlist_id === playlist.id);
                    return (
                      <article key={playlist.id} className="border border-hairline bg-card p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h2 className="truncate font-display text-lg font-black">{playlist.name}</h2>
                            <p className="mt-1 text-xs text-muted-foreground">{items.length} items</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => void postAction({ action: "delete_playlist", id: playlist.id })}
                            aria-label={`Delete ${playlist.name}`}
                            className="press grid size-9 shrink-0 place-items-center border border-hairline text-muted-foreground"
                          >
                            <Trash2 className="size-4" aria-hidden="true" />
                          </button>
                        </div>
                        <div className="mt-4 grid gap-2">
                          {items.slice(0, 5).map((item) => (
                            <p key={item.id} className="truncate border-t border-hairline pt-2 text-sm">
                              {item.title || item.content_id}
                            </p>
                          ))}
                          {!items.length && <p className="text-sm text-muted-foreground">No items yet.</p>}
                        </div>
                      </article>
                    );
                  })}
                </div>

                <div className="mt-8">
                  <h2 className="font-display text-xl font-black">Saved</h2>
                  <div className="mt-3 grid gap-2">
                    {data.saved.map((item) => (
                      <div key={item.id} className="grid gap-3 border border-hairline p-3 text-sm sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{item.title || item.content_id}</p>
                          <p className="mt-1 text-xs uppercase text-muted-foreground">{item.content_type} · {item.collection.replace("_", " ")}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {data.playlists.length > 0 && ["video", "podcast", "episode", "show"].includes(item.content_type) && (
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
                              options={data.playlists.map((playlist) => ({
                                value: playlist.id,
                                label: `Add to ${playlist.name}`,
                              }))}
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
                            aria-label={`Remove ${item.title || item.content_id}`}
                          >
                            <Trash2 className="size-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {!data.saved.length && (
                      <div className="border border-hairline p-6 text-sm text-muted-foreground">
                        Save a video, podcast or article and it will appear here.
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>
          )}

          {!loading && view === "activity" && (
            <div>
              <SectionHeading
                eyebrow="Activity & data"
                title="Your information"
                copy="Manage first-party comments, likes and the profile data stored by Voice Lounge."
              />

              <section className="mt-6 grid gap-4 xl:grid-cols-2">
                <article className="border border-hairline bg-card p-5">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="size-5 text-[var(--green)]" aria-hidden="true" />
                    <h2 className="font-display text-xl font-black">Website comments</h2>
                  </div>
                  <div className="mt-4 grid gap-3">
                    {data.comments.map((comment) => (
                      <div key={comment.id} className="border-t border-hairline pt-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="line-clamp-3 text-sm leading-6">{comment.body}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{formatDate(comment.created_at)}</p>
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

                <article className="border border-hairline bg-card p-5">
                  <UserRound className="size-5 text-[var(--gold)]" aria-hidden="true" />
                  <h2 className="mt-3 font-display text-xl font-black">Profile & likes</h2>
                  <label className="mt-5 grid gap-2 text-sm font-bold">
                    Display name
                    <span className="flex gap-2">
                      <input
                        value={profileName}
                        onChange={(event) => setProfileName(event.target.value)}
                        className="min-h-11 min-w-0 flex-1 border border-hairline bg-background px-3 font-normal outline-none focus:border-[var(--green)]"
                      />
                      <button type="button" onClick={() => void updateProfileName()} className="press min-h-11 border border-hairline px-4">Save</button>
                    </span>
                  </label>
                  <dl className="mt-5 grid gap-3 text-sm">
                    <div className="border-t border-hairline pt-3"><dt className="text-muted-foreground">Email</dt><dd className="mt-1 break-all font-semibold">{user.email}</dd></div>
                    <div className="border-t border-hairline pt-3"><dt className="text-muted-foreground">Authentication</dt><dd className="mt-1 font-semibold">{user.provider}</dd></div>
                  </dl>
                  <div className="mt-5">
                    <p className="text-sm font-bold">Voice Lounge likes · {data.likes.length}</p>
                    <div className="mt-2 grid gap-2">
                      {data.likes.slice(0, 12).map((like) => (
                        <div key={like.id} className="flex items-center justify-between gap-3 border-t border-hairline pt-2 text-xs">
                          <span className="min-w-0 truncate">{like.content_type} · {like.content_id}</span>
                          <button
                            type="button"
                            onClick={() => void postAction({
                              action: "remove_like",
                              content_type: like.content_type,
                              content_id: like.content_id,
                            })}
                            className="press text-muted-foreground hover:text-foreground"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              </section>
            </div>
          )}

          {!loading && view === "language" && (
            <div>
              <SectionHeading
                eyebrow="Language"
                title="Reading language"
                copy="Choose the language Voice Lounge should use when you sign in."
              />
              <section className="mt-6 max-w-xl border border-hairline bg-card p-5">
                <Languages className="size-6 text-[var(--green)]" aria-hidden="true" />
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  The preference is saved to your account and can follow you between devices.
                </p>
                <div className="mt-5">
                  <AppSelect
                    value={data.profile?.preferred_language || language}
                    onValueChange={(value) => void updateLanguage(value)}
                    options={SITE_LANGUAGES}
                    ariaLabel="Preferred Voice Lounge language"
                    className="w-full"
                  />
                </div>
              </section>
            </div>
          )}

          {!loading && view === "contact" && (
            <div>
              <SectionHeading
                eyebrow="Contact"
                title="Contact Voice Lounge"
                copy="Guest requests, general enquiries, partnerships, studio requests, press and support."
              />
              <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
                <form onSubmit={submitContact} className="border border-hairline bg-card p-5">
                  <div className="grid gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-bold">Request type</label>
                      <AppSelect
                        value={contactCategory}
                        onValueChange={setContactCategory}
                        ariaLabel="Contact request type"
                        options={[
                          { value: "guest", label: "I want to be a guest" },
                          { value: "general", label: "General enquiry" },
                          { value: "advertising", label: "Advertising / partnership" },
                          { value: "studio", label: "Studio enquiry" },
                          { value: "press", label: "Press / media" },
                          { value: "support", label: "Technical support" },
                        ]}
                        className="w-full"
                      />
                    </div>
                    <label className="grid gap-2 text-sm font-bold">
                      Subject
                      <input
                        required
                        value={contactSubject}
                        onChange={(event) => setContactSubject(event.target.value)}
                        className="min-h-11 border border-hairline bg-background px-3 font-normal outline-none focus:border-[var(--green)]"
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-bold">
                      Message
                      <textarea
                        required
                        rows={6}
                        value={contactMessage}
                        onChange={(event) => setContactMessage(event.target.value)}
                        className="border border-hairline bg-background p-3 font-normal outline-none focus:border-[var(--green)]"
                      />
                    </label>
                    <button type="submit" className="press inline-flex min-h-11 items-center justify-center gap-2 bg-[var(--green-action)] px-5 font-bold text-white">
                      <Send className="size-4" aria-hidden="true" /> Submit request
                    </button>
                  </div>
                </form>

                <aside className="border border-hairline p-5">
                  <h2 className="font-display text-xl font-black">Recent requests</h2>
                  <div className="mt-4 grid gap-3">
                    {data.contacts.slice(0, 8).map((item) => (
                      <div key={item.id} className="border-t border-hairline pt-3">
                        <p className="font-semibold">{item.subject}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{item.category} · {item.status} · {formatDate(item.created_at)}</p>
                      </div>
                    ))}
                    {!data.contacts.length && <p className="text-sm text-muted-foreground">No requests submitted yet.</p>}
                  </div>
                </aside>
              </section>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
