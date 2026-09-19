import { createHash, randomBytes } from "node:crypto";
import {
  SUPABASE_AUTH_URL,
  SUPABASE_PUBLISHABLE_KEY,
  type SupabaseSessionPayload,
  type SupabaseUserPayload,
} from "./supabase";

export const AUTH_COOKIES = {
  access: "__Host-tvl-sb-access",
  refresh: "__Host-tvl-sb-refresh",
  verifier: "__Host-tvl-pkce",
  returnTo: "__Host-tvl-return",
} as const;

function base64Url(input: Uint8Array) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function createPkce() {
  const verifier = base64Url(randomBytes(48));
  const challenge = base64Url(createHash("sha256").update(verifier).digest());
  return { verifier, challenge };
}

export function parseCookieHeader(header: string | null | undefined) {
  const out = new Map<string, string>();
  if (!header) return out;

  for (const part of header.split(/;\s*/)) {
    const eq = part.indexOf("=");
    if (eq < 1) continue;
    const name = part.slice(0, eq);
    const raw = part.slice(eq + 1);
    try {
      out.set(name, decodeURIComponent(raw));
    } catch {
      out.set(name, raw);
    }
  }

  return out;
}

export function serializeCookie(name: string, value: string, maxAge: number) {
  return [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    `Max-Age=${Math.max(0, Math.floor(maxAge))}`,
  ].join("; ");
}

export function clearCookie(name: string) {
  return serializeCookie(name, "", 0);
}

export function sessionCookies(session: SupabaseSessionPayload) {
  if (!session.access_token || !session.refresh_token) return [];

  const accessMaxAge = Math.max(60, (session.expires_in ?? 3600) - 30);
  return [
    serializeCookie(AUTH_COOKIES.access, session.access_token, accessMaxAge),
    serializeCookie(AUTH_COOKIES.refresh, session.refresh_token, 30 * 24 * 60 * 60),
  ];
}

function authHeaders(accessToken?: string) {
  return {
    apikey: SUPABASE_PUBLISHABLE_KEY,
    Accept: "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
}

export async function exchangeSupabaseCode(code: string, verifier: string): Promise<SupabaseSessionPayload> {
  const response = await fetch(`${SUPABASE_AUTH_URL}/token?grant_type=pkce`, {
    method: "POST",
    headers: {
      ...authHeaders(),
      "content-type": "application/json",
    },
    body: JSON.stringify({
      auth_code: code,
      code_verifier: verifier,
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as SupabaseSessionPayload;
  if (!response.ok || !payload.access_token || !payload.refresh_token) {
    throw new Error(
      payload.error_description ||
        payload.msg ||
        payload.error ||
        `Supabase PKCE exchange failed with HTTP ${response.status}`,
    );
  }

  return payload;
}

export async function signInWithEmailPassword(email: string, password: string): Promise<SupabaseSessionPayload> {
  const response = await fetch(`${SUPABASE_AUTH_URL}/token?grant_type=password`, {
    method: "POST",
    headers: {
      ...authHeaders(),
      "content-type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const payload = (await response.json().catch(() => ({}))) as SupabaseSessionPayload;
  if (!response.ok || !payload.access_token || !payload.refresh_token) {
    throw new Error(payload.error_description || payload.msg || payload.error || "Email sign-in failed.");
  }

  return payload;
}

export async function signUpWithEmailPassword(email: string, password: string): Promise<SupabaseSessionPayload> {
  const response = await fetch(`${SUPABASE_AUTH_URL}/signup`, {
    method: "POST",
    headers: {
      ...authHeaders(),
      "content-type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      data: {
        membership_plan: "free",
      },
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as SupabaseSessionPayload;
  if (!response.ok) {
    throw new Error(payload.error_description || payload.msg || payload.error || "Email sign-up failed.");
  }

  return payload;
}

export async function refreshSupabaseSession(refreshToken: string): Promise<SupabaseSessionPayload> {
  const response = await fetch(`${SUPABASE_AUTH_URL}/token?grant_type=refresh_token`, {
    method: "POST",
    headers: {
      ...authHeaders(),
      "content-type": "application/json",
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  const payload = (await response.json().catch(() => ({}))) as SupabaseSessionPayload;
  if (!response.ok || !payload.access_token || !payload.refresh_token) {
    throw new Error(payload.error_description || payload.msg || payload.error || "Supabase session refresh failed.");
  }

  return payload;
}

export async function fetchSupabaseUser(accessToken: string): Promise<SupabaseUserPayload | null> {
  const response = await fetch(`${SUPABASE_AUTH_URL}/user`, {
    method: "GET",
    headers: authHeaders(accessToken),
  });

  if (!response.ok) return null;
  return (await response.json()) as SupabaseUserPayload;
}

export async function revokeSupabaseSession(accessToken: string) {
  await fetch(`${SUPABASE_AUTH_URL}/logout?scope=local`, {
    method: "POST",
    headers: authHeaders(accessToken),
  }).catch(() => undefined);
}
