export const SUPABASE_URL = "https://wfklrawlglcpkxcrqtzo.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_U9UEgg5TPy0dePCcnJ8ZlA_57U_w2Jw";
export const SUPABASE_AUTH_URL = `${SUPABASE_URL}/auth/v1`;

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: "google";
}

export interface SupabaseUserPayload {
  id?: string;
  email?: string;
  app_metadata?: {
    provider?: string;
    providers?: string[];
  };
  user_metadata?: {
    name?: string;
    full_name?: string;
    avatar_url?: string;
    picture?: string;
  };
}

export interface SupabaseSessionPayload {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  user?: SupabaseUserPayload;
  error?: string;
  error_description?: string;
  msg?: string;
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

export function mapSupabaseUser(user: SupabaseUserPayload | null | undefined): AuthUser | null {
  if (!user?.id || !user.email) return null;

  const metadata = user.user_metadata ?? {};
  const picture = metadata.avatar_url || metadata.picture || undefined;
  const name = metadata.full_name?.trim() || metadata.name?.trim() || user.email.split("@")[0] || "Voice Lounge member";

  return {
    id: user.id,
    email: user.email,
    name,
    ...(picture ? { picture } : {}),
    provider: "google",
  };
}
