import { Outlet, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpen,
  Database,
  ExternalLink,
  Home,
  ImagePlus,
  LayoutGrid,
  LogOut,
  Menu,
  Newspaper,
  Podcast,
  Search,
  Tv2,
} from "lucide-react";
import { useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CMS_BASE, CMS_NAV } from "@/lib/cms/routes";

const ICONS = {
  dashboard: BarChart3,
  home: Home,
  discover: Search,
  podcasts: Podcast,
  shows: LayoutGrid,
  watch: Tv2,
  news: Newspaper,
  uploads: ImagePlus,
} as const;

export function CmsShell() {
  const user = useAuth();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [navOpen, setNavOpen] = useState(false);

  if (!user) {
    return (
      <main className="mx-auto grid min-h-screen max-w-lg place-items-center px-6 py-24 text-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--green)]">Voice Lounge Control</p>
          <h1 className="mt-3 font-display text-3xl font-black">Administrator sign-in required</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Sign in before entering the Voice Lounge content console.
          </p>
          <Button asChild className="mt-6 bg-[var(--green-action)] text-white hover:brightness-110">
            <a href={`/login?returnTo=${encodeURIComponent(`${CMS_BASE}/dashboard`)}`}>Sign in</a>
          </Button>
        </div>
      </main>
    );
  }

  const current = CMS_NAV.find((item) => pathname === `${CMS_BASE}/${item.slug}`) ?? CMS_NAV[0];

  const sidebar = (
    <nav className="flex h-full flex-col gap-1 p-3" aria-label="Voice Lounge administration">
      <div className="mb-3 flex items-center gap-2 rounded-md bg-surface-2 px-3 py-2">
        <Database className="size-4 text-[var(--green)]" aria-hidden="true" />
        <div className="text-xs font-semibold uppercase tracking-wider">Voice Lounge Control</div>
      </div>

      {CMS_NAV.map((item) => {
        const Icon = ICONS[item.slug];
        const href = `${CMS_BASE}/${item.slug}`;
        const active = pathname === href;
        return (
          <a
            key={item.slug}
            href={href}
            onClick={() => setNavOpen(false)}
            className={[
              "press flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors",
              active
                ? "bg-[var(--green-action)] font-semibold text-white"
                : "text-foreground hover:bg-surface-2",
            ].join(" ")}
          >
            <Icon className="size-4" aria-hidden="true" />
            <span>{item.label}</span>
          </a>
        );
      })}

      <div className="mt-auto space-y-2 pt-4">
        <Separator />
        <Button asChild variant="secondary" size="sm" className="w-full justify-start">
          <a href="/" target="_blank" rel="noreferrer">
            <ExternalLink className="mr-2 size-4" aria-hidden="true" />
            View website
          </a>
        </Button>
        <div className="truncate px-3 text-xs text-muted-foreground">{user.email}</div>
        <form action="/auth/logout" method="post">
          <Button variant="outline" size="sm" type="submit" className="w-full justify-start">
            <LogOut className="mr-2 size-4" aria-hidden="true" />
            Sign out
          </Button>
        </form>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-[1400px] gap-0 px-0 lg:px-6 lg:py-6">
        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-60 shrink-0 overflow-y-auto rounded-lg border border-hairline bg-card lg:block">
          {sidebar}
        </aside>

        <div className="flex w-full min-w-0 flex-col lg:ml-6 lg:flex-1">
          <div className="flex items-center justify-between gap-2 border-b border-hairline bg-card px-4 py-3 lg:rounded-t-lg lg:border">
            <div className="flex min-w-0 items-center gap-2">
              <Sheet open={navOpen} onOpenChange={setNavOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button size="icon" variant="ghost" aria-label="Open admin navigation">
                    <Menu className="size-5" aria-hidden="true" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  {sidebar}
                </SheetContent>
              </Sheet>

              <div className="min-w-0">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Admin</div>
                <div className="truncate text-base font-semibold">{current?.label ?? "Overview"}</div>
              </div>
            </div>

            <Badge variant="outline" className="gap-1 text-[var(--green)]">
              <Database className="size-3" aria-hidden="true" />
              Workspace
            </Badge>
          </div>

          <main className="min-w-0 flex-1 bg-background p-4 lg:rounded-b-lg lg:border lg:border-t-0 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
