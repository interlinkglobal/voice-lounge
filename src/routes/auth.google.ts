import { createFileRoute } from "@tanstack/react-router";
import { SUPABASE_AUTH_URL, safeReturnTo } from "@/lib/auth/supabase";
import { AUTH_COOKIES, createPkce, serializeCookie } from "@/lib/auth/supabase.server";

export const Route = createFileRoute("/auth/google")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const requestUrl = new URL(request.url);
        const returnTo = safeReturnTo(requestUrl.searchParams.get("returnTo"));
        const callbackUrl = new URL("/auth/callback", request.url).toString();
        const { verifier, challenge } = createPkce();

        const authorize = new URL(`${SUPABASE_AUTH_URL}/authorize`);
        authorize.searchParams.set("provider", "google");
        authorize.searchParams.set("redirect_to", callbackUrl);
        authorize.searchParams.set("code_challenge", challenge);
        authorize.searchParams.set("code_challenge_method", "s256");
        authorize.searchParams.set("scopes", "openid email profile");
        authorize.searchParams.set("prompt", "select_account");

        const headers = new Headers({
          Location: authorize.toString(),
          "Cache-Control": "private, no-store",
        });
        headers.append("Set-Cookie", serializeCookie(AUTH_COOKIES.verifier, verifier, 10 * 60));
        headers.append("Set-Cookie", serializeCookie(AUTH_COOKIES.returnTo, returnTo, 10 * 60));

        return new Response(null, { status: 302, headers });
      },
    },
  },
});
