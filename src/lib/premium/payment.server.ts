import { mapSupabaseUser, type AuthUser } from "@/lib/auth/supabase";
import {
  AUTH_COOKIES,
  clearCookie,
  fetchSupabaseUser,
  parseCookieHeader,
  serializeCookie,
} from "@/lib/auth/supabase.server";
import {
  INTERLINK_VERIFY_URL,
  VOICE_LOUNGE_PREMIUM_AMOUNT_MINOR,
  VOICE_LOUNGE_PREMIUM_ITEM,
  VOICE_LOUNGE_PREMIUM_PRODUCT,
} from "./payment";

export const PREMIUM_REFERENCE_COOKIE = "__Host-tvl-premium-ref";
export const PREMIUM_DEV_COOKIE = "__Host-tvl-premium-dev";

type InterlinkVerification = {
  status?: string | undefined;
  reference?: string | undefined;
  amountMinor?: number | null | undefined;
  currency?: string | undefined;
  email?: string | null | undefined;
  product?: string | null | undefined;
  productName?: string | null | undefined;
  customerReference?: string | null | undefined;
};

export type PremiumVerification =
  | { ok: true; reference: string }
  | { ok: false; reason: "invalid" | "unavailable" };

export async function getRequestAuthUser(request: Request): Promise<AuthUser | null> {
  const cookies = parseCookieHeader(request.headers.get("cookie"));
  const accessToken = cookies.get(AUTH_COOKIES.access);
  if (!accessToken) return null;
  return mapSupabaseUser(await fetchSupabaseUser(accessToken));
}

export function premiumReferenceCookie(reference: string) {
  return serializeCookie(PREMIUM_REFERENCE_COOKIE, reference, 31 * 24 * 60 * 60);
}

export function clearPremiumReferenceCookie() {
  return clearCookie(PREMIUM_REFERENCE_COOKIE);
}

export function premiumDevCookie() {
  return serializeCookie(PREMIUM_DEV_COOKIE, "1", 2 * 60 * 60);
}

export function clearPremiumDevCookie() {
  return clearCookie(PREMIUM_DEV_COOKIE);
}

export function developmentBypassEnabled() {
  return (
    process.env["VERCEL_ENV"] === "preview" ||
    process.env["VERCEL_ENV"] === "development" ||
    process.env["NODE_ENV"] === "development"
  );
}

export async function verifyVoiceLoungePremium(
  reference: string,
  user: AuthUser,
): Promise<PremiumVerification> {
  let response: Response;
  try {
    response = await fetch(
      `${INTERLINK_VERIFY_URL}?reference=${encodeURIComponent(reference)}`,
      {
        headers: { Accept: "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(8_000),
      },
    );
  } catch {
    return { ok: false, reason: "unavailable" };
  }

  const payment = (await response.json().catch(() => null)) as InterlinkVerification | null;
  if (!response.ok || !payment) {
    return { ok: false, reason: "unavailable" };
  }

  const valid =
    payment.status === "success" &&
    payment.amountMinor === VOICE_LOUNGE_PREMIUM_AMOUNT_MINOR &&
    payment.currency === "ZAR" &&
    payment.product === VOICE_LOUNGE_PREMIUM_PRODUCT &&
    payment.productName === VOICE_LOUNGE_PREMIUM_ITEM &&
    payment.customerReference === user.id &&
    (!payment.email || payment.email.toLowerCase() === user.email.toLowerCase());

  if (!valid) return { ok: false, reason: "invalid" };

  return {
    ok: true,
    reference: payment.reference || reference,
  };
}
