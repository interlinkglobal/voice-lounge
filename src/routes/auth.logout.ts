import { createFileRoute } from "@tanstack/react-router";
import { isAuthSessionConfigured, useVoiceLoungeSession } from "@/lib/auth/session";

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
        if (isAuthSessionConfigured()) {
          const session = await useVoiceLoungeSession();
          await session.clear();
        }
        return Response.redirect(new URL("/", request.url), 303);
      },
    },
  },
});
