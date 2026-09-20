import { createFileRoute } from "@tanstack/react-router";
import {
  getRequestAuthUser,
  premiumReferenceCookie,
  verifyVoiceLoungePremium,
} from "@/lib/premium/payment.server";

const PAYMENT_REFERENCE = /^[A-Za-z0-9._:-]{6,160}$/;

export const Route = createFileRoute("/api/premium/confirm")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const user = await getRequestAuthUser(request);
        if (!user) {
          return Response.json({ error: "Sign in before activating Premium." }, { status: 401 });
        }

        const body = (await request.json().catch(() => null)) as { reference?: unknown } | null;
        const reference = typeof body?.reference === "string" ? body.reference.trim() : "";
        if (!PAYMENT_REFERENCE.test(reference)) {
          return Response.json({ error: "A valid payment reference is required." }, { status: 400 });
        }

        const verification = await verifyVoiceLoungePremium(reference, user);
        if (!verification.ok) {
          if (verification.reason === "unavailable") {
            return Response.json(
              { error: "Interlink payment verification is temporarily unavailable. Try again shortly." },
              { status: 503, headers: { "Retry-After": "30" } },
            );
          }
          return Response.json(
            { error: "This payment does not match the signed-in Voice Lounge Premium account." },
            { status: 403 },
          );
        }

        return Response.json(
          { success: true, premium: true },
          { headers: { "Set-Cookie": premiumReferenceCookie(verification.reference) } },
        );
      },
    },
  },
});
