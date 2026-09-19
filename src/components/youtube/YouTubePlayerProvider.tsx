import { useRouterState } from "@tanstack/react-router";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ExternalLink, Maximize2, Play, X, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { usePlayer } from "@/components/player/PlayerProvider";
import type { YouTubeFeedResult, YouTubeFeedVideo } from "@/lib/youtube.functions";

interface YouTubePlayerContextValue {
  current: YouTubeFeedVideo | null;
  open: (video: YouTubeFeedVideo) => void;
  close: () => void;
  next: () => void;
  prev: () => void;
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
  const { pause: pauseLegacyPlayback } = usePlayer();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps" });
  const currentIndex = currentId ? videos.findIndex((video) => video.id === currentId) : -1;
  const current = currentIndex >= 0 ? videos[currentIndex] ?? null : null;

  const open = useCallback((video: YouTubeFeedVideo) => {
    pauseLegacyPlayback();
    setCurrentId(video.id);
    track("video_play", { id: video.id, source: "youtube" });
  }, [pauseLegacyPlayback]);

  const close = useCallback(() => setCurrentId(null), []);

  const enterFullscreen = useCallback(async () => {
    const frame = iframeRef.current;
    if (!frame) return;
    try {
      if (frame.requestFullscreen) {
        await frame.requestFullscreen();
        return;
      }
      const webkitFrame = frame as HTMLIFrameElement & { webkitRequestFullscreen?: () => Promise<void> | void };
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
    track("video_play", { id: video.id, source: "youtube_next" });
    emblaApi?.scrollTo(Math.min(index, Math.max(0, videos.length - 1)));
  }, [currentIndex, emblaApi, pauseLegacyPlayback, videos]);

  const prev = useCallback(() => {
    if (!videos.length) return;
    pauseLegacyPlayback();
    const index = currentIndex <= 0 ? videos.length - 1 : currentIndex - 1;
    const video = videos[index];
    if (!video) return;
    setCurrentId(video.id);
    track("video_play", { id: video.id, source: "youtube_prev" });
    emblaApi?.scrollTo(Math.max(0, index - 1));
  }, [currentIndex, emblaApi, pauseLegacyPlayback, videos]);

  useEffect(() => {
    setCurrentId(null);
  }, [pathname]);

  useEffect(() => {
    if (!current) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
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
  }, [close, current, next, prev]);

  const upNext = useMemo(
    () => videos.filter((video) => video.id !== currentId),
    [currentId, videos],
  );

  const value = useMemo<YouTubePlayerContextValue>(
    () => ({ current, open, close, next, prev }),
    [close, current, next, open, prev],
  );

  return (
    <YouTubePlayerContext.Provider value={value}>
      {children}
      {current && (
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
                  <h2 className="mt-2 font-display text-[clamp(1.25rem,2.4vw,2rem)] font-extrabold leading-tight">{current.title}</h2>
                  {current.description && <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-white/60">{current.description}</p>}
                </div>
                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <button type="button" onClick={prev} className="press inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 text-sm font-semibold">
                    <ChevronLeft className="size-4" aria-hidden="true" /> Previous
                  </button>
                  <button type="button" onClick={next} className="press inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--green-action)] px-4 text-sm font-semibold text-white shadow-glow">
                    Next <ChevronRight className="size-4" aria-hidden="true" />
                  </button>
                  <a href={current.watchUrl} target="_blank" rel="noreferrer" className="press inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 text-sm font-semibold">
                    YouTube <ExternalLink className="size-4" aria-hidden="true" />
                  </a>
                </div>
              </div>

              {upNext.length > 0 && (
                <section className="border-t border-white/10 px-[clamp(1rem,2.5vw,2rem)] pb-[clamp(1rem,2.5vw,2rem)] pt-5" aria-labelledby="youtube-up-next">
                  <div className="mb-3 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--gold)]">Queue</p>
                      <h3 id="youtube-up-next" className="font-display text-xl font-bold">Up next</h3>
                    </div>
                    <div className="hidden gap-2 sm:flex">
                      <button type="button" onClick={() => emblaApi?.scrollPrev()} aria-label="Scroll Up Next left" className="press grid size-9 place-items-center rounded-full border border-white/15 bg-white/[0.06]"><ChevronLeft className="size-4" /></button>
                      <button type="button" onClick={() => emblaApi?.scrollNext()} aria-label="Scroll Up Next right" className="press grid size-9 place-items-center rounded-full border border-white/15 bg-white/[0.06]"><ChevronRight className="size-4" /></button>
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
                              <img src={video.thumbnail} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.045]" loading="lazy" decoding="async" />
                              <span className="absolute inset-0 grid place-items-center bg-black/10"><span className="grid size-10 place-items-center rounded-full bg-[var(--green-action)] text-white shadow-glow"><Play className="size-4 fill-current" /></span></span>
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
    </YouTubePlayerContext.Provider>
  );
}

export function useYouTubePlayer() {
  const value = useContext(YouTubePlayerContext);
  if (!value) throw new Error("useYouTubePlayer must be used inside YouTubePlayerProvider");
  return value;
}
