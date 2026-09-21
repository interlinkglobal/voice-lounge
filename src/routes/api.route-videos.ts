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

export const Route = createFileRoute("/api/route-videos")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const all = url.searchParams.get("all") === "1";
        const token = tokenFrom(request);

        if (all) {
          const userId = await currentUser(token);
          if (!userId) return Response.json({ error: "Authentication required." }, { status: 401 });

          const response = await fetch(
            `${SUPABASE_URL}/rest/v1/route_videos?select=id,route_path,youtube_url,video_id,title,thumbnail_url,status,created_at&order=created_at.desc`,
            { headers: headers(token), cache: "no-store" },
          );
          const rows = await response.json().catch(() => []);
          return Response.json(response.ok ? { videos: rows } : { error: "Route videos could not be loaded." }, { status: response.ok ? 200 : 502 });
        }

        const routePath = url.searchParams.get("route")?.trim() ?? "";
        if (!routePath) return Response.json({ videos: [] });

        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/route_videos?route_path=eq.${encodeURIComponent(routePath)}&status=eq.published&select=id,route_path,youtube_url,video_id,title,thumbnail_url,status,created_at&order=created_at.desc`,
          { headers: headers(), cache: "no-store" },
        );
        const rows = await response.json().catch(() => []);
        return Response.json(response.ok ? { videos: rows } : { videos: [] }, { status: response.ok ? 200 : 502 });
      },

      POST: async ({ request }) => {
        const token = tokenFrom(request);
        const userId = await currentUser(token);
        if (!userId) return Response.json({ error: "Authentication required." }, { status: 401 });

        const body = (await request.json().catch(() => null)) as {
          route_path?: unknown;
          youtube_url?: unknown;
          title?: unknown;
        } | null;

        const routePath = typeof body?.route_path === "string" ? body.route_path.trim() : "";
        const youtubeUrl = typeof body?.youtube_url === "string" ? body.youtube_url.trim() : "";
        if (!routePath.startsWith("/") || !youtubeUrl) {
          return Response.json({ error: "A route path and YouTube link are required." }, { status: 400 });
        }

        const metadata = await resolveYouTubeMetadata(youtubeUrl);
        if (!metadata) return Response.json({ error: "That YouTube link or iframe could not be resolved." }, { status: 400 });

        const response = await fetch(`${SUPABASE_URL}/rest/v1/route_videos`, {
          method: "POST",
          headers: headers(token, { Prefer: "return=representation" }),
          body: JSON.stringify({
            route_path: routePath,
            youtube_url: metadata.watchUrl,
            video_id: metadata.videoId,
            title: typeof body?.title === "string" && body.title.trim() ? body.title.trim().slice(0, 300) : metadata.title,
            thumbnail_url: metadata.thumbnailUrl,
            status: "published",
            created_by: userId,
          }),
        });
        const rows = await response.json().catch(() => []);
        return Response.json(
          response.ok ? { video: Array.isArray(rows) ? rows[0] ?? null : null } : { error: "Video could not be saved." },
          { status: response.ok ? 200 : 502 },
        );
      },

      DELETE: async ({ request }) => {
        const token = tokenFrom(request);
        const userId = await currentUser(token);
        if (!userId) return Response.json({ error: "Authentication required." }, { status: 401 });

        const url = new URL(request.url);
        const id = url.searchParams.get("id")?.trim() ?? "";
        if (!id) return Response.json({ error: "Video id is required." }, { status: 400 });

        const response = await fetch(`${SUPABASE_URL}/rest/v1/route_videos?id=eq.${encodeURIComponent(id)}`, {
          method: "DELETE",
          headers: headers(token),
        });
        return Response.json(response.ok ? { success: true } : { error: "Video could not be removed." }, { status: response.ok ? 200 : 502 });
      },
    },
  },
});
