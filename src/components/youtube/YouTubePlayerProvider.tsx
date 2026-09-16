import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ExternalLink, Play, Youtube } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
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
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps" });
  const currentIndex = currentId ? videos.findIndex((video) => video.id === currentId) : -1;
  const current = currentIndex >= 0 ? videos[currentIndex] ?? null : null;

  const open = useCallback((video: YouTubeFeedVideo) => {
    setCurrentId(video.id);
    track("video_play", { id: video.id, source: "youtube" });
  }, []);

  const close = useCallback(() => setCurrentId(null), []);

  const next = useCallback(() => {
    if (!videos.length) return;
    const index = currentIndex < 0 ? 0 : (currentIndex + 1) % videos.length;
    const video = videos[index];
    if (!video) return;
    setCurrentId(video.id);
    track("video_play", { id: video.id, source: "youtube_next" });
    emblaApi?.scrollTo(Math.min(index, Math.max(0, videos.length - 1)));
  }, [currentIndex, emblaApi, videos]);

  const prev = useCallback(() => {
    if (!videos.length) return;
    const index = currentIndex <= 0 ? videos.length - 1 : currentIndex - 1;
    const video = videos[index];
    if (!video) return;
    setCurrentId(video.id);
    track("video_play", { id: video.id, source: "youtube_prev" });
    emblaApi?.scrollTo(Math.max(0, index - 1));
  }, [currentIndex, emblaApi, videos]);

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
      <Dialog open={Boolean(current)} onOpenChange={(isOpen) => !isOpen && close()}>
        {current && (
          <DialogContent className="hyper-glass vl-player-dialog max-h-[94vh] w-[min(96vw,1260px)] max-w-none overflow-y-auto border-white/15 bg-black/80 p-0 text-white sm:rounded-[2rem]">
            <DialogTitle className="sr-only">{current.title}</DialogTitle>
            <DialogDescription className="sr-only">Play The Voice Lounge YouTube video inside the website.</DialogDescription>

            <div className="relative aspect-video w-full overflow-hidden rounded-t-[inherit] bg-black">
              <iframe
                key={current.id}
                src={`${current.embedUrl}?autoplay=1&rel=0&playsinline=1`}
                title={current.title}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <div className="grid gap-5 p-[clamp(1rem,2.5vw,2rem)] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--green)]">
                  <Youtube className="size-4" aria-hidden="true" /> In-site playback
                </div>
                <h2 className="mt-2 font-display text-[clamp(1.25rem,2.4vw,2rem)] font-extrabold leading-tight">{current.title}</h2>
                {current.description && <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-white/60">{current.description}</p>}
              </div>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                <button type="button" onClick={prev} className="press hyper-glass inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold">
                  <ChevronLeft className="size-4" aria-hidden="true" /> Previous
                </button>
                <button type="button" onClick={next} className="press inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--green-action)] px-4 text-sm font-semibold text-white shadow-glow">
                  Next <ChevronRight className="size-4" aria-hidden="true" />
                </button>
                <a href={current.watchUrl} target="_blank" rel="noreferrer" className="press hyper-glass inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold">
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
                    <button type="button" onClick={() => emblaApi?.scrollPrev()} aria-label="Scroll Up Next left" className="press hyper-glass grid size-9 place-items-center rounded-full"><ChevronLeft className="size-4" /></button>
                    <button type="button" onClick={() => emblaApi?.scrollNext()} aria-label="Scroll Up Next right" className="press hyper-glass grid size-9 place-items-center rounded-full"><ChevronRight className="size-4" /></button>
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
                        <span className="hyper-glass block overflow-hidden rounded-2xl border border-white/10">
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
          </DialogContent>
        )}
      </Dialog>
    </YouTubePlayerContext.Provider>
  );
}

export function useYouTubePlayer() {
  const value = useContext(YouTubePlayerContext);
  if (!value) throw new Error("useYouTubePlayer must be used inside YouTubePlayerProvider");
  return value;
}
