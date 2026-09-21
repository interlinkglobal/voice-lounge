import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import luxuryCss from "../styles-luxury.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ThemeProvider, themeBootstrapScript } from "@/components/system/theme";
import { TranslationProvider } from "@/components/system/TranslationProvider";
import { MediaFallbackProvider } from "@/components/system/MediaFallbackProvider";
import { LibraryProvider } from "@/components/system/library";
import { PlayerProvider } from "@/components/player/PlayerProvider";
import { PlayerDock } from "@/components/player/PlayerDock";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieBar } from "@/components/layout/CookieBar";
import { Toaster } from "@/components/ui/sonner";
import { YouTubeFeedProvider } from "@/components/youtube/YouTubeFeedProvider";
import { YouTubePlayerProvider } from "@/components/youtube/YouTubePlayerProvider";
import { getYouTubeFeed } from "@/lib/youtube.functions";
import { PwaLifecycle } from "@/components/system/PwaLifecycle";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { getCurrentUser } from "@/lib/auth/auth.functions";
import { CMS_BASE } from "@/lib/cms/routes";
import { VOICE_LOUNGE } from "@/lib/voice-lounge/organization";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="hyper-glass max-w-md rounded-[2rem] p-8 text-center">
        <p className="font-display text-[var(--step-6)] font-black leading-none text-[var(--green)]">404</p>
        <h1 className="mt-3 font-display text-2xl font-bold">That page has left the studio</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The link may be old, or the show moved. Try the catalogue or search for what you were after.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link to="/" className="press rounded-full bg-[var(--green-action)] px-5 py-2.5 text-sm font-semibold text-white">Go home</Link>
          <Link to="/search" className="press hyper-glass rounded-full px-5 py-2.5 text-sm font-semibold">Search the catalogue</Link>
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
      <div className="hyper-glass max-w-md rounded-[2rem] p-8 text-center">
        <h1 className="font-display text-2xl font-bold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something failed on our side. Retry, or head back to the front page.</p>
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
          <a href="/" className="press hyper-glass rounded-full px-5 py-2.5 text-sm font-semibold">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  headers: () => ({ "Cache-Control": "private, no-store" }),
  loader: async () => {
    const [youtubeFeed, user] = await Promise.all([getYouTubeFeed(), getCurrentUser()]);
    return { youtubeFeed, user };
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "The Voice Lounge — South African podcasts, video and live" },
      {
        name: "description",
        content: "Stream South African podcasts, watch video episodes, follow creators and read entertainment news on The Voice Lounge.",
      },
      { name: "theme-color", content: "#050706" },
      { name: "application-name", content: "The Voice Lounge" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-title", content: "Voice Lounge" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { property: "og:site_name", content: "The Voice Lounge" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_ZA" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: luxuryCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Inter+Tight:wght@400;500;600;700&family=Josefin+Sans:wght@500;600;700&display=swap",
      },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", href: "/icon-32x32.png", type: "image/png", sizes: "32x32" },
      { rel: "icon", href: "/icon-16x16.png", type: "image/png", sizes: "16x16" },
      { rel: "apple-touch-icon", href: "/icon-180x180.png", sizes: "180x180" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: VOICE_LOUNGE.name,
          url: VOICE_LOUNGE.publicWebsite,
          areaServed: "Eastern Cape, South Africa",
          description: VOICE_LOUNGE.description,
          sameAs: VOICE_LOUNGE.socials.map((item) => item.url),
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
  const { youtubeFeed, user } = Route.useLoaderData();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const cmsMode = pathname === CMS_BASE || pathname.startsWith(`${CMS_BASE}/`);

  return (
    <QueryClientProvider client={queryClient}>
      <PwaLifecycle />
      <AuthProvider user={user}>
        <YouTubeFeedProvider feed={youtubeFeed}>
          <MediaFallbackProvider>
          <TranslationProvider>
          <ThemeProvider>
          <LibraryProvider>
            <PlayerProvider>
              <YouTubePlayerProvider feed={youtubeFeed}>
                {cmsMode ? (
                  <div key={pathname}>
                    <Outlet />
                    <Toaster />
                  </div>
                ) : (
                  <>
                    <Header />
                    <main id="main" className="min-h-[60vh] pb-8">
                      <div key={pathname} className={pathname === "/youtube" ? undefined : "vl-page-enter"}>
                        <Outlet />
                      </div>
                    </main>
                    <Footer />
                    <PlayerDock />
                    <CookieBar />
                    <Toaster />
                  </>
                )}
              </YouTubePlayerProvider>
            </PlayerProvider>
          </LibraryProvider>
          </ThemeProvider>
          </TranslationProvider>
          </MediaFallbackProvider>
        </YouTubeFeedProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
