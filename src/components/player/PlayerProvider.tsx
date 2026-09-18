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
import { episodes, podcastById } from "@/lib/content/catalog";
import type { Episode } from "@/lib/content/types";
import { track } from "@/lib/analytics";

export interface PlayerTrack {
  id: string;
  title: string;
  show: string;
  artworkSeed: string;
  src: string;
  kind: "audio" | "video";
  durationSec: number;
  href: string;
}

export function trackFromEpisode(e: Episode): PlayerTrack {
  return {
    id: e.id,
    title: e.title,
    show: podcastById(e.podcastId)?.title ?? "The Voice Lounge",
    artworkSeed: e.artwork.seed,
    src: e.mediaUrl,
    kind: e.kind,
    durationSec: e.durationSec,
    href: `/episodes/${e.slug}`,
  };
}

interface PlayerCtx {
  current: PlayerTrack | null;
  queue: PlayerTrack[];
  playing: boolean;
  time: number;
  duration: number;
  volume: number;
  muted: boolean;
  rate: number;
  expanded: boolean;
  error: string | null;
  loading: boolean;
  play: (t: PlayerTrack, queue?: PlayerTrack[]) => void;
  playById: (episodeId: string) => void;
  toggle: () => void;
  pause: () => void;
  seek: (s: number) => void;
  skip: (delta: number) => void;
  next: () => void;
  prev: () => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  setRate: (r: number) => void;
  setExpanded: (v: boolean) => void;
  enqueue: (t: PlayerTrack) => void;
  attachVideo: (el: HTMLVideoElement | null) => void;
  mediaRef: React.RefObject<HTMLVideoElement | null>;
}

const Ctx = createContext<PlayerCtx | null>(null);
const STATE_KEY = "vl-player-state";

export function PlayerProvider({ children }: { children: ReactNode }) {
  const mediaRef = useRef<HTMLVideoElement | null>(null);
  const [current, setCurrent] = useState<PlayerTrack | null>(null);
  const [queue, setQueue] = useState<PlayerTrack[]>([]);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.9);
  const [muted, setMuted] = useState(false);
  const [rate, setRateState] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const milestones = useRef<Set<number>>(new Set());

  /* restore prior session (never autoplays) */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STATE_KEY);
      if (!raw) return;
      const s = JSON.parse(raw) as {
        trackId?: string;
        time?: number;
        volume?: number;
        rate?: number;
        queueIds?: string[];
      };
      if (typeof s.volume === "number") setVolumeState(s.volume);
      if (typeof s.rate === "number") setRateState(s.rate);
      const ep = episodes.find((e) => e.id === s.trackId && e.kind === "audio");
      if (ep) {
        setCurrent(trackFromEpisode(ep));
        setTime(s.time ?? 0);
      }
      if (s.queueIds?.length) {
        setQueue(
          s.queueIds
            .map((id) => episodes.find((e) => e.id === id && e.kind === "audio"))
            .filter(Boolean)
            .map((e) => trackFromEpisode(e!)),
        );
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!current) return;
    const id = window.setTimeout(() => {
      localStorage.setItem(
        STATE_KEY,
        JSON.stringify({ trackId: current.id, time, volume, rate, queueIds: queue.map((q) => q.id) }),
      );
    }, 600);
    return () => window.clearTimeout(id);
  }, [current, time, volume, rate, queue]);

  useEffect(() => {
    const el = mediaRef.current;
    if (el) {
      el.volume = volume;
      el.muted = muted;
      el.playbackRate = rate;
    }
  }, [volume, muted, rate, current]);

  const play = useCallback((t: PlayerTrack, nextQueue?: PlayerTrack[]) => {
    if (t.kind === "video") {
      mediaRef.current?.pause();
      setPlaying(false);
      setLoading(false);
      setError("Video playback is handled by the official Voice Lounge YouTube player.");
      return;
    }
    setError(null);
    setLoading(true);
    milestones.current = new Set();
    setCurrent(t);
    setTime(0);
    if (nextQueue) setQueue(nextQueue.filter((x) => x.id !== t.id && x.kind === "audio"));
    setPlaying(true);
    track("play", { id: t.id, title: t.title });
  }, []);

  const playById = useCallback(
    (episodeId: string) => {
      const ep = episodes.find((e) => e.id === episodeId);
      if (!ep) {
        setError("This episode is not available yet.");
        return;
      }
      play(trackFromEpisode(ep));
    },
    [play],
  );

  /* drive the element */
  useEffect(() => {
    const el = mediaRef.current;
    if (!el || !current) return;
    if (playing) {
      const p = el.play();
      if (p) p.catch(() => setPlaying(false));
    } else {
      el.pause();
    }
  }, [playing, current]);

  const toggle = useCallback(() => {
    setPlaying((p) => {
      track(p ? "pause" : "play", { id: current?.id ?? "" });
      return !p;
    });
  }, [current]);

  const pause = useCallback(() => {
    mediaRef.current?.pause();
    setPlaying(false);
    setLoading(false);
  }, []);

  const seek = useCallback((s: number) => {
    const el = mediaRef.current;
    if (el) el.currentTime = s;
    setTime(s);
  }, []);

  const skip = useCallback((delta: number) => {
    const el = mediaRef.current;
    if (!el) return;
    el.currentTime = Math.max(0, Math.min(el.duration || 0, el.currentTime + delta));
  }, []);

  const next = useCallback(() => {
    setQueue((qq) => {
      if (!qq.length) return qq;
      const [head, ...rest] = qq;
      setCurrent(head);
      setTime(0);
      setPlaying(true);
      return rest;
    });
  }, []);

  const prev = useCallback(() => {
    const el = mediaRef.current;
    if (el && el.currentTime > 4) {
      el.currentTime = 0;
      return;
    }
    if (!current) return;
    const audioEpisodes = episodes.filter((e) => e.kind === "audio");
    const idx = audioEpisodes.findIndex((e) => e.id === current.id);
    const p = audioEpisodes[(idx - 1 + audioEpisodes.length) % audioEpisodes.length];
    if (p) play(trackFromEpisode(p));
  }, [current, play]);

  const onTimeUpdate = useCallback(() => {
    const el = mediaRef.current;
    if (!el) return;
    setTime(el.currentTime);
    const d = el.duration || 0;
    if (d > 0) {
      const pct = (el.currentTime / d) * 100;
      [25, 50, 75].forEach((m) => {
        if (pct >= m && !milestones.current.has(m)) {
          milestones.current.add(m);
          track(`progress_${m}` as "progress_25", { id: current?.id ?? "" });
        }
      });
    }
  }, [current]);

  const value = useMemo<PlayerCtx>(
    () => ({
      current,
      queue,
      playing,
      time,
      duration,
      volume,
      muted,
      rate,
      expanded,
      error,
      loading,
      play,
      playById,
      toggle,
      pause,
      seek,
      skip,
      next,
      prev,
      setVolume: (v) => setVolumeState(v),
      toggleMute: () => setMuted((m) => !m),
      setRate: (r) => setRateState(r),
      setExpanded,
      enqueue: (t) => {
        if (t.kind === "video") return;
        setQueue((qq) => (qq.some((x) => x.id === t.id) ? qq : [...qq, t]));
      },
      attachVideo: (el) => {
        mediaRef.current = el;
      },
      mediaRef,
    }),
    [
      current,
      queue,
      playing,
      time,
      duration,
      volume,
      muted,
      rate,
      expanded,
      error,
      loading,
      play,
      playById,
      toggle,
      pause,
      seek,
      skip,
      next,
      prev,
    ],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      {/* The single persistent media element for the whole application. */}
      <video
        ref={mediaRef}
        src={current?.src}
        playsInline
        preload="metadata"
        className={
          expanded && current?.kind === "video"
            ? "fixed left-1/2 top-[max(4.5rem,env(safe-area-inset-top))] z-[61] aspect-video w-[min(96vw,1180px)] -translate-x-1/2 rounded-2xl bg-black object-contain shadow-lift"
            : "pointer-events-none fixed left-0 top-0 h-px w-px opacity-0"
        }
        controls={expanded && current?.kind === "video"}
        aria-hidden={!(expanded && current?.kind === "video")}
        aria-label={current ? `${current.title} — ${current.show}` : undefined}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration || current?.durationSec || 0);
          setLoading(false);
        }}
        onTimeUpdate={onTimeUpdate}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onWaiting={() => setLoading(true)}
        onPlaying={() => setLoading(false)}
        onEnded={() => {
          track("completed", { id: current?.id ?? "" });
          next();
        }}
        onError={() => {
          setLoading(false);
          setPlaying(false);
          setError("This stream is unavailable right now. Try another episode.");
        }}
      />
    </Ctx.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePlayer must be used inside PlayerProvider");
  return ctx;
}

export function clock(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) sec = 0;
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  return h ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
}
