import { createFileRoute } from "@tanstack/react-router";
import { createGooglePkce, getGoogleAuthConfig, safeReturnTo } from "@/lib/auth/google";
import { isAuthSessionConfigured, useVoiceLoungeSession } from "@/lib/auth/session";

export const Route = createFileRoute("/auth/google")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const config = getGoogleAuthConfig(request);
        const sessionConfigured = isAuthSessionConfigured();
        if (!config || !sessionConfigured) {
          console.error("[google-auth] configuration incomplete", {
            googleClientIdPresent: Boolean(process.env.GOOGLE_CLIENT_ID?.trim()),
            googleClientSecretPresent: Boolean(process.env.GOOGLE_CLIENT_SECRET?.trim()),
            googleRedirectUriPresent: Boolean(process.env.GOOGLE_REDIRECT_URI?.trim()),
            sessionSecretLength: process.env.SESSION_SECRET?.trim().length ?? 0,
            sessionConfigured,
          });
          return new Response("Google sign-in is not configured for this deployment.", {
            status: 503,
            headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
          });
        }

        const requestUrl = new URL(request.url);
        const returnTo = safeReturnTo(requestUrl.searchParams.get("returnTo"));
        const pkce = createGooglePkce();
        const session = await useVoiceLoungeSession();

        await session.update({
          ...session.data,
          googleOAuth: {
            state: pkce.state,
            verifier: pkce.verifier,
            returnTo,
            redirectUri: config.redirectUri,
            createdAt: Date.now(),
          },
        });

        const google = new URL("https://accounts.google.com/o/oauth2/v2/auth");
        google.searchParams.set("client_id", config.clientId);
        google.searchParams.set("redirect_uri", config.redirectUri);
        google.searchParams.set("response_type", "code");
        google.searchParams.set("scope", "openid email profile");
        google.searchParams.set("state", pkce.state);
        google.searchParams.set("code_challenge", pkce.challenge);
        google.searchParams.set("code_challenge_method", "S256");
        google.searchParams.set("prompt", "select_account");
        google.searchParams.set("include_granted_scopes", "true");

        return Response.redirect(google, 302);
      },
    },
  },
});
