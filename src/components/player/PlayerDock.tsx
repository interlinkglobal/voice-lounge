import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Gauge,
  Heart,
  ListMusic,
  Maximize2,
  Pause,
  PictureInPicture2,
  Play,
  Share2,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { clock, usePlayer } from "./PlayerProvider";
import { Artwork } from "@/components/media/Artwork";
import { useLibrary } from "@/components/system/library";
import { track } from "@/lib/analytics";

const RATES = [0.75, 1, 1.25, 1.5, 2];

function Scrubber({ compact }: { compact?: boolean }) {
  const { time, duration, seek, current } = usePlayer();
  const max = duration || current?.durationSec || 0;
  return (
    <div className={cn("flex w-full items-center gap-2", compact && "gap-1.5")}>
      <span className="w-10 shrink-0 text-right text-[0.68rem] text-muted-foreground tabular-nums">{clock(time)}</span>
      <input
        type="range"
        min={0}
        max={max || 1}
        step={1}
        value={Math.min(time, max)}
        onChange={(e) => seek(Number(e.target.value))}
        aria-label="Seek"
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[color-mix(in_oklab,var(--muted-foreground)_35%,transparent)] accent-[var(--green-action)]"
        style={{
          backgroundImage: `linear-gradient(var(--green-action),var(--green-action))`,
          backgroundSize: `${max ? (time / max) * 100 : 0}% 100%`,
          backgroundRepeat: "no-repeat",
        }}
      />
      <span className="w-10 shrink-0 text-[0.68rem] text-muted-foreground tabular-nums">
        −{clock(Math.max(0, max - time))}
      </span>
    </div>
  );
}

export function PlayerDock() {
  const p = usePlayer();
  const { isSaved, toggleSave, noteHistory } = useLibrary();
  const [showQueue, setShowQueue] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (p.current && p.duration) noteHistory(p.current.id, Math.round((p.time / p.duration) * 100));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.current?.id, Math.round(p.time / 15)]);

  useEffect(() => {
    if (p.playing) setDismissed(false);
  }, [p.current?.id, p.playing]);

  const dismissPlayer = () => {
    if (p.playing) p.toggle();
    p.setExpanded(false);
    setShowQueue(false);
    setDismissed(true);
  };

  if (!p.current || dismissed) return null;
  const c = p.current;

  const PlayPause = ({ big }: { big?: boolean }) => (
    <button
      type="button"
      onClick={p.toggle}
      aria-label={p.playing ? "Pause" : "Play"}
      className={cn(
        "press grid shrink-0 place-items-center rounded-full bg-[var(--green-action)] text-white hover:bg-[var(--emerald)] hover:text-[oklch(0.16_0.02_155)]",
        big ? "size-16" : "size-11",
      )}
    >
      {p.playing ? (
        <Pause className={cn(big ? "size-7" : "size-5", "fill-current")} aria-hidden="true" />
      ) : (
        <Play className={cn(big ? "size-7" : "size-5", "fill-current")} aria-hidden="true" />
      )}
    </button>
  );

  return (
    <>
      {p.expanded && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Now playing"
          className="fixed inset-0 z-[var(--z-overlay)] overflow-y-auto bg-[color-mix(in_oklab,var(--ink)_92%,transparent)] backdrop-blur-xl"
        >
          <div className="shell flex min-h-full flex-col py-4" style={{ paddingTop: "max(1rem,env(safe-area-inset-top))" }}>
            <div className="flex items-center justify-between">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-[var(--green)]">Now playing</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => p.setExpanded(false)}
                  aria-label="Collapse player"
                  className="press grid size-10 place-items-center rounded-full border border-white/15 text-white"
                >
                  <ChevronDown className="size-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={dismissPlayer}
                  aria-label="Dismiss player"
                  className="press grid size-10 place-items-center rounded-full border border-white/15 text-white"
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="mt-6 grid flex-1 items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <div className={cn("mx-auto w-full max-w-md", c.kind === "video" && "lg:mt-[min(56vw,40vh)]")}>
                {c.kind !== "video" && (
                  <div
                    className="overflow-hidden rounded-3xl shadow-lift"
                    style={{ animation: "vl-float 9s ease-in-out infinite" }}
                  >
                    <Artwork artwork={{ seed: c.artworkSeed, alt: c.title, ratio: "1/1" }} label={c.title} priority />
                  </div>
                )}
              </div>

              <div className="text-white">
                <p className="text-sm text-white/70">{c.show}</p>
                <h2 className="mt-1 font-display text-[var(--step-4)] font-extrabold leading-[1.03]">{c.title}</h2>
                {p.error && (
                  <p role="alert" className="mt-3 rounded-xl border border-white/15 bg-white/5 p-3 text-sm text-white/85">
                    {p.error}
                  </p>
                )}
                <div className="mt-6">
                  <Scrubber />
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <button type="button" onClick={p.prev} aria-label="Previous" className="press grid size-11 place-items-center rounded-full border border-white/15 text-white">
                    <SkipBack className="size-5" aria-hidden="true" />
                  </button>
                  <PlayPause big />
                  <button type="button" onClick={p.next} aria-label="Next in queue" className="press grid size-11 place-items-center rounded-full border border-white/15 text-white">
                    <SkipForward className="size-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={p.toggleMute}
                    aria-label={p.muted ? "Unmute" : "Mute"}
                    className="press grid size-11 place-items-center rounded-full border border-white/15 text-white"
                  >
                    {p.muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={p.volume}
                    onChange={(e) => p.setVolume(Number(e.target.value))}
                    aria-label="Volume"
                    className="w-28 accent-[var(--green-action)]"
                  />
                  <label className="flex items-center gap-1.5 text-sm text-white/80">
                    <Gauge className="size-4" aria-hidden="true" />
                    <span className="sr-only">Playback speed</span>
                    <select
                      value={p.rate}
                      onChange={(e) => p.setRate(Number(e.target.value))}
                      className="rounded-full border border-white/15 bg-transparent px-2 py-1 text-sm"
                    >
                      {RATES.map((r) => (
                        <option key={r} value={r} className="text-black">
                          {r}×
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => toggleSave(c.id)}
                    aria-pressed={isSaved(c.id)}
                    className="press inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white"
                  >
                    <Heart className={cn("size-4", isSaved(c.id) && "fill-[var(--gold)] text-[var(--gold)]")} aria-hidden="true" />
                    {isSaved(c.id) ? "Saved" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      track("share", { id: c.id });
                      void navigator.clipboard?.writeText(`${location.origin}${c.href}`);
                    }}
                    className="press inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white"
                  >
                    <Share2 className="size-4" aria-hidden="true" /> Share
                  </button>
                  <Link to={c.href} onClick={() => p.setExpanded(false)} className="press inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white">
                    <FileText className="size-4" aria-hidden="true" /> Transcript
                  </Link>
                  {c.kind === "video" && (
                    <button
                      type="button"
                      onClick={() => {
                        const el = p.mediaRef.current;
                        if (el && "requestPictureInPicture" in el) void el.requestPictureInPicture().catch(() => {});
                      }}
                      className="press inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white"
                    >
                      <PictureInPicture2 className="size-4" aria-hidden="true" /> Picture in picture
                    </button>
                  )}
                </div>

                <div className="mt-6">
                  <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white/60">Up next</h3>
                  {p.queue.length === 0 ? (
                    <p className="mt-2 text-sm text-white/60">Your queue is empty. Add episodes from any card.</p>
                  ) : (
                    <ul className="mt-2 grid gap-1">
                      {p.queue.slice(0, 5).map((t) => (
                        <li key={t.id}>
                          <button
                            type="button"
                            onClick={() => p.play(t)}
                            className="press flex w-full items-center gap-3 rounded-xl border border-white/10 p-2 text-left text-white/90 hover:bg-white/5"
                          >
                            <span className="w-10 shrink-0 overflow-hidden rounded-md">
                              <Artwork artwork={{ seed: t.artworkSeed, alt: t.title, ratio: "1/1" }} label={t.title} />
                            </span>
                            <span className="min-w-0 flex-1 truncate text-sm">{t.title}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className="fixed inset-x-0 bottom-0 z-[var(--z-player)] border-t border-hairline glass-panel"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="shell grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-2 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => p.setExpanded(true)}
              aria-label="Expand player"
              className="press w-11 shrink-0 overflow-hidden rounded-lg sm:w-12"
            >
              <Artwork artwork={{ seed: c.artworkSeed, alt: c.title, ratio: "1/1" }} label={c.title} />
            </button>
            <div className="min-w-0">
              <p className="truncate text-[0.82rem] font-semibold leading-tight">{c.title}</p>
              <p className="truncate text-[0.72rem] text-muted-foreground">{c.show}</p>
              {p.error && (
                <p role="alert" className="truncate text-[0.7rem] text-destructive">
                  {p.error}
                </p>
              )}
            </div>
          </div>

          <div className="hidden flex-col items-center gap-1 md:flex">
            <div className="flex items-center gap-2">
              <button type="button" onClick={p.prev} aria-label="Previous" className="press grid size-9 place-items-center rounded-full text-muted-foreground hover:text-foreground">
                <SkipBack className="size-4" aria-hidden="true" />
              </button>
              <PlayPause />
              <button type="button" onClick={p.next} aria-label="Next" className="press grid size-9 place-items-center rounded-full text-muted-foreground hover:text-foreground">
                <SkipForward className="size-4" aria-hidden="true" />
              </button>
            </div>
            <Scrubber compact />
          </div>

          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setShowQueue((v) => !v)}
              aria-label="Queue"
              aria-expanded={showQueue}
              className="press hidden size-10 place-items-center rounded-full text-muted-foreground hover:text-foreground lg:grid"
            >
              <ListMusic className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={p.toggleMute}
              aria-label={p.muted ? "Unmute" : "Mute"}
              className="press hidden size-10 place-items-center rounded-full text-muted-foreground hover:text-foreground lg:grid"
            >
              {p.muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </button>
            <span className="md:hidden">
              <PlayPause />
            </span>
            <button
              type="button"
              onClick={() => p.setExpanded(!p.expanded)}
              aria-label={p.expanded ? "Collapse player" : "Expand player"}
              className="press grid size-10 place-items-center rounded-full border border-hairline"
            >
              {p.expanded ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
            </button>
            <button
              type="button"
              onClick={dismissPlayer}
              aria-label="Dismiss player"
              title="Remove player from screen"
              className="press grid size-10 place-items-center rounded-full text-muted-foreground hover:bg-surface-2 hover:text-foreground"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => {
                const el = p.mediaRef.current;
                if (el?.requestFullscreen) void el.requestFullscreen().catch(() => {});
              }}
              aria-label="Fullscreen video"
              className="press hidden size-10 place-items-center rounded-full text-muted-foreground hover:text-foreground xl:grid"
            >
              <Maximize2 className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="md:hidden">
          <div className="shell pb-2">
            <Scrubber compact />
          </div>
        </div>
        {showQueue && (
          <div className="shell max-h-64 overflow-y-auto border-t border-hairline py-3">
            <h3 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">Queue</h3>
            {p.queue.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">Nothing queued yet.</p>
            ) : (
              <ul className="mt-2 grid gap-1">
                {p.queue.map((t) => (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => p.play(t)}
                      className="press flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-surface-2"
                    >
                      <span className="w-9 shrink-0 overflow-hidden rounded-md">
                        <Artwork artwork={{ seed: t.artworkSeed, alt: t.title, ratio: "1/1" }} label={t.title} />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm">{t.title}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">{t.show}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </>
  );
}
