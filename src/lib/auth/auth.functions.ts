import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, setResponseHeaders } from "@tanstack/react-start/server";
import { mapSupabaseUser, type AuthUser } from "./supabase";
import {
  AUTH_COOKIES,
  clearCookie,
  fetchSupabaseUser,
  parseCookieHeader,
  refreshSupabaseSession,
  sessionCookies,
} from "./supabase.server";

function setAuthResponseCookies(values: string[]) {
  const headers = new Headers({
    "Cache-Control": "private, no-store",
    Vary: "Cookie, Authorization",
  });
  values.forEach((value) => headers.append("Set-Cookie", value));
  setResponseHeaders(headers);
}

export const getCurrentUser = createServerFn({ method: "GET" }).handler(async (): Promise<AuthUser | null> => {
  const cookies = parseCookieHeader(getRequestHeader("cookie"));
  const accessToken = cookies.get(AUTH_COOKIES.access);
  const refreshToken = cookies.get(AUTH_COOKIES.refresh);

  if (accessToken) {
    const user = await fetchSupabaseUser(accessToken);
    const mapped = mapSupabaseUser(user);
    if (mapped) return mapped;
  }

  if (!refreshToken) return null;

  try {
    const session = await refreshSupabaseSession(refreshToken);
    setAuthResponseCookies(sessionCookies(session));
    return mapSupabaseUser(session.user) ?? mapSupabaseUser(await fetchSupabaseUser(session.access_token!));
  } catch (error) {
    console.warn("[supabase-auth] session refresh failed", error);
    setAuthResponseCookies([
      clearCookie(AUTH_COOKIES.access),
      clearCookie(AUTH_COOKIES.refresh),
    ]);
    return null;
  }
});
