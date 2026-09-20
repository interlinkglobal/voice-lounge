import { createFileRoute } from "@tanstack/react-router";
import {
  developmentBypassEnabled,
  premiumDevCookie,
} from "@/lib/premium/payment.server";

export const Route = createFileRoute("/api/premium/dev-unlock")({
  server: {
    handlers: {
      POST: async () => {
        if (!developmentBypassEnabled()) {
          return Response.json({ error: "Not found." }, { status: 404 });
        }

        return Response.json(
          { success: true, premium: true, mode: "development" },
          { headers: { "Set-Cookie": premiumDevCookie() } },
        );
      },
    },
  },
});
