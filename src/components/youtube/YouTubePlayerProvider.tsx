import { useRouterState } from "@tanstack/react-router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  Maximize2,
  Play,
  X,
  Youtube,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { usePlayer } from "@/components/player/PlayerProvider";
import type { YouTubeFeedResult, YouTubeFeedVideo } from "@/lib/youtube.functions";

type YouTubePlayerSurface = "modal" | "dock" | null;

interface YouTubePlayerContextValue {
  current: YouTubeFeedVideo | null;
  open: (video: YouTubeFeedVideo) => void;
  openDocked: (video: YouTubeFeedVideo) => void;
  close: () => void;
  next: () => void;
  prev: () => void;
  dockExpanded: boolean;
  setDockExpanded: (expanded: boolean) => void;
}

const YouTubePlayerContext = createContext<YouTubePlayerContextValue | null>(null);

export function YouTubePlayerProvider({
  feed,
  children,
}: {
  feed: YouTubeFeedResult;
  children: ReactNode;
}) {
  const videos = feed.status === "ready" ? feed.videos : [];
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const previousPathname = useRef(pathname);
  const { pause: pauseLegacyPlayback } = usePlayer();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [surface, setSurface] = useState<YouTubePlayerSurface>(null);
  const [dockExpanded, setDockExpanded] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps" });
  const currentIndex = currentId ? videos.findIndex((video) => video.id === currentId) : -1;
  const current = currentIndex >= 0 ? videos[currentIndex] ?? null : null;

  const open = useCallback(
    (video: YouTubeFeedVideo) => {
      pauseLegacyPlayback();
      setSurface("modal");
      setDockExpanded(false);
      setCurrentId(video.id);
      track("video_play", { id: video.id, source: "youtube" });
    },
    [pauseLegacyPlayback],
  );

  const openDocked = useCallback(
    (video: YouTubeFeedVideo) => {
      pauseLegacyPlayback();
      setSurface("dock");
      setDockExpanded(false);
      setCurrentId(video.id);
      track("video_play", { id: video.id, source: "youtube_podcast_dock" });
    },
    [pauseLegacyPlayback],
  );

  const close = useCallback(() => {
    setCurrentId(null);
    setSurface(null);
    setDockExpanded(false);
  }, []);

  const enterFullscreen = useCallback(async () => {
    const frame = iframeRef.current;
    if (!frame) return;
    try {
      if (frame.requestFullscreen) {
        await frame.requestFullscreen();
        return;
      }
      const webkitFrame = frame as HTMLIFrameElement & {
        webkitRequestFullscreen?: () => Promise<void> | void;
      };
      await webkitFrame.webkitRequestFullscreen?.();
    } catch (error) {
      console.warn("[youtube-player] fullscreen request failed", error);
    }
  }, []);

  const next = useCallback(() => {
    if (!videos.length) return;
    pauseLegacyPlayback();
    const index = currentIndex < 0 ? 0 : (currentIndex + 1) % videos.length;
    const video = videos[index];
    if (!video) return;
    setCurrentId(video.id);
    track("video_play", {
      id: video.id,
      source: surface === "dock" ? "youtube_podcast_dock_next" : "youtube_next",
    });
    emblaApi?.scrollTo(Math.min(index, Math.max(0, videos.length - 1)));
  }, [currentIndex, emblaApi, pauseLegacyPlayback, surface, videos]);

  const prev = useCallback(() => {
    if (!videos.length) return;
    pauseLegacyPlayback();
    const index = currentIndex <= 0 ? videos.length - 1 : currentIndex - 1;
    const video = videos[index];
    if (!video) return;
    setCurrentId(video.id);
    track("video_play", {
      id: video.id,
      source: surface === "dock" ? "youtube_podcast_dock_prev" : "youtube_prev",
    });
    emblaApi?.scrollTo(Math.max(0, index - 1));
  }, [currentIndex, emblaApi, pauseLegacyPlayback, surface, videos]);

  const overlayOpen = surface === "modal" || (surface === "dock" && dockExpanded);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      if (surface === "modal") {
        setCurrentId(null);
        setSurface(null);
        setDockExpanded(false);
      }
      previousPathname.current = pathname;
    }
  }, [pathname, surface]);

  useEffect(() => {
    if (!current || !overlayOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (surface === "dock") setDockExpanded(false);
        else close();
      }
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") prev();
    };
    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = priorOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [close, current, next, overlayOpen, prev, surface]);

  const upNext = useMemo(
    () => videos.filter((video) => video.id !== currentId),
    [currentId, videos],
  );

  const value = useMemo<YouTubePlayerContextValue>(
    () => ({
      current,
      open,
      openDocked,
      close,
      next,
      prev,
      dockExpanded,
      setDockExpanded,
    }),
    [close, current, dockExpanded, next, open, openDocked, prev],
  );

  return (
    <YouTubePlayerContext.Provider value={value}>
      {children}

      {current && surface === "modal" && (
        <div
          className="fixed inset-0 z-[120]"
          role="dialog"
          aria-modal="true"
          aria-label={`Playing ${current.title}`}
        >
          <button
            type="button"
            aria-label="Close video player"
            onClick={close}
            className="absolute inset-0 h-full w-full cursor-default bg-black/88 backdrop-blur-md"
          />
          <div className="absolute inset-x-[clamp(.5rem,2vw,2rem)] bottom-[clamp(.5rem,2vh,1.5rem)] top-[max(.5rem,env(safe-area-inset-top))] z-[121] mx-auto flex w-auto max-w-[1320px] flex-col overflow-hidden rounded-[clamp(1rem,2vw,2rem)] border border-white/15 bg-[#050706] text-white shadow-[0_38px_140px_-28px_rgba(0,0,0,.98)]">
            <div className="relative shrink-0 border-b border-white/10 bg-black">
              <div className="aspect-video w-full">
                <iframe
                  ref={iframeRef}
                  key={current.id}
                  src={`${current.embedUrl}?autoplay=1&rel=0&playsinline=1&modestbranding=1`}
                  title={current.title}
                  className="block h-full w-full bg-black"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
              <div className="absolute right-3 top-3 z-10 flex gap-2">
                <button
                  type="button"
                  onClick={enterFullscreen}
                  aria-label="View video fullscreen"
                  className="press grid size-11 place-items-center rounded-full border border-white/20 bg-black/70 text-white backdrop-blur-xl hover:bg-black/90"
                >
                  <Maximize2 className="size-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close video player"
                  className="press grid size-11 place-items-center rounded-full border border-white/20 bg-black/70 text-white backdrop-blur-xl hover:bg-black/90"
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="grid gap-5 p-[clamp(1rem,2.5vw,2rem)] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--green)]">
                    <Youtube className="size-4" aria-hidden="true" /> Official channel · In-site playback
                  </div>
                  <h2 className="mt-2 font-display text-[clamp(1.25rem,2.4vw,2rem)] font-extrabold leading-tight">
                    {current.title}
                  </h2>
                  {current.description && (
                    <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-white/60">
                      {current.description}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <button
                    type="button"
                    onClick={prev}
                    className="press inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 text-sm font-semibold"
                  >
                    <ChevronLeft className="size-4" aria-hidden="true" /> Previous
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="press inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--green-action)] px-4 text-sm font-semibold text-white shadow-glow"
                  >
                    Next <ChevronRight className="size-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={enterFullscreen}
                    className="press inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 text-sm font-semibold"
                  >
                    Fullscreen <Maximize2 className="size-4" aria-hidden="true" />
                  </button>
                  <a
                    href={current.watchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="press inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 text-sm font-semibold"
                  >
                    YouTube <ExternalLink className="size-4" aria-hidden="true" />
                  </a>
                </div>
              </div>

              {upNext.length > 0 && (
                <section
                  className="border-t border-white/10 px-[clamp(1rem,2.5vw,2rem)] pb-[clamp(1rem,2.5vw,2rem)] pt-5"
                  aria-labelledby="youtube-up-next"
                >
                  <div className="mb-3 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--gold)]">Queue</p>
                      <h3 id="youtube-up-next" className="font-display text-xl font-bold">Up next</h3>
                    </div>
                    <div className="hidden gap-2 sm:flex">
                      <button
                        type="button"
                        onClick={() => emblaApi?.scrollPrev()}
                        aria-label="Scroll Up Next left"
                        className="press grid size-9 place-items-center rounded-full border border-white/15 bg-white/[0.06]"
                      >
                        <ChevronLeft className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => emblaApi?.scrollNext()}
                        aria-label="Scroll Up Next right"
                        className="press grid size-9 place-items-center rounded-full border border-white/15 bg-white/[0.06]"
                      >
                        <ChevronRight className="size-4" />
                      </button>
                    </div>
                  </div>
                  <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex gap-3">
                      {upNext.map((video) => (
                        <button
                          key={video.id}
                          type="button"
                          onClick={() => open(video)}
                          className="group min-w-0 flex-[0_0_72%] text-left sm:flex-basis-[42%] lg:flex-basis-[28%] xl:flex-basis-[23%]"
                        >
                          <span className="block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                            <span className="media-shine relative block aspect-video overflow-hidden bg-black">
                              <img
                                src={video.thumbnail}
                                alt=""
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.045]"
                                loading="lazy"
                                decoding="async"
                              />
                              <span className="absolute inset-0 grid place-items-center bg-black/10">
                                <span className="grid size-10 place-items-center rounded-full bg-[var(--green-action)] text-white shadow-glow">
                                  <Play className="size-4 fill-current" />
                                </span>
                              </span>
                            </span>
                            <span className="block p-3">
                              <span className="line-clamp-2 text-sm font-semibold leading-snug">{video.title}</span>
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      )}

      {current && surface === "dock" && (
        <div
          className="fixed inset-x-0 bottom-0 z-[130] border-t border-hairline bg-[color-mix(in_oklab,var(--background)_94%,black)] text-foreground shadow-[0_-18px_50px_-30px_rgba(0,0,0,.9)]"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div
            className={cn(
              "border-b border-hairline bg-[#050706] text-white transition-[max-height,opacity] duration-200",
              dockExpanded
                ? "max-h-[calc(100vh-4.5rem)] overflow-y-auto opacity-100"
                : "pointer-events-none absolute h-px w-px overflow-hidden opacity-0",
            )}
            aria-hidden={!dockExpanded}
          >
            <div
              className={cn(
                dockExpanded
                  ? "shell grid gap-5 py-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,.7fr)] lg:items-start"
                  : "h-px w-px",
              )}
            >
              <div className={cn(dockExpanded ? "aspect-video w-full bg-black" : "h-px w-px")}>
                <iframe
                  ref={iframeRef}
                  key={current.id}
                  src={`${current.embedUrl}?autoplay=1&rel=0&playsinline=1&modestbranding=1`}
                  title={current.title}
                  tabIndex={dockExpanded ? 0 : -1}
                  className="block h-full w-full bg-black"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
              {dockExpanded && (
                <div className="min-w-0 py-1">
                  <div className="flex items-center gap-2 text-[0.68rem] font-black uppercase tracking-[0.16em] text-[var(--green)]">
                    <Youtube className="size-4" aria-hidden="true" />
                    Voice Lounge YouTube
                  </div>
                  <h2 className="mt-3 font-display text-[clamp(1.3rem,3vw,2.2rem)] font-black leading-tight">
                    {current.title}
                  </h2>
                  {current.description && (
                    <p className="mt-3 line-clamp-4 text-sm leading-6 text-white/65">{current.description}</p>
                  )}
                  <div className="mt-5 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={prev}
                      className="press inline-flex min-h-10 items-center gap-2 rounded-none border border-white/15 px-4 text-sm font-semibold"
                    >
                      <ChevronLeft className="size-4" aria-hidden="true" /> Previous
                    </button>
                    <button
                      type="button"
                      onClick={next}
                      className="press inline-flex min-h-10 items-center gap-2 rounded-none border border-white/15 px-4 text-sm font-semibold"
                    >
                      Next <ChevronRight className="size-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={enterFullscreen}
                      className="press inline-flex min-h-10 items-center gap-2 rounded-none border border-white/15 px-4 text-sm font-semibold"
                    >
                      Fullscreen <Maximize2 className="size-4" aria-hidden="true" />
                    </button>
                    <a
                      href={current.watchUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="press inline-flex min-h-10 items-center gap-2 rounded-none border border-white/15 px-4 text-sm font-semibold"
                    >
                      YouTube <ExternalLink className="size-4" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="shell grid min-h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-2 md:grid-cols-[minmax(0,1fr)_auto_auto]">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setDockExpanded(true)}
                aria-label="Expand podcast video player"
                className="press hidden h-11 w-16 shrink-0 overflow-hidden rounded-none bg-black sm:block"
              >
                <img
                  src={current.thumbnail}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              </button>
              <div className="min-w-0">
                <p className="text-[0.65rem] font-black uppercase tracking-[0.13em] text-[var(--green)]">
                  Playing from podcasts
                </p>
                <p className="truncate text-sm font-semibold">{current.title}</p>
              </div>
            </div>

            <div className="hidden items-center gap-1 md:flex">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous Voice Lounge video"
                className="press grid size-10 place-items-center rounded-none border border-hairline text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next Voice Lounge video"
                className="press grid size-10 place-items-center rounded-none border border-hairline text-muted-foreground hover:text-foreground"
              >
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex items-center justify-end gap-1">
              <button
                type="button"
                onClick={() => setDockExpanded((expanded) => !expanded)}
                aria-label={dockExpanded ? "Collapse podcast video player" : "Expand podcast video player"}
                className="press grid size-10 place-items-center rounded-none border border-hairline"
              >
                {dockExpanded ? (
                  <ChevronDown className="size-4" aria-hidden="true" />
                ) : (
                  <ChevronUp className="size-4" aria-hidden="true" />
                )}
              </button>
              <button
                type="button"
                onClick={close}
                aria-label="Close podcast video player"
                className="press grid size-10 place-items-center rounded-none border border-hairline text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </YouTubePlayerContext.Provider>
  );
}

export function useYouTubePlayer() {
  const value = useContext(YouTubePlayerContext);
  if (!value) throw new Error("useYouTubePlayer must be used inside YouTubePlayerProvider");
  return value;
}
