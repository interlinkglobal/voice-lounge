import { createFileRoute } from "@tanstack/react-router";
import { safeReturnTo } from "@/lib/auth/supabase";
import {
  sessionCookies,
  signInWithEmailPassword,
  signUpWithEmailPassword,
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

function redirectWithStatus(
  request: Request,
  destination: string,
  status: string,
  cookies: string[] = [],
) {
  const url = new URL(destination, request.url);
  url.searchParams.set("auth", status);

  const headers = new Headers({
    Location: url.toString(),
    "Cache-Control": "private, no-store",
  });
  cookies.forEach((cookie) => headers.append("Set-Cookie", cookie));
  return new Response(null, { status: 303, headers });
}

export const Route = createFileRoute("/auth/email")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isSameOrigin(request)) return new Response("Forbidden", { status: 403 });

        const form = await request.formData();
        const email = String(form.get("email") ?? "").trim().toLowerCase();
        const password = String(form.get("password") ?? "");
        const intent = form.get("intent") === "signup" ? "signup" : "signin";
        const returnTo = safeReturnTo(String(form.get("returnTo") ?? "/account"));

        if (!email || !email.includes("@") || password.length < 8) {
          return redirectWithStatus(request, "/login", "invalid-input");
        }

        try {
          if (intent === "signup") {
            const session = await signUpWithEmailPassword(email, password);
            if (!session.access_token || !session.refresh_token) {
              return redirectWithStatus(request, "/login", "check-email");
            }

            return redirectWithStatus(
              request,
              returnTo,
              "success",
              sessionCookies(session),
            );
          }

          const session = await signInWithEmailPassword(email, password);
          return redirectWithStatus(
            request,
            returnTo,
            "success",
            sessionCookies(session),
          );
        } catch (error) {
          console.warn("[supabase-auth] email authentication failed", {
            intent,
            emailDomain: email.split("@")[1] ?? "unknown",
            error: error instanceof Error ? error.message : "unknown",
          });
          return redirectWithStatus(
            request,
            "/login",
            intent === "signup" ? "signup-failed" : "invalid-credentials",
          );
        }
      },
    },
  },
});
