import { createFileRoute } from "@tanstack/react-router";
import { AUTH_COOKIES, parseCookieHeader } from "@/lib/auth/supabase.server";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/auth/supabase";

type AccountAction =
  | "update_profile"
  | "create_playlist"
  | "delete_playlist"
  | "add_playlist_item"
  | "remove_playlist_item"
  | "save_content"
  | "unsave_content"
  | "delete_comment"
  | "remove_like"
  | "submit_contact";

function requestToken(request: Request) {
  return parseCookieHeader(request.headers.get("cookie")).get(AUTH_COOKIES.access) ?? "";
}

function restHeaders(token: string, extra?: Record<string, string>) {
  return {
    apikey: SUPABASE_PUBLISHABLE_KEY,
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
    ...extra,
  };
}

async function rest(
  token: string,
  path: string,
  init?: RequestInit,
) {
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: restHeaders(token, init?.headers as Record<string, string> | undefined),
    cache: "no-store",
  });
}

async function requireUser(token: string) {
  if (!token) return null;
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: restHeaders(token),
    cache: "no-store",
  });
  if (!response.ok) return null;
  const user = (await response.json()) as { id?: string; email?: string };
  return user.id ? user : null;
}

async function jsonOrError(response: Response) {
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "message" in payload
        ? String(payload.message)
        : `Supabase request failed with HTTP ${response.status}`;
    throw new Error(message);
  }
  return payload;
}

export const Route = createFileRoute("/api/account")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const token = requestToken(request);
        const user = await requireUser(token);
        if (!user) return Response.json({ error: "Authentication required." }, { status: 401 });

        const queries = [
          rest(token, "profiles?select=*&limit=1"),
          rest(token, "playlists?select=*&order=updated_at.desc"),
          rest(token, "playlist_items?select=*&order=position.asc,created_at.desc"),
          rest(token, "saved_content?select=*&order=created_at.desc"),
          rest(token, "content_likes?select=*&order=created_at.desc"),
          rest(token, "website_comments?select=*&order=created_at.desc"),
          rest(token, "contact_requests?select=*&order=created_at.desc"),
          rest(token, "billing_payments?select=*&order=created_at.desc"),
        ];
        const [
          profileResponse,
          playlistsResponse,
          itemsResponse,
          savedResponse,
          likesResponse,
          commentsResponse,
          contactsResponse,
          billingResponse,
        ] = await Promise.all(queries);

        try {
          const [profiles, playlists, playlistItems, saved, likes, comments, contacts, billing] =
            await Promise.all([
              jsonOrError(profileResponse),
              jsonOrError(playlistsResponse),
              jsonOrError(itemsResponse),
              jsonOrError(savedResponse),
              jsonOrError(likesResponse),
              jsonOrError(commentsResponse),
              jsonOrError(contactsResponse),
              jsonOrError(billingResponse),
            ]);

          return Response.json({
            profile: Array.isArray(profiles) ? profiles[0] ?? null : null,
            playlists,
            playlistItems,
            saved,
            likes,
            comments,
            contacts,
            billing,
          });
        } catch (error) {
          console.error("[account] read failed", error);
          return Response.json({ error: "Account data could not be loaded." }, { status: 502 });
        }
      },

      PATCH: async ({ request }) => {
        const token = requestToken(request);
        const user = await requireUser(token);
        if (!user) return Response.json({ error: "Authentication required." }, { status: 401 });

        const body = (await request.json().catch(() => null)) as {
          display_name?: unknown;
          picture_url?: unknown;
          preferred_language?: unknown;
        } | null;

        const update: Record<string, string | null> = {};
        if (typeof body?.display_name === "string") update.display_name = body.display_name.trim().slice(0, 120);
        if (typeof body?.picture_url === "string") update.picture_url = body.picture_url.trim().slice(0, 1000) || null;
        if (typeof body?.preferred_language === "string" && ["en", "xh", "zu", "af"].includes(body.preferred_language)) {
          update.preferred_language = body.preferred_language;
        }
        if (!Object.keys(update).length) {
          return Response.json({ error: "No supported profile fields supplied." }, { status: 400 });
        }

        const response = await rest(token, `profiles?user_id=eq.${encodeURIComponent(user.id!)}`, {
          method: "PATCH",
          headers: { Prefer: "return=representation" },
          body: JSON.stringify(update),
        });

        try {
          const rows = await jsonOrError(response);
          return Response.json({ profile: Array.isArray(rows) ? rows[0] ?? null : null });
        } catch (error) {
          console.error("[account] profile update failed", error);
          return Response.json({ error: "Profile could not be updated." }, { status: 502 });
        }
      },

      POST: async ({ request }) => {
        const token = requestToken(request);
        const user = await requireUser(token);
        if (!user) return Response.json({ error: "Authentication required." }, { status: 401 });

        const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
        const action = body?.action as AccountAction | undefined;
        if (!action) return Response.json({ error: "Action is required." }, { status: 400 });

        try {
          if (action === "create_playlist") {
            const name = typeof body?.name === "string" ? body.name.trim().slice(0, 80) : "";
            if (!name) return Response.json({ error: "Playlist name is required." }, { status: 400 });
            const response = await rest(token, "playlists", {
              method: "POST",
              headers: { Prefer: "return=representation" },
              body: JSON.stringify({ user_id: user.id, name }),
            });
            return Response.json({ playlist: (await jsonOrError(response))?.[0] ?? null });
          }

          if (action === "delete_playlist") {
            const id = typeof body?.id === "string" ? body.id : "";
            const response = await rest(token, `playlists?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
            await jsonOrError(response);
            return Response.json({ success: true });
          }

          if (action === "add_playlist_item") {
            const playlistId = typeof body?.playlist_id === "string" ? body.playlist_id : "";
            const contentType = typeof body?.content_type === "string" ? body.content_type : "";
            const contentId = typeof body?.content_id === "string" ? body.content_id : "";
            if (!playlistId || !contentId || !["video","podcast","episode","show"].includes(contentType)) {
              return Response.json({ error: "Valid playlist content is required." }, { status: 400 });
            }
            const response = await rest(token, "playlist_items", {
              method: "POST",
              headers: { Prefer: "return=representation,resolution=merge-duplicates" },
              body: JSON.stringify({
                playlist_id: playlistId,
                user_id: user.id,
                content_type: contentType,
                content_id: contentId,
                title: typeof body?.title === "string" ? body.title.slice(0, 300) : null,
                image_url: typeof body?.image_url === "string" ? body.image_url.slice(0, 1000) : null,
              }),
            });
            return Response.json({ item: (await jsonOrError(response))?.[0] ?? null });
          }

          if (action === "remove_playlist_item") {
            const id = typeof body?.id === "string" ? body.id : "";
            const response = await rest(token, `playlist_items?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
            await jsonOrError(response);
            return Response.json({ success: true });
          }

          if (action === "save_content") {
            const collection = typeof body?.collection === "string" ? body.collection : "saved";
            const contentType = typeof body?.content_type === "string" ? body.content_type : "content";
            const contentId = typeof body?.content_id === "string" ? body.content_id : "";
            if (!contentId || !["saved","watch_later","listen_later"].includes(collection)) {
              return Response.json({ error: "Valid saved content is required." }, { status: 400 });
            }
            const response = await rest(token, "saved_content", {
              method: "POST",
              headers: { Prefer: "return=representation,resolution=merge-duplicates" },
              body: JSON.stringify({
                user_id: user.id,
                collection,
                content_type: contentType,
                content_id: contentId,
                title: typeof body?.title === "string" ? body.title.slice(0, 300) : null,
                image_url: typeof body?.image_url === "string" ? body.image_url.slice(0, 1000) : null,
              }),
            });
            return Response.json({ item: (await jsonOrError(response))?.[0] ?? null });
          }

          if (action === "unsave_content") {
            const collection = typeof body?.collection === "string" ? body.collection : "saved";
            const contentType = typeof body?.content_type === "string" ? body.content_type : "content";
            const contentId = typeof body?.content_id === "string" ? body.content_id : "";
            const response = await rest(
              token,
              `saved_content?collection=eq.${encodeURIComponent(collection)}&content_type=eq.${encodeURIComponent(contentType)}&content_id=eq.${encodeURIComponent(contentId)}`,
              { method: "DELETE" },
            );
            await jsonOrError(response);
            return Response.json({ success: true });
          }

          if (action === "delete_comment") {
            const id = typeof body?.id === "string" ? body.id : "";
            const response = await rest(token, `website_comments?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
            await jsonOrError(response);
            return Response.json({ success: true });
          }

          if (action === "remove_like") {
            const contentType = typeof body?.content_type === "string" ? body.content_type : "";
            const contentId = typeof body?.content_id === "string" ? body.content_id : "";
            const response = await rest(
              token,
              `content_likes?content_type=eq.${encodeURIComponent(contentType)}&content_id=eq.${encodeURIComponent(contentId)}`,
              { method: "DELETE" },
            );
            await jsonOrError(response);
            return Response.json({ success: true });
          }

          if (action === "submit_contact") {
            const category = typeof body?.category === "string" ? body.category : "";
            const subject = typeof body?.subject === "string" ? body.subject.trim().slice(0, 160) : "";
            const message = typeof body?.message === "string" ? body.message.trim().slice(0, 5000) : "";
            if (!["guest","general","advertising","studio","press","support"].includes(category) || !subject || !message) {
              return Response.json({ error: "Complete the request before submitting." }, { status: 400 });
            }
            const response = await rest(token, "contact_requests", {
              method: "POST",
              headers: { Prefer: "return=representation" },
              body: JSON.stringify({
                user_id: user.id,
                category,
                subject,
                message,
                metadata: body?.metadata && typeof body.metadata === "object" ? body.metadata : {},
              }),
            });
            return Response.json({ request: (await jsonOrError(response))?.[0] ?? null });
          }

          return Response.json({ error: "Unsupported account action." }, { status: 400 });
        } catch (error) {
          console.error("[account] action failed", { action, error });
          return Response.json({ error: "The account action could not be completed." }, { status: 502 });
        }
      },
    },
  },
});
