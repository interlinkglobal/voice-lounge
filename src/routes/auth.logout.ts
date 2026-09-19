import { createFileRoute } from "@tanstack/react-router";
import {
  AUTH_COOKIES,
  clearCookie,
  parseCookieHeader,
  revokeSupabaseSession,
} from "@/lib/auth/supabase.server";

function isSameOrigin(request: Request) {
  const expected = new URL(request.url).origin;
  const origin = request.headers.get("origin");
  if (origin) return origin === expected;

  const referer = request.headers.get("referer");
  if (!referer) return false;

  try {
    return new URL(referer).origin === expected;
  } catch {
    return false;
  }
}

export const Route = createFileRoute("/auth/logout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isSameOrigin(request)) return new Response("Forbidden", { status: 403 });

        const cookies = parseCookieHeader(request.headers.get("cookie"));
        const accessToken = cookies.get(AUTH_COOKIES.access);
        if (accessToken) await revokeSupabaseSession(accessToken);

        const headers = new Headers({
          Location: new URL("/", request.url).toString(),
          "Cache-Control": "private, no-store",
        });
        headers.append("Set-Cookie", clearCookie(AUTH_COOKIES.access));
        headers.append("Set-Cookie", clearCookie(AUTH_COOKIES.refresh));
        headers.append("Set-Cookie", clearCookie(AUTH_COOKIES.verifier));
        headers.append("Set-Cookie", clearCookie(AUTH_COOKIES.returnTo));

        return new Response(null, { status: 303, headers });
      },
    },
  },
});
