import { createFileRoute } from "@tanstack/react-router";
import { getGoogleAuthConfig, safeReturnTo, verifyGoogleIdToken } from "@/lib/auth/google";
import { isAuthSessionConfigured, useVoiceLoungeSession } from "@/lib/auth/session";

interface GoogleTokenResponse {
  id_token?: string;
  access_token?: string;
  error?: string;
  error_description?: string;
}

function redirectWithStatus(request: Request, path: string, status: string) {
  const url = new URL(path, request.url);
  url.searchParams.set("auth", status);
  return Response.redirect(url, 303);
}

export const Route = createFileRoute("/auth/google/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const config = getGoogleAuthConfig(request);
        if (!config || !isAuthSessionConfigured()) {
          return redirectWithStatus(request, "/account", "unconfigured");
        }

        const url = new URL(request.url);
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");
        const error = url.searchParams.get("error");
        const session = await useVoiceLoungeSession();
        const pending = session.data.googleOAuth;

        if (error) {
          await session.update({ ...session.data, googleOAuth: undefined });
          return redirectWithStatus(request, pending?.returnTo ?? "/account", "cancelled");
        }

        if (
          !code ||
          !state ||
          !pending ||
          state !== pending.state ||
          Date.now() - pending.createdAt > 10 * 60 * 1000
        ) {
          await session.update({ ...session.data, googleOAuth: undefined });
          return redirectWithStatus(request, "/account", "invalid");
        }

        try {
          const body = new URLSearchParams({
            code,
            client_id: config.clientId,
            client_secret: config.clientSecret,
            redirect_uri: pending.redirectUri,
            grant_type: "authorization_code",
            code_verifier: pending.verifier,
          });

          const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
              "content-type": "application/x-www-form-urlencoded",
              Accept: "application/json",
            },
            body,
          });

          const token = (await tokenResponse.json()) as GoogleTokenResponse;
          if (!tokenResponse.ok || !token.id_token) {
            throw new Error(token.error_description || token.error || `Google token exchange failed with HTTP ${tokenResponse.status}`);
          }

          const user = await verifyGoogleIdToken(token.id_token, config.clientId);
          const returnTo = safeReturnTo(pending.returnTo);
          await session.update({ user, googleOAuth: undefined });
          return redirectWithStatus(request, returnTo, "success");
        } catch (error) {
          console.error("[google-auth] callback failed", error);
          await session.update({ ...session.data, googleOAuth: undefined });
          return redirectWithStatus(request, "/account", "error");
        }
      },
    },
  },
});
