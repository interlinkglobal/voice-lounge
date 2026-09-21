import { useCallback, useEffect, useState } from "react";
import { ExternalLink, Radio, Trash2, Video, WifiOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface RouteVideo {
  id: string;
  route_path: string;
  youtube_url: string;
  video_id: string;
  title: string;
  status: string;
  created_at: string;
}

interface LiveRecord {
  id: string;
  youtube_url: string;
  video_id: string;
  title: string;
  status: "live" | "ended" | "draft";
  started_at: string;
  ended_at: string | null;
}

export function AdminRouteVideoManager() {
  const [rows, setRows] = useState<RouteVideo[]>([]);
  const [routePath, setRoutePath] = useState("/watch");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const response = await fetch("/api/route-videos?all=1", { headers: { Accept: "application/json" }, cache: "no-store" });
    const payload = (await response.json().catch(() => ({}))) as { videos?: RouteVideo[] };
    if (response.ok) setRows(payload.videos ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async () => {
    if (!routePath.trim() || !youtubeUrl.trim()) return;
    setBusy(true);
    try {
      const response = await fetch("/api/route-videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ route_path: routePath.trim(), youtube_url: youtubeUrl.trim(), title: title.trim() || undefined }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Video could not be saved.");
      setYoutubeUrl("");
      setTitle("");
      toast.success("Video added to the route");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Video could not be saved.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    const response = await fetch(`/api/route-videos?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (response.ok) {
      toast.success("Video removed");
      await load();
    } else {
      toast.error("Video could not be removed.");
    }
  };

  return (
    <Card className="mt-6 rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Video className="size-5 text-[var(--green)]" /> Route video links</CardTitle>
        <CardDescription>Add a YouTube URL or iframe to any front-site route. The link is resolved into a clean Voice Lounge video card automatically.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 lg:grid-cols-[14rem_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end">
          <label className="grid gap-1.5 text-sm font-semibold">
            Route path
            <Input value={routePath} onChange={(event) => setRoutePath(event.target.value)} placeholder="/watch" />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">
            YouTube URL / iframe
            <Input value={youtubeUrl} onChange={(event) => setYoutubeUrl(event.target.value)} placeholder="https://youtube.com/watch?v=…" />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">
            Optional title override
            <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Resolved from YouTube if blank" />
          </label>
          <Button onClick={() => void save()} disabled={busy || !youtubeUrl.trim()} className="bg-[var(--green-action)] text-white">
            {busy ? "Saving…" : "Add video"}
          </Button>
        </div>

        <div className="grid gap-2">
          {rows.map((row) => (
            <div key={row.id} className="grid gap-3 rounded-md border border-hairline p-3 sm:grid-cols-[8rem_minmax(0,1fr)_auto] sm:items-center">
              <Badge variant="outline" className="w-fit">{row.route_path}</Badge>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{row.title}</p>
                <a href={row.youtube_url} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                  YouTube <ExternalLink className="size-3" />
                </a>
              </div>
              <Button size="icon" variant="ghost" onClick={() => void remove(row.id)} aria-label={`Remove ${row.title}`}>
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          ))}
          {!rows.length && <p className="text-sm text-muted-foreground">No admin-added route videos yet.</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminLiveControl() {
  const [rows, setRows] = useState<LiveRecord[]>([]);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const response = await fetch("/api/live-control?admin=1", { headers: { Accept: "application/json" }, cache: "no-store" });
    const payload = (await response.json().catch(() => ({}))) as { broadcasts?: LiveRecord[] };
    if (response.ok) setRows(payload.broadcasts ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const start = async () => {
    if (!youtubeUrl.trim()) return;
    setBusy(true);
    try {
      const response = await fetch("/api/live-control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start", youtube_url: youtubeUrl.trim(), title: title.trim() || undefined }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Live could not be saved.");
      setYoutubeUrl("");
      setTitle("");
      toast.success("Live broadcast is now being served on /live");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Live could not be saved.");
    } finally {
      setBusy(false);
    }
  };

  const end = async () => {
    setBusy(true);
    try {
      const response = await fetch("/api/live-control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "end" }),
      });
      if (!response.ok) throw new Error("Live could not be ended.");
      toast.success("Live broadcast ended; /live will return to automatic detection/fallback.");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Live could not be ended.");
    } finally {
      setBusy(false);
    }
  };

  const active = rows.find((row) => row.status === "live") ?? null;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Live</h1>
        <p className="text-sm text-muted-foreground">Override automatic channel detection by saving an exact YouTube live URL or iframe. Ending it returns /live to automatic detection and the offline fallback.</p>
      </div>

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Radio className="size-5 text-[var(--live)]" /> Live control</CardTitle>
          <CardDescription>Supabase-backed manual live override.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {active ? (
            <div className="rounded-md border border-[color-mix(in_oklab,var(--live)_45%,var(--hairline))] bg-[color-mix(in_oklab,var(--live)_5%,transparent)] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Badge className="bg-[var(--live)] text-white">LIVE</Badge>
                  <h2 className="mt-2 font-semibold">{active.title}</h2>
                  <a href={active.youtube_url} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                    Open source <ExternalLink className="size-3" />
                  </a>
                </div>
                <Button variant="destructive" onClick={() => void end()} disabled={busy}>
                  <WifiOff className="mr-2 size-4" /> End live
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-md border border-hairline p-4 text-sm text-muted-foreground">No manual live override is active.</div>
          )}

          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end">
            <label className="grid gap-1.5 text-sm font-semibold">
              YouTube live URL / iframe
              <Input value={youtubeUrl} onChange={(event) => setYoutubeUrl(event.target.value)} placeholder="Paste a YouTube live link or iframe" />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold">
              Optional title override
              <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Resolved from YouTube if blank" />
            </label>
            <Button onClick={() => void start()} disabled={busy || !youtubeUrl.trim()} className="bg-[var(--green-action)] text-white">
              {busy ? "Saving…" : "Serve live"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-lg">
        <CardHeader><CardTitle>Recent live records</CardTitle></CardHeader>
        <CardContent className="grid gap-2">
          {rows.slice(0, 12).map((row) => (
            <div key={row.id} className="flex items-center justify-between gap-3 border-t border-hairline pt-2 text-sm">
              <span className="min-w-0 truncate">{row.title}</span>
              <Badge variant="outline">{row.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
