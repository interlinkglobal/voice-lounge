import { createFileRoute } from "@tanstack/react-router";
import {
  PREMIUM_DEV_COOKIE,
  PREMIUM_REFERENCE_COOKIE,
  clearPremiumDevCookie,
  clearPremiumReferenceCookie,
  developmentBypassEnabled,
  getRequestAuthUser,
  verifyVoiceLoungePremium,
} from "@/lib/premium/payment.server";
import { parseCookieHeader } from "@/lib/auth/supabase.server";

export const Route = createFileRoute("/api/premium/status")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const cookies = parseCookieHeader(request.headers.get("cookie"));

        if (cookies.get(PREMIUM_DEV_COOKIE) === "1") {
          if (developmentBypassEnabled()) {
            return Response.json({ active: true, mode: "development" });
          }
          return Response.json(
            { active: false, mode: "locked" },
            { headers: { "Set-Cookie": clearPremiumDevCookie() } },
          );
        }

        const user = await getRequestAuthUser(request);
        if (!user) return Response.json({ active: false, mode: "signed-out" });

        const reference = cookies.get(PREMIUM_REFERENCE_COOKIE)?.trim() || "";
        if (!reference) return Response.json({ active: false, mode: "locked" });

        const verification = await verifyVoiceLoungePremium(reference, user);
        if (!verification.ok) {
          if (verification.reason === "unavailable") {
            return Response.json(
              { error: "Premium verification is temporarily unavailable." },
              { status: 503, headers: { "Retry-After": "30" } },
            );
          }
          return Response.json(
            { active: false, mode: "locked" },
            { headers: { "Set-Cookie": clearPremiumReferenceCookie() } },
          );
        }

        return Response.json({ active: true, mode: "payment" });
      },
    },
  },
});
