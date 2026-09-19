import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Crown, LogIn, LogOut, Menu, Monitor, Moon, Search, Sun, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { useTheme, type ThemeChoice } from "@/components/system/theme";
import { InstallPwaButton } from "@/components/system/InstallPwaButton";
import { useAuth } from "@/components/auth/AuthProvider";

export const PRIMARY_NAV = [
  { to: "/", label: "Home" },
  { to: "/discover", label: "Discover" },
  { to: "/podcasts", label: "Podcasts" },
  { to: "/shows", label: "Shows" },
  { to: "/episodes", label: "Episodes" },
  { to: "/watch", label: "Watch" },
  { to: "/live", label: "Live" },
] as const;

export const SECONDARY_NAV = [
  { to: "/categories", label: "Categories" },
  { to: "/creators", label: "Creators" },
  { to: "/news", label: "News" },
  { to: "/community", label: "Community" },
  { to: "/about", label: "About" },
] as const;

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
            "press grid size-8 place-items-center rounded-full transition-colors",
            choice === v ? "bg-[var(--green-action)] text-white" : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}

function AccountControl() {
  const user = useAuth();

  if (!user) {
    return (
      <Link
        to="/login"
        aria-label="Sign in to The Voice Lounge"
        className="press hidden min-h-10 items-center gap-2 rounded-full border border-hairline bg-surface-2 px-3 text-sm font-semibold sm:inline-flex"
      >
        <LogIn className="size-4" aria-hidden="true" />
        <span className="hidden 2xl:inline">Sign in</span>
      </Link>
    );
  }

  return (
    <Link
      to="/account"
      aria-label={`Account for ${user.name}`}
      className="press hidden size-10 place-items-center overflow-hidden rounded-full border border-[color-mix(in_oklab,var(--green)_45%,transparent)] bg-surface-2 sm:grid"
    >
      {user.picture ? (
        <img src={user.picture} alt="" referrerPolicy="no-referrer" className="size-full object-cover" />
      ) : (
        <User className="size-4" aria-hidden="true" />
      )}
    </Link>
  );
}

export function Header() {
  const user = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

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

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setOpen(false);
    navigate({ to: "/search", search: { q: term, type: undefined } });
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-full focus:bg-[var(--green-action)] focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
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

          <nav aria-label="Primary" className="hidden min-w-0 justify-center xl:flex">
            <ul className="flex items-center gap-0.5">
              {PRIMARY_NAV.map((n) => (
                <li key={n.to}>
                  <Link
                    to={n.to}
                    preload="intent"
                    activeOptions={{ exact: n.to === "/" }}
                    activeProps={{ className: "text-foreground bg-surface-2" }}
                    inactiveProps={{ className: "text-muted-foreground" }}
                    className="rounded-full px-3 py-2 text-sm font-medium transition-colors hover:text-foreground 2xl:text-base"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
              <li className="group relative">
                <button type="button" className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground 2xl:text-base" aria-haspopup="true">
                  More
                </button>
                <ul className="invisible absolute left-0 top-full z-10 w-56 rounded-2xl border border-hairline bg-popover p-2 opacity-0 shadow-lift transition-[opacity,transform] duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  {SECONDARY_NAV.map((n) => (
                    <li key={n.to}>
                      <Link to={n.to} preload="intent" className="block rounded-xl px-3 py-2 text-sm hover:bg-surface-2">{n.label}</Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
          <span className="xl:hidden" />

          <div className="flex shrink-0 items-center gap-1.5">
            <form onSubmit={submit} role="search" className="hidden items-center lg:flex">
              <label htmlFor="global-search" className="sr-only">Search The Voice Lounge</label>
              <div className="flex items-center gap-2 rounded-full border border-hairline bg-surface-2 px-3 py-1.5">
                <Search className="size-4 text-muted-foreground" aria-hidden="true" />
                <input
                  id="global-search"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="Titles, descriptions, people"
                  className="w-40 bg-transparent text-sm outline-none placeholder:text-muted-foreground xl:w-52"
                />
              </div>
            </form>
            <Link to="/search" aria-label="Search" className="press grid size-10 place-items-center rounded-full text-muted-foreground hover:text-foreground lg:hidden">
              <Search className="size-5" aria-hidden="true" />
            </Link>
            <div className="hidden md:block"><ThemeToggle /></div>
            <InstallPwaButton className="hidden 2xl:inline-flex" />
            <Link
              to="/premium"
              preload="intent"
              className="press hidden items-center gap-1.5 rounded-full border border-[color-mix(in_oklab,var(--gold)_55%,transparent)] px-3.5 py-2 text-sm font-semibold text-[var(--gold)] hover:bg-[color-mix(in_oklab,var(--gold)_12%,transparent)] sm:inline-flex"
            >
              <Crown className="size-4" aria-hidden="true" />
              Premium
            </Link>
            <AccountControl />
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="press grid size-10 place-items-center rounded-full border border-hairline bg-surface-2 xl:hidden"
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
            <div className="flex items-center justify-between">
              <Logo />
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="press grid size-10 place-items-center rounded-full border border-hairline">
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={submit} role="search" className="mt-4">
              <label htmlFor="menu-search" className="sr-only">Search</label>
              <div className="flex items-center gap-2 rounded-full border border-hairline bg-surface-2 px-3 py-2.5">
                <Search className="size-4 text-muted-foreground" aria-hidden="true" />
                <input
                  id="menu-search"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="Search titles and descriptions"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </form>

            <nav aria-label="Mobile" className="mt-5">
              <p className="px-1 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">Listen</p>
              <ul className="mt-2 grid gap-0.5">
                {PRIMARY_NAV.map((n) => (
                  <li key={n.to}>
                    <Link
                      to={n.to}
                      onClick={() => setOpen(false)}
                      activeOptions={{ exact: n.to === "/" }}
                      activeProps={{ className: "bg-surface-2 text-foreground" }}
                      className="block rounded-xl px-3 py-3 text-[0.95rem] font-medium"
                    >
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="mt-5 px-1 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">Explore</p>
              <ul className="mt-2 grid gap-0.5">
                {[...SECONDARY_NAV, { to: "/search", label: "Search" }, { to: "/account", label: "Account" }].map((n) => (
                  <li key={n.to}>
                    <Link to={n.to} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3 text-[0.95rem] font-medium">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-5 rounded-2xl border border-hairline bg-surface-2 p-4">
              {user ? (
                <div className="flex items-center gap-3">
                  {user.picture ? (
                    <img src={user.picture} alt="" referrerPolicy="no-referrer" className="size-11 rounded-full object-cover" />
                  ) : (
                    <div className="grid size-11 place-items-center rounded-full border border-hairline"><User className="size-5" /></div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <form action="/auth/logout" method="post">
                    <button type="submit" aria-label="Sign out" className="press grid size-9 place-items-center rounded-full border border-hairline">
                      <LogOut className="size-4" aria-hidden="true" />
                    </button>
                  </form>
                </div>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)} className="press flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--green-action)] px-4 font-semibold text-white">
                  <LogIn className="size-4" aria-hidden="true" />
                  Sign in
                </Link>
              )}
            </div>

            <div className="mt-3"><InstallPwaButton fullWidth /></div>
            <Link
              to="/premium"
              onClick={() => setOpen(false)}
              className="press mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--gold)] px-5 py-3 font-semibold text-[oklch(0.16_0.02_90)]"
            >
              <Crown className="size-4" aria-hidden="true" /> Explore Premium
            </Link>
            <div className="mt-5 flex justify-center pb-6"><ThemeToggle /></div>
          </div>
        </div>
      )}
    </>
  );
}
