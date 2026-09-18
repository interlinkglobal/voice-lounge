import { createHash, randomBytes } from "node:crypto";
import type { AuthUser } from "./session";

export interface GoogleAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

function base64Url(input: Uint8Array) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function createGooglePkce() {
  const verifier = base64Url(randomBytes(48));
  const challenge = base64Url(createHash("sha256").update(verifier).digest());
  return {
    state: base64Url(randomBytes(32)),
    verifier,
    challenge,
  };
}

export function getGoogleAuthConfig(request: Request): GoogleAuthConfig | null {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim() ?? "";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim() ?? "";
  if (!clientId || !clientSecret) return null;

  const configuredRedirect = process.env.GOOGLE_REDIRECT_URI?.trim();
  const redirectUri = configuredRedirect || new URL("/auth/google/callback", request.url).toString();
  return { clientId, clientSecret, redirectUri };
}

export function safeReturnTo(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/account";
  try {
    const parsed = new URL(value, "https://voice-lounge.invalid");
    if (parsed.origin !== "https://voice-lounge.invalid") return "/account";
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return "/account";
  }
}

interface GoogleTokenInfo {
  aud?: string;
  iss?: string;
  sub?: string;
  email?: string;
  email_verified?: string | boolean;
  name?: string;
  picture?: string;
  exp?: string;
}

export async function verifyGoogleIdToken(idToken: string, clientId: string): Promise<AuthUser> {
  const url = new URL("https://oauth2.googleapis.com/tokeninfo");
  url.searchParams.set("id_token", idToken);

  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Google token verification failed with HTTP ${response.status}`);

  const info = (await response.json()) as GoogleTokenInfo;
  const issuerValid = info.iss === "accounts.google.com" || info.iss === "https://accounts.google.com";
  const verified = info.email_verified === true || info.email_verified === "true";
  const expiresAt = Number(info.exp ?? 0);

  if (
    info.aud !== clientId ||
    !issuerValid ||
    !info.sub ||
    !info.email ||
    !verified ||
    !Number.isFinite(expiresAt) ||
    expiresAt * 1000 <= Date.now()
  ) {
    throw new Error("Google identity token failed claim validation.");
  }

  return {
    id: info.sub,
    email: info.email,
    name: info.name?.trim() || info.email.split("@")[0],
    picture: info.picture,
    provider: "google",
  };
}
