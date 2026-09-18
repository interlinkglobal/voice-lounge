import { createServerFn } from "@tanstack/react-start";
import { isAuthSessionConfigured, useVoiceLoungeSession, type AuthUser } from "./session";

export const getCurrentUser = createServerFn({ method: "GET" }).handler(async (): Promise<AuthUser | null> => {
  if (!isAuthSessionConfigured()) return null;
  const session = await useVoiceLoungeSession();
  return session.data.user ?? null;
});
