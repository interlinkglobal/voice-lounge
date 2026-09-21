export const SUPABASE_URL = "https://wfklrawlglcpkxcrqtzo.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_U9UEgg5TPy0dePCcnJ8ZlA_57U_w2Jw";
export const SUPABASE_AUTH_URL = `${SUPABASE_URL}/auth/v1`;

export type MembershipPlan = "free" | "paid" | "guest";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string | undefined;
  provider: "google" | "email";
  plan: MembershipPlan;
  nextBillingAt?: string | undefined;
  cardMessage?: string | undefined;
}

export interface SupabaseUserPayload {
  id?: string | undefined;
  email?: string | undefined;
  app_metadata?: {
    provider?: string | undefined;
    providers?: string[] | undefined;
    plan?: string | undefined;
    membership_plan?: string | undefined;
    next_billing_at?: string | undefined;
    card_message?: string | undefined;
  };
  user_metadata?: {
    name?: string | undefined;
    full_name?: string | undefined;
    avatar_url?: string | undefined;
    picture?: string | undefined;
  };
}

export interface SupabaseSessionPayload {
  access_token?: string | undefined;
  refresh_token?: string | undefined;
  expires_in?: number | undefined;
  token_type?: string | undefined;
  user?: SupabaseUserPayload | undefined;
  error?: string | undefined;
  error_description?: string | undefined;
  msg?: string | undefined;
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

function normalizeMembershipPlan(value: string | undefined): MembershipPlan {
  const normalized = value?.trim().toLowerCase().replace(/[\s_-]+/g, "") ?? "";
  if (["paid", "premium", "pro", "subscriber"].includes(normalized)) return "paid";
  if (["guest", "specialguest", "vipguest"].includes(normalized)) return "guest";
  return "free";
}

export function mapSupabaseUser(user: SupabaseUserPayload | null | undefined): AuthUser | null {
  if (!user?.id || !user.email) return null;

  const metadata = user.user_metadata ?? {};
  const picture = metadata.avatar_url || metadata.picture || undefined;
  const name = metadata.full_name?.trim() || metadata.name?.trim() || user.email.split("@")[0] || "Voice Lounge member";
  const appMetadata = user.app_metadata ?? {};
  const provider = appMetadata.provider === "email" ? "email" : "google";
  const plan = normalizeMembershipPlan(appMetadata.membership_plan ?? appMetadata.plan);
  const nextBillingAt = appMetadata.next_billing_at?.trim() || undefined;
  const cardMessage = appMetadata.card_message?.trim() || undefined;

  return {
    id: user.id,
    email: user.email,
    name,
    ...(picture ? { picture } : {}),
    provider,
    plan,
    ...(nextBillingAt ? { nextBillingAt } : {}),
    ...(cardMessage ? { cardMessage } : {}),
  };
}
