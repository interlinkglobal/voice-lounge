import { createFileRoute } from "@tanstack/react-router";
import { safeReturnTo } from "@/lib/auth/supabase";
import {
  AUTH_COOKIES,
  clearCookie,
  exchangeSupabaseCode,
  parseCookieHeader,
  sessionCookies,
} from "@/lib/auth/supabase.server";

function redirectWithStatus(request: Request, destination: string, status: string, cookies: string[] = []) {
  const url = new URL(safeReturnTo(destination), request.url);
  url.searchParams.set("auth", status);

  const headers = new Headers({
    Location: url.toString(),
    "Cache-Control": "private, no-store",
  });
  cookies.forEach((cookie) => headers.append("Set-Cookie", cookie));
  return new Response(null, { status: 303, headers });
}

export const Route = createFileRoute("/auth/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const code = url.searchParams.get("code");
        const providerError = url.searchParams.get("error");
        const providerDescription = url.searchParams.get("error_description");
        const cookies = parseCookieHeader(request.headers.get("cookie"));
        const verifier = cookies.get(AUTH_COOKIES.verifier);
        const returnTo = safeReturnTo(cookies.get(AUTH_COOKIES.returnTo));
        const clearPending = [
          clearCookie(AUTH_COOKIES.verifier),
          clearCookie(AUTH_COOKIES.returnTo),
        ];

        if (providerError) {
          console.warn("[supabase-auth] OAuth provider returned an error", {
            providerError,
            providerDescription,
          });
          return redirectWithStatus(request, returnTo, "cancelled", clearPending);
        }

        if (!code || !verifier) {
          console.warn("[supabase-auth] missing PKCE callback state", {
            codePresent: Boolean(code),
            verifierPresent: Boolean(verifier),
          });
          return redirectWithStatus(request, "/account", "invalid", clearPending);
        }

        try {
          const session = await exchangeSupabaseCode(code, verifier);
          return redirectWithStatus(request, returnTo, "success", [
            ...sessionCookies(session),
            ...clearPending,
          ]);
        } catch (error) {
          console.error("[supabase-auth] code exchange failed", error);
          return redirectWithStatus(request, "/account", "error", clearPending);
        }
      },
    },
  },
});
