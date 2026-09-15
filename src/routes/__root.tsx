import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ThemeProvider, themeBootstrapScript } from "@/components/system/theme";
import { LibraryProvider } from "@/components/system/library";
import { PlayerProvider } from "@/components/player/PlayerProvider";
import { PlayerDock } from "@/components/player/PlayerDock";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieBar } from "@/components/layout/CookieBar";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="font-display text-[var(--step-6)] font-black leading-none text-[var(--green)]">404</p>
        <h1 className="mt-3 font-display text-2xl font-bold">That page has left the studio</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The link may be old, or the show moved. Try the catalogue or search for what you were after.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link
            to="/"
            className="press rounded-full bg-[var(--green-action)] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Go home
          </Link>
          <Link to="/search" className="press rounded-full border border-hairline px-5 py-2.5 text-sm font-semibold">
            Search the catalogue
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl font-bold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something failed on our side. Retry, or head back to the front page.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="press rounded-full bg-[var(--green-action)] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Try again
          </button>
          <a href="/" className="press rounded-full border border-hairline px-5 py-2.5 text-sm font-semibold">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "The Voice Lounge — South African podcasts, video and live" },
      {
        name: "description",
        content:
          "Stream South African podcasts, watch video episodes, follow creators and read entertainment news on The Voice Lounge.",
      },
      { name: "theme-color", content: "#050706" },
      { property: "og:site_name", content: "The Voice Lounge" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_ZA" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Inter+Tight:wght@400;500;600;700&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "The Voice Lounge",
          url: "/",
          areaServed: "ZA",
          description: "South Africa's destination for podcasts, video podcasts, live programming and media news.",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en-ZA" className="dark">
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LibraryProvider>
          <PlayerProvider>
            <Header />
            <main id="main" className="min-h-[60vh] pb-8">
              <Outlet />
            </main>
            <Footer />
            <PlayerDock />
            <CookieBar />
            <Toaster />
          </PlayerProvider>
        </LibraryProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
