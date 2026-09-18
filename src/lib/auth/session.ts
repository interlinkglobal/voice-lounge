import { useSession } from "@tanstack/react-start/server";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: "google";
}

export interface GoogleOAuthState {
  state: string;
  verifier: string;
  returnTo: string;
  redirectUri: string;
  createdAt: number;
}

export interface VoiceLoungeSessionData {
  user?: AuthUser;
  googleOAuth?: GoogleOAuthState;
}

export function authSessionSecret() {
  return process.env.SESSION_SECRET?.trim() ?? "";
}

export function isAuthSessionConfigured() {
  return authSessionSecret().length >= 32;
}

export function useVoiceLoungeSession() {
  const password = authSessionSecret();
  if (password.length < 32) {
    throw new Error("SESSION_SECRET must be at least 32 characters before authentication can be used.");
  }

  return useSession<VoiceLoungeSessionData>({
    name: "voice-lounge-session",
    password,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60,
    },
  });
}
