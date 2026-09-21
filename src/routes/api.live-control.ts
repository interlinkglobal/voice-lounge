import { createFileRoute } from "@tanstack/react-router";
import { AUTH_COOKIES, parseCookieHeader } from "@/lib/auth/supabase.server";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/auth/supabase";
import { resolveYouTubeMetadata } from "@/lib/youtube-url";

function tokenFrom(request: Request) {
  return parseCookieHeader(request.headers.get("cookie")).get(AUTH_COOKIES.access) ?? "";
}

function headers(token?: string, extra?: Record<string,string>) {
  return {
    apikey: SUPABASE_PUBLISHABLE_KEY,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    Accept: "application/json",
    "Content-Type": "application/json",
    ...extra,
  };
}

async function currentUser(token: string) {
  if (!token) return null;
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: headers(token), cache: "no-store" });
  if (!response.ok) return null;
  const payload = (await response.json()) as { id?: string };
  return payload.id ?? null;
}

export const Route = createFileRoute("/api/live-control")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const admin = url.searchParams.get("admin") === "1";
        const token = tokenFrom(request);

        if (admin) {
          const userId = await currentUser(token);
          if (!userId) return Response.json({ error: "Authentication required." }, { status: 401 });
          const response = await fetch(
            `${SUPABASE_URL}/rest/v1/live_broadcasts?select=id,youtube_url,video_id,title,thumbnail_url,status,started_at,ended_at,created_at&order=created_at.desc&limit=20`,
            { headers: headers(token), cache: "no-store" },
          );
          const rows = await response.json().catch(() => []);
          return Response.json(response.ok ? { broadcasts: rows } : { error: "Live records could not be loaded." }, { status: response.ok ? 200 : 502 });
        }

        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/live_broadcasts?status=eq.live&select=id,youtube_url,video_id,title,thumbnail_url,status,started_at,created_at&order=created_at.desc&limit=1`,
          { headers: headers(), cache: "no-store" },
        );
        const rows = await response.json().catch(() => []);
        return Response.json(response.ok ? { live: Array.isArray(rows) ? rows[0] ?? null : null } : { live: null }, { status: response.ok ? 200 : 502 });
      },

      POST: async ({ request }) => {
        const token = tokenFrom(request);
        const userId = await currentUser(token);
        if (!userId) return Response.json({ error: "Authentication required." }, { status: 401 });

        const body = (await request.json().catch(() => null)) as {
          action?: unknown;
          youtube_url?: unknown;
          title?: unknown;
        } | null;
        const action = typeof body?.action === "string" ? body.action : "";

        if (action === "end") {
          const response = await fetch(`${SUPABASE_URL}/rest/v1/live_broadcasts?status=eq.live`, {
            method: "PATCH",
            headers: headers(token, { Prefer: "return=representation" }),
            body: JSON.stringify({ status: "ended", ended_at: new Date().toISOString() }),
          });
          const rows = await response.json().catch(() => []);
          return Response.json(response.ok ? { broadcasts: rows } : { error: "Live could not be ended." }, { status: response.ok ? 200 : 502 });
        }

        if (action !== "start") {
          return Response.json({ error: "Unsupported live action." }, { status: 400 });
        }

        const youtubeUrl = typeof body?.youtube_url === "string" ? body.youtube_url.trim() : "";
        const metadata = await resolveYouTubeMetadata(youtubeUrl);
        if (!metadata) return Response.json({ error: "That YouTube link or iframe could not be resolved." }, { status: 400 });

        await fetch(`${SUPABASE_URL}/rest/v1/live_broadcasts?status=eq.live`, {
          method: "PATCH",
          headers: headers(token),
          body: JSON.stringify({ status: "ended", ended_at: new Date().toISOString() }),
        });

        const response = await fetch(`${SUPABASE_URL}/rest/v1/live_broadcasts`, {
          method: "POST",
          headers: headers(token, { Prefer: "return=representation" }),
          body: JSON.stringify({
            youtube_url: metadata.watchUrl,
            video_id: metadata.videoId,
            title: typeof body?.title === "string" && body.title.trim() ? body.title.trim().slice(0, 300) : metadata.title,
            thumbnail_url: metadata.thumbnailUrl,
            status: "live",
            created_by: userId,
          }),
        });
        const rows = await response.json().catch(() => []);
        return Response.json(
          response.ok ? { live: Array.isArray(rows) ? rows[0] ?? null : null } : { error: "Live broadcast could not be saved." },
          { status: response.ok ? 200 : 502 },
        );
      },
    },
  },
});
