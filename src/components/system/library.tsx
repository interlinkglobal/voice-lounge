import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { track } from "@/lib/analytics";

/** Local personalisation store: follows, saves, watch-later, history. */
interface LibraryState {
  following: string[];
  saved: string[];
  watchLater: string[];
  history: Array<{ id: string; at: number; progress: number }>;
}

const EMPTY: LibraryState = { following: [], saved: [], watchLater: [], history: [] };
const KEY = "vl-library";

interface LibraryCtx extends LibraryState {
  isFollowing: (id: string) => boolean;
  toggleFollow: (id: string, label?: string) => void;
  isSaved: (id: string) => boolean;
  toggleSave: (id: string, label?: string) => void;
  isWatchLater: (id: string) => boolean;
  toggleWatchLater: (id: string) => void;
  noteHistory: (id: string, progress: number) => void;
  ready: boolean;
}

const Ctx = createContext<LibraryCtx | null>(null);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LibraryState>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...EMPTY, ...(JSON.parse(raw) as Partial<LibraryState>) });
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, ready]);

  const toggle = useCallback((key: keyof Omit<LibraryState, "history">, id: string, evt: "follow" | "save") => {
    setState((s) => {
      const list = s[key];
      const has = list.includes(id);
      if (evt === "follow") track(has ? "unfollow" : "follow", { id });
      else if (!has) track("save", { id });
      return { ...s, [key]: has ? list.filter((x) => x !== id) : [id, ...list] };
    });
  }, []);

  const value = useMemo<LibraryCtx>(
    () => ({
      ...state,
      ready,
      isFollowing: (id) => state.following.includes(id),
      toggleFollow: (id) => toggle("following", id, "follow"),
      isSaved: (id) => state.saved.includes(id),
      toggleSave: (id) => toggle("saved", id, "save"),
      isWatchLater: (id) => state.watchLater.includes(id),
      toggleWatchLater: (id) => toggle("watchLater", id, "save"),
      noteHistory: (id, progress) =>
        setState((s) => ({
          ...s,
          history: [{ id, at: Date.now(), progress }, ...s.history.filter((h) => h.id !== id)].slice(0, 60),
        })),
    }),
    [state, ready, toggle],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLibrary() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLibrary must be used inside LibraryProvider");
  return ctx;
}
