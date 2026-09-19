import type { AuthUser, MembershipPlan } from "@/lib/auth/supabase";

export type MembershipCardTheme = "free" | "paid" | "guest";

export interface MembershipCardViewModel {
  theme: MembershipCardTheme;
  name: string;
  plan: string;
  role: string;
  country: string;
  access: string;
  tagline: string;
  memberIdLabel: string;
  memberId: string;
  dateLabel: string;
  dateValue: string;
  statusLabel: string;
  statusValue: string;
}

const CARD_DATE = new Intl.DateTimeFormat("en-ZA", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "Africa/Johannesburg",
});

function formatDate(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return CARD_DATE.format(date).toUpperCase();
}

function authenticatedModel(
  user: AuthUser,
  plan: MembershipPlan,
  today: string,
): MembershipCardViewModel {
  if (plan === "paid") {
    const nextBilling = user.nextBillingAt ? formatDate(user.nextBillingAt) : null;
    return {
      theme: "paid",
      name: user.name,
      plan: "PREMIUM MEMBER",
      role: user.cardMessage || "PREMIUM MEMBER",
      country: "SOUTH AFRICA",
      access: "FULL ACCESS",
      tagline: "MEMBER OF THE VOICE LOUNGE",
      memberIdLabel: "MEMBER ID",
      memberId: user.email,
      dateLabel: "TODAY",
      dateValue: today,
      statusLabel: nextBilling ? "NEXT BILLING" : "PLAN STATUS",
      statusValue: nextBilling || "PREMIUM • ACTIVE",
    };
  }

  if (plan === "guest") {
    return {
      theme: "guest",
      name: user.name,
      plan: "SPECIAL GUEST",
      role: user.cardMessage || "SPECIAL GUEST",
      country: "SOUTH AFRICA",
      access: "GUEST ACCESS",
      tagline: "GUEST OF THE VOICE LOUNGE",
      memberIdLabel: "MEMBER ID",
      memberId: user.email,
      dateLabel: "TODAY",
      dateValue: today,
      statusLabel: "GUEST STATUS",
      statusValue: "INVITE • ACTIVE",
    };
  }

  return {
    theme: "free",
    name: user.name,
    plan: "FREE MEMBER",
    role: user.cardMessage || "FREE MEMBER",
    country: "SOUTH AFRICA",
    access: "FREE PLAN",
    tagline: "MEMBER OF THE VOICE LOUNGE",
    memberIdLabel: "MEMBER ID",
    memberId: user.email,
    dateLabel: "TODAY",
    dateValue: today,
    statusLabel: "PLAN STATUS",
    statusValue: "FREE • ACTIVE",
  };
}

export function createMembershipCardViewModel(
  user: AuthUser | null,
  visitorNumber: string,
  now = new Date(),
): MembershipCardViewModel {
  const today = formatDate(now) || "TODAY";

  if (!user) {
    return {
      theme: "free",
      name: "WELCOME",
      plan: "FREE VIEWER",
      role: "WELCOME VIEWER",
      country: "SOUTH AFRICA",
      access: "OPEN ACCESS",
      tagline: "VIEWER OF THE VOICE LOUNGE",
      memberIdLabel: "VIEW NUMBER",
      memberId: `VIEW-${visitorNumber}`,
      dateLabel: "TODAY",
      dateValue: today,
      statusLabel: "BROWSE MODE",
      statusValue: "FREE • SIGN IN TO SAVE",
    };
  }

  return authenticatedModel(user, user.plan, today);
}
