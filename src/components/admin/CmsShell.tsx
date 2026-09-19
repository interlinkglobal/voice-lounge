import { Outlet, useRouterState } from "@tanstack/react-router";
import { BarChart3, Home, LayoutGrid, Menu, Newspaper, Podcast, Search, Tv2, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { CMS_BASE, CMS_NAV } from "@/lib/cms/routes";
import { cn } from "@/lib/utils";

const ICONS = { dashboard: BarChart3, home: Home, discover: Search, podcasts: Podcast, shows: LayoutGrid, watch: Tv2, news: Newspaper } as const;

export function CmsShell() {
  const user = useAuth();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-5 py-12">
        <div className="w-full max-w-lg rounded-[2rem] border border-hairline bg-card p-[clamp(1.5rem,4vw,2.5rem)]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--gold)]">Voice Lounge CMS</p>
          <h1 className="mt-3 font-display text-4xl font-black tracking-[-0.045em]">Media team access</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">Sign in before entering the content workspace. Role enforcement and persistent CMS writes will be connected during the backend implementation.</p>
          <a href={`/login?returnTo=${encodeURIComponent(`${CMS_BASE}/dashboard`)}`} className="press mt-6 inline-flex min-h-11 items-center rounded-full bg-[var(--green-action)] px-5 font-semibold text-white">Sign in to continue</a>
        </div>
      </main>
    );
  }

  const nav = (
    <nav className="grid gap-1" aria-label="CMS">
      {CMS_NAV.map((item) => {
        const Icon = ICONS[item.slug];
        const href = `${CMS_BASE}/${item.slug}`;
        const active = pathname === href;
        return (
          <a key={item.slug} href={href} onClick={() => setMobileOpen(false)} className={cn("press flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold", active ? "bg-[color-mix(in_oklab,var(--green)_14%,transparent)] text-[var(--green)]" : "text-muted-foreground hover:bg-surface-2 hover:text-foreground")}>
            <Icon className="size-4" aria-hidden="true" />{item.label}
          </a>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 flex min-h-16 items-center justify-between border-b border-hairline bg-background/92 px-4 backdrop-blur-xl lg:hidden">
        <div><p className="font-display font-black">Voice Lounge CMS</p><p className="text-xs text-muted-foreground">UI workspace</p></div>
        <button type="button" onClick={() => setMobileOpen((value) => !value)} className="press grid size-10 place-items-center rounded-full border border-hairline">{mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}</button>
      </header>
      {mobileOpen && <div className="fixed inset-x-3 top-20 z-50 rounded-3xl border border-hairline bg-background p-3 shadow-lift lg:hidden">{nav}</div>}
      <div className="grid min-h-screen lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="hidden border-r border-hairline bg-[#050806] p-5 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
          <div><p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--green)]">The Voice Lounge</p><h1 className="mt-1 font-display text-2xl font-black">Content Studio</h1><p className="mt-2 text-xs leading-5 text-muted-foreground">No-index media operations workspace.</p></div>
          <div className="mt-7 flex-1">{nav}</div>
          <div className="rounded-2xl border border-hairline bg-surface-2 p-3"><p className="truncate text-sm font-semibold">{user.name}</p><p className="truncate text-xs text-muted-foreground">{user.email}</p><p className="mt-2 text-[0.65rem] font-black uppercase tracking-[0.15em] text-[var(--gold)]">UI-only mode</p></div>
        </aside>
        <main className="min-w-0 px-[clamp(1rem,3vw,2.5rem)] py-[clamp(1.5rem,4vw,3rem)]"><Outlet /></main>
      </div>
    </div>
  );
}
