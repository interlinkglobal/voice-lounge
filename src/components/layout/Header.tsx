import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Crown, LogIn, LogOut, Menu, Monitor, Moon, Search, Sun, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { useTheme, type ThemeChoice } from "@/components/system/theme";
import { InstallPwaButton } from "@/components/system/InstallPwaButton";
import { useAuth } from "@/components/auth/AuthProvider";
import { AppSelect } from "@/components/ui/AppSelect";
import { SITE_LANGUAGES, useTranslationLanguage, type SiteLanguage } from "@/components/system/TranslationProvider";
import { universalSearch } from "@/lib/content/adapters";

export const PRIMARY_NAV = [
  { to: "/", label: "Home" },
  { to: "/youtube", label: "YouTube" },
  { to: "/podcasts", label: "Podcasts" },
  { to: "/shows", label: "Shows" },
  { to: "/news", label: "News" },
  { to: "/watch", label: "Watch" },
  { to: "/live", label: "Live" },
] as const;

export const SECONDARY_NAV = [
  { to: "/discover", label: "Discover" },
  { to: "/episodes", label: "Episodes" },
  { to: "/guests", label: "Guests" },
  { to: "/creators", label: "Creators" },
  { to: "/community", label: "Community" },
  { to: "/about", label: "About" },
] as const;

const COMPACT_PRIMARY_COUNT = 3;

function ThemeToggle() {
  const { choice, setChoice } = useTheme();
  const options: Array<{ v: ThemeChoice; icon: typeof Sun; label: string }> = [
    { v: "light", icon: Sun, label: "Light" },
    { v: "dark", icon: Moon, label: "Dark" },
    { v: "system", icon: Monitor, label: "System" },
  ];
  return (
    <div role="radiogroup" aria-label="Colour theme" className="flex items-center gap-0.5 rounded-full border border-hairline bg-surface-2 p-0.5">
      {options.map(({ v, icon: Icon, label }) => (
        <button
          key={v}
          role="radio"
          aria-checked={choice === v}
          aria-label={`${label} theme`}
          onClick={() => setChoice(v)}
          className={cn(
            "press grid size-8 shrink-0 place-items-center rounded-full transition-colors",
            choice === v ? "bg-[var(--green-action)] text-white" : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}

function LanguageSwitcher({ className }: { className?: string }) {
  const { language, setLanguage } = useTranslationLanguage();
  return (
    <div className={cn("notranslate min-w-0", className)} translate="no">
      <AppSelect
        value={language}
        onValueChange={(value) => setLanguage(value as SiteLanguage)}
        options={SITE_LANGUAGES}
        ariaLabel="Website language"
        className="min-h-10 w-[8.75rem] max-w-full rounded-full bg-surface-2"
      />
    </div>
  );
}

function AccountControl() {
  const user = useAuth();

  if (!user) {
    return (
      <Link
        to="/login"
        search={{ auth: undefined, returnTo: "/account" }}
        aria-label="Sign in to The Voice Lounge"
        className="press hidden min-h-10 min-w-0 items-center gap-2 rounded-full border border-hairline bg-surface-2 px-3 text-sm font-semibold sm:inline-flex"
      >
        <LogIn className="size-4 shrink-0" aria-hidden="true" />
        <span className="tvl-nav-label hidden min-[1800px]:inline">Sign in</span>
      </Link>
    );
  }

  return (
    <div className="hidden min-w-0 items-center gap-1.5 sm:flex">
      <Link
        to="/account"
        aria-label={`Account for ${user.name}`}
        className="press grid size-10 shrink-0 place-items-center overflow-hidden rounded-full border border-[color-mix(in_oklab,var(--green)_45%,transparent)] bg-surface-2"
      >
        {user.picture ? (
          <img src={user.picture} alt="" referrerPolicy="no-referrer" className="size-full object-cover" />
        ) : (
          <User className="size-4" aria-hidden="true" />
        )}
      </Link>
      <form action="/auth/logout" method="post" className="hidden min-[1800px]:block">
        <button
          type="submit"
          className="press inline-flex min-h-10 min-w-0 items-center gap-1.5 rounded-full border border-hairline bg-surface-2 px-3 text-sm font-semibold"
        >
          <LogOut className="size-4 shrink-0" aria-hidden="true" />
          <span className="tvl-nav-label max-w-24">Log out</span>
        </button>
      </form>
    </div>
  );
}

function PrimaryNavItem({ item }: { item: (typeof PRIMARY_NAV)[number] }) {
  return (
    <li className="min-w-0">
      <Link
        to={item.to}
        preload="intent"
        activeOptions={{ exact: item.to === "/" }}
        activeProps={{ className: "text-foreground bg-surface-2" }}
        inactiveProps={{ className: "text-muted-foreground" }}
        className="block min-w-0 max-w-[8.5rem] overflow-hidden rounded-full px-3 py-2 text-sm font-medium transition-colors hover:text-foreground 2xl:text-base"
      >
        <span className="tvl-nav-label block">{item.label}</span>
      </Link>
    </li>
  );
}

function AdaptivePrimaryNav() {
  const navRef = useRef<HTMLElement | null>(null);
  const measureRef = useRef<HTMLUListElement | null>(null);
  const [compact, setCompact] = useState(false);
  const visiblePrimary = compact ? PRIMARY_NAV.slice(0, COMPACT_PRIMARY_COUNT) : PRIMARY_NAV;
  const overflowPrimary = compact ? PRIMARY_NAV.slice(COMPACT_PRIMARY_COUNT) : [];

  useEffect(() => {
    const nav = navRef.current;
    const measureList = measureRef.current;
    if (!nav || !measureList || typeof ResizeObserver === "undefined") return;

    let frame = 0;
    const measure = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const available = nav.getBoundingClientRect().width;
        const required = measureList.getBoundingClientRect().width;
        if (!available || !required) return;
        setCompact(required > available - 8);
      });
    };

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(nav);
    resizeObserver.observe(measureList);

    const mutationObserver = new MutationObserver(measure);
    mutationObserver.observe(measureList, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    mutationObserver.observe(nav, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    measure();
    window.addEventListener("resize", measure, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <nav ref={navRef} aria-label="Primary" className="relative hidden min-w-0 justify-center overflow-hidden xl:flex">
      <ul
        ref={measureRef}
        aria-hidden="true"
        className="pointer-events-none absolute invisible flex w-max items-center gap-0.5 whitespace-nowrap"
      >
        {PRIMARY_NAV.map((item) => (
          <li key={`measure-${item.to}`}>
            <span className="block px-3 py-2 text-sm font-medium 2xl:text-base">{item.label}</span>
          </li>
        ))}
        <li><span className="block px-3 py-2 text-sm font-medium 2xl:text-base">More</span></li>
      </ul>

      <ul className="flex min-w-0 max-w-full items-center justify-center gap-0.5 overflow-hidden">
        {visiblePrimary.map((item) => <PrimaryNavItem key={item.to} item={item} />)}
        <li className="group relative min-w-0 shrink-0">
          <button
            type="button"
            className="block max-w-[8rem] overflow-hidden rounded-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground 2xl:text-base"
            aria-haspopup="true"
          >
            <span className="tvl-nav-label block">More</span>
          </button>
          <ul className="invisible absolute left-0 top-full z-10 w-72 max-w-[min(18rem,calc(100vw-2rem))] rounded-2xl border border-hairline bg-popover p-2 opacity-0 shadow-lift transition-[opacity,transform] duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
            {overflowPrimary.length > 0 && (
              <>
                {overflowPrimary.map((item) => (
                  <li key={`overflow-${item.to}`}>
                    <Link to={item.to} preload="intent" className="block rounded-xl px-3 py-2 text-sm leading-5 hover:bg-surface-2">
                      <span className="break-words">{item.label}</span>
                    </Link>
                  </li>
                ))}
                <li className="my-1 border-t border-hairline" aria-hidden="true" />
              </>
            )}
            {SECONDARY_NAV.map((item) => (
              <li key={item.to}>
                <Link to={item.to} preload="intent" className="block rounded-xl px-3 py-2 text-sm leading-5 hover:bg-surface-2">
                  <span className="break-words">{item.label}</span>
                </Link>
              </li>
            ))}
            <li className="mt-2 border-t border-hairline pt-2 min-[1800px]:hidden">
              <LanguageSwitcher className="w-full" />
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}

function SearchSuggestionList({
  suggestions,
  goToSearch,
}: {
  suggestions: ReturnType<typeof universalSearch>;
  goToSearch: () => void;
}) {
  return (
    <div className="mt-2 border-t border-hairline pt-2">
      {suggestions.map((hit) => (
        <Link
          key={`${hit.type}-${hit.card.id}`}
          to={hit.card.href}
          onMouseDown={(event) => event.preventDefault()}
          className="press flex min-w-0 items-start justify-between gap-3 rounded-xl px-3 py-2.5 hover:bg-surface-2"
        >
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold">{hit.card.title}</span>
            <span className="mt-0.5 block truncate text-xs text-muted-foreground">
              {hit.type} · {hit.card.subtitle || hit.card.meta || "The Voice Lounge"}
            </span>
          </span>
          <span className="shrink-0 text-[0.62rem] font-black uppercase tracking-[0.12em] text-[var(--green)]">{hit.type}</span>
        </Link>
      ))}
      {!suggestions.length && (
        <p className="px-3 py-3 text-sm leading-5 text-muted-foreground">
          No local match yet. Search the full YouTube catalogue.
        </p>
      )}
      <button
        type="button"
        onMouseDown={(event) => event.preventDefault()}
        onClick={goToSearch}
        className="press mt-1 flex min-h-10 w-full min-w-0 items-center justify-center gap-2 rounded-xl bg-[var(--green-action)] px-4 text-center text-sm font-bold text-white"
      >
        <Search className="size-4 shrink-0" aria-hidden="true" />
        <span className="min-w-0 break-words">Search all results</span>
      </button>
    </div>
  );
}

export function Header() {
  const user = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [term, setTerm] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [compactSearchOpen, setCompactSearchOpen] = useState(false);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const suggestions = useMemo(
    () => term.trim().length >= 2 ? universalSearch(term).slice(0, 6) : [],
    [term],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function goToSearch() {
    setOpen(false);
    setSearchFocused(false);
    setCompactSearchOpen(false);
    navigate({ to: "/search", search: { q: term.trim(), type: undefined } });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    goToSearch();
  }

  return (
    <>
      {pathname !== "/youtube" && (
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-full focus:bg-[var(--green-action)] focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
      )}
      <header
        className={cn(
          "sticky top-0 z-[var(--z-header)] transition-[background-color,box-shadow,border-color] duration-200",
          scrolled ? "glass-panel border-x-0 border-t-0 shadow-card" : "border-b border-transparent bg-transparent",
        )}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="shell grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-2.5 2xl:py-4">
          <Link to="/" aria-label="The Voice Lounge home" className="press shrink-0">
            <span className="hidden sm:block"><Logo /></span>
            <span className="sm:hidden"><Logo compact /></span>
          </Link>

          <AdaptivePrimaryNav />
          <span className="xl:hidden" />

          <div className="flex min-w-0 shrink-0 items-center gap-1.5">
            <div className="relative hidden min-[1800px]:block">
              <form onSubmit={submit} role="search" className="flex min-w-0 items-center">
                <label htmlFor="global-search" className="sr-only">Search The Voice Lounge</label>
                <div className="flex min-w-0 items-center gap-2 rounded-full border border-hairline bg-surface-2 px-3 py-1.5">
                  <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <input
                    id="global-search"
                    value={term}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => window.setTimeout(() => setSearchFocused(false), 120)}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="Videos, guests, shows, creators…"
                    className="w-52 min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </form>
              {searchFocused && term.trim().length >= 2 && (
                <div className="absolute right-0 top-[calc(100%+.55rem)] z-50 w-[min(28rem,78vw)] overflow-hidden rounded-2xl border border-hairline bg-popover p-2 shadow-lift">
                  <SearchSuggestionList suggestions={suggestions} goToSearch={goToSearch} />
                </div>
              )}
            </div>

            <div
              className="relative hidden lg:block min-[1800px]:hidden"
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setCompactSearchOpen(false);
                }
              }}
            >
              <button
                type="button"
                onClick={() => setCompactSearchOpen((value) => !value)}
                aria-expanded={compactSearchOpen}
                aria-label="Search The Voice Lounge"
                className="press grid size-10 shrink-0 place-items-center rounded-full border border-hairline bg-surface-2 text-muted-foreground hover:text-foreground"
              >
                <Search className="size-5" aria-hidden="true" />
              </button>
              {compactSearchOpen && (
                <div className="absolute right-0 top-[calc(100%+.55rem)] z-50 w-[min(30rem,calc(100vw-2rem))] rounded-2xl border border-hairline bg-popover p-3 shadow-lift">
                  <form onSubmit={submit} role="search">
                    <label htmlFor="compact-global-search" className="sr-only">Search The Voice Lounge</label>
                    <div className="flex min-w-0 items-center gap-2 rounded-xl border border-hairline bg-surface-2 px-3 py-2.5">
                      <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      <input
                        id="compact-global-search"
                        autoFocus
                        value={term}
                        onChange={(event) => setTerm(event.target.value)}
                        placeholder="Videos, guests, shows, creators…"
                        className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                      />
                    </div>
                  </form>
                  {term.trim().length >= 2 && (
                    <SearchSuggestionList suggestions={suggestions} goToSearch={goToSearch} />
                  )}
                </div>
              )}
            </div>

            <Link
              to="/search"
              search={{ q: "", type: undefined }}
              aria-label="Search"
              className="press grid size-10 shrink-0 place-items-center rounded-full text-muted-foreground hover:text-foreground lg:hidden"
            >
              <Search className="size-5" aria-hidden="true" />
            </Link>

            <LanguageSwitcher className="hidden min-[1800px]:block" />
            <div className="hidden md:block"><ThemeToggle /></div>
            <InstallPwaButton className="hidden min-[1800px]:inline-flex" />
            <AccountControl />

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="press grid size-10 shrink-0 place-items-center rounded-full border border-hairline bg-surface-2 xl:hidden"
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[var(--z-overlay)] xl:hidden">
          <button aria-label="Close menu" className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="rise-in absolute inset-y-0 right-0 flex w-[min(22rem,92vw)] flex-col overflow-y-auto border-l border-hairline bg-background p-4"
            style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 overflow-hidden"><Logo /></div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="press grid size-10 shrink-0 place-items-center rounded-full border border-hairline">
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={submit} role="search" className="mt-4">
              <label htmlFor="menu-search" className="sr-only">Search</label>
              <div className="flex min-w-0 items-center gap-2 rounded-full border border-hairline bg-surface-2 px-3 py-2.5">
                <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <input
                  id="menu-search"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="Videos, guests, shows, creators…"
                  className="w-full min-w-0 bg-transparent text-sm outline-none"
                />
              </div>
            </form>

            <nav aria-label="Mobile" className="mt-5 min-w-0">
              <p className="px-1 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">Listen</p>
              <ul className="mt-2 grid min-w-0 gap-0.5">
                {PRIMARY_NAV.map((item) => (
                  <li key={item.to} className="min-w-0">
                    <Link
                      to={item.to}
                      onClick={() => setOpen(false)}
                      activeOptions={{ exact: item.to === "/" }}
                      activeProps={{ className: "bg-surface-2 text-foreground" }}
                      className="block min-w-0 rounded-xl px-3 py-3 text-[0.95rem] font-medium leading-5"
                    >
                      <span className="break-words">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="mt-5 px-1 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">Explore</p>
              <ul className="mt-2 grid min-w-0 gap-0.5">
                {[...SECONDARY_NAV, { to: "/search", label: "Search" }, { to: "/account", label: "Account" }].map((item) => (
                  <li key={item.to} className="min-w-0">
                    <Link to={item.to} onClick={() => setOpen(false)} className="block min-w-0 rounded-xl px-3 py-3 text-[0.95rem] font-medium leading-5">
                      <span className="break-words">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-5 min-w-0 rounded-2xl border border-hairline bg-surface-2 p-4">
              {user ? (
                <div className="flex min-w-0 flex-wrap items-center gap-3">
                  {user.picture ? (
                    <img src={user.picture} alt="" referrerPolicy="no-referrer" className="size-11 shrink-0 rounded-full object-cover" />
                  ) : (
                    <div className="grid size-11 shrink-0 place-items-center rounded-full border border-hairline"><User className="size-5" /></div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <form action="/auth/logout" method="post" className="shrink-0">
                    <button type="submit" className="press inline-flex min-h-10 min-w-0 items-center gap-2 rounded-full border border-hairline px-3 text-sm font-semibold">
                      <LogOut className="size-4 shrink-0" aria-hidden="true" />
                      <span className="tvl-nav-label max-w-24">Log out</span>
                    </button>
                  </form>
                </div>
              ) : (
                <Link to="/login" search={{ auth: undefined, returnTo: "/account" }} onClick={() => setOpen(false)} className="press flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-full bg-[var(--green-action)] px-4 text-center font-semibold text-white">
                  <LogIn className="size-4 shrink-0" aria-hidden="true" />
                  <span className="break-words">Sign in</span>
                </Link>
              )}
            </div>

            <div className="mt-3"><InstallPwaButton fullWidth /></div>
            <Link
              to="/premium"
              search={{ payment_reference: undefined }}
              onClick={() => setOpen(false)}
              className="press mt-3 inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-full bg-[var(--gold)] px-5 py-3 text-center font-semibold leading-5 text-[oklch(0.16_0.02_90)]"
            >
              <Crown className="size-4 shrink-0" aria-hidden="true" />
              <span className="break-words">Explore Premium</span>
            </Link>
            <div className="mt-5 grid min-w-0 gap-3 pb-6">
              <LanguageSwitcher />
              <div className="flex justify-center"><ThemeToggle /></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
