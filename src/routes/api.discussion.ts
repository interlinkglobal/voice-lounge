import { createFileRoute } from "@tanstack/react-router";
import { AUTH_COOKIES, parseCookieHeader } from "@/lib/auth/supabase.server";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/auth/supabase";

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
  return response.json() as Promise<{ id?: string; email?: string; user_metadata?: { full_name?: string; name?: string; avatar_url?: string; picture?: string } }>;
}

export const Route = createFileRoute("/api/discussion")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const videoId = url.searchParams.get("videoId")?.trim() ?? "";
        if (!videoId) return Response.json({ error: "videoId is required." }, { status: 400 });

        const token = tokenFrom(request);
        const auth = token ? await currentUser(token) : null;
        const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
        const [commentsResponse, likesResponse, mineResponse] = await Promise.all([
          fetch(`${SUPABASE_URL}/rest/v1/website_comments?content_type=eq.youtube_video&content_id=eq.${encodeURIComponent(videoId)}&status=eq.published&select=id,user_id,body,author_name,avatar_url,created_at,updated_at&order=created_at.asc`, {
            headers: headers(undefined, authHeader),
            cache: "no-store",
          }),
          fetch(`${SUPABASE_URL}/rest/v1/content_likes?content_type=eq.video&content_id=eq.${encodeURIComponent(videoId)}&select=id`, {
            headers: headers(undefined, authHeader),
            cache: "no-store",
          }),
          auth?.id
            ? fetch(`${SUPABASE_URL}/rest/v1/content_likes?content_type=eq.video&content_id=eq.${encodeURIComponent(videoId)}&user_id=eq.${encodeURIComponent(auth.id)}&select=id&limit=1`, {
                headers: headers(token),
                cache: "no-store",
              })
            : Promise.resolve(new Response("[]", { status: 200, headers: { "Content-Type": "application/json" } })),
        ]);
        const comments = commentsResponse.ok ? await commentsResponse.json() : [];
        const likes = likesResponse.ok ? await likesResponse.json() : [];
        const mine = mineResponse.ok ? await mineResponse.json() : [];
        return Response.json({ comments, likeCount: Array.isArray(likes) ? likes.length : 0, liked: Array.isArray(mine) && mine.length > 0 });
      },

      POST: async ({ request }) => {
        const token = tokenFrom(request);
        const auth = await currentUser(token);
        if (!auth?.id) return Response.json({ error: "Authentication required." }, { status: 401 });

        const body = (await request.json().catch(() => null)) as Record<string,unknown> | null;
        const action = typeof body?.action === "string" ? body.action : "";
        const videoId = typeof body?.videoId === "string" ? body.videoId.trim() : "";
        if (!videoId) return Response.json({ error: "videoId is required." }, { status: 400 });

        if (action === "comment") {
          const text = typeof body?.body === "string" ? body.body.trim().slice(0,4000) : "";
          if (!text) return Response.json({ error: "Comment cannot be empty." }, { status: 400 });
          const meta = auth.user_metadata ?? {};
          const authorName = meta.full_name?.trim() || meta.name?.trim() || auth.email?.split("@")[0] || "Voice Lounge member";
          const avatarUrl = meta.avatar_url || meta.picture || null;
          const response = await fetch(`${SUPABASE_URL}/rest/v1/website_comments`, {
            method: "POST",
            headers: headers(token, { Prefer: "return=representation" }),
            body: JSON.stringify({ user_id: auth.id, content_type: "youtube_video", content_id: videoId, body: text, author_name: authorName, avatar_url: avatarUrl, status: "published" }),
          });
          const payload = await response.json().catch(() => null);
          if (!response.ok) return Response.json({ error: "Comment could not be posted." }, { status: 502 });
          return Response.json({ comment: Array.isArray(payload) ? payload[0] ?? null : null });
        }

        if (action === "like" || action === "unlike") {
          const endpoint = `${SUPABASE_URL}/rest/v1/content_likes`;
          if (action === "like") {
            const response = await fetch(endpoint, {
              method: "POST",
              headers: headers(token, { Prefer: "resolution=merge-duplicates,return=minimal" }),
              body: JSON.stringify({ user_id: auth.id, content_type: "video", content_id: videoId }),
            });
            if (!response.ok) return Response.json({ error: "Like could not be saved." }, { status: 502 });
          } else {
            const response = await fetch(`${endpoint}?content_type=eq.video&content_id=eq.${encodeURIComponent(videoId)}&user_id=eq.${encodeURIComponent(auth.id)}`, {
              method: "DELETE",
              headers: headers(token),
            });
            if (!response.ok) return Response.json({ error: "Like could not be removed." }, { status: 502 });
          }
          return Response.json({ success: true });
        }

        return Response.json({ error: "Unsupported discussion action." }, { status: 400 });
      },
    },
  },
});
