import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { EditableMembershipCard } from "@/components/premium/EditableMembershipCard";
import type { MembershipCardViewModel } from "@/lib/membership/card";

const AUTH_MESSAGES: Record<string, string> = {
  "invalid-input": "Enter a valid email address and a password with at least 8 characters.",
  "invalid-credentials": "That email and password combination was not accepted.",
  "signup-failed": "We could not create that account. Check the details and try again.",
  "check-email": "Check your email to confirm your account, then return here to sign in.",
  "cancelled": "Google sign-in was cancelled.",
  "invalid": "The sign-in request could not be verified. Please try again.",
  "error": "Sign-in could not be completed. Please try again.",
};

const LOGIN_TIERS: Array<{
  id: "premium" | "guest";
  model: MembershipCardViewModel;
}> = [
  {
    id: "premium",
    model: {
      theme: "paid",
      name: "Premium Tier",
      plan: "Premium Member",
      role: "Upgrade for Premium Access",
      country: "",
      access: "Viewer Access",
      tagline: "Unlock Premium",
      memberIdLabel: "",
      memberId: "",
      dateLabel: "",
      dateValue: "",
      statusLabel: "",
      statusValue: "",
    },
  },
  {
    id: "guest",
    model: {
      theme: "guest",
      name: "Guest Tier",
      plan: "Guest Access",
      role: "Discover guest access and community features",
      country: "",
      access: "All are welcome",
      tagline: "Contact Voice Lounge",
      memberIdLabel: "",
      memberId: "",
      dateLabel: "",
      dateValue: "",
      statusLabel: "",
      statusValue: "",
    },
  },
];

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    auth: typeof search["auth"] === "string" ? search["auth"].slice(0, 40) : undefined,
    returnTo:
      typeof search["returnTo"] === "string" && search["returnTo"].startsWith("/")
        ? search["returnTo"].slice(0, 180)
        : "/account",
  }),
  head: () => ({
    meta: [
      { title: "Sign In | The Voice Lounge" },
      {
        name: "description",
        content: "Sign in to The Voice Lounge with Google or email and password.",
      },
      { property: "og:title", content: "Sign In | The Voice Lounge" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LoginPage,
});

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 shrink-0" aria-hidden="true">
      <path fill="#4285F4" d="M21.6 12.227c0-.71-.064-1.395-.182-2.046H12v3.873h5.382a4.6 4.6 0 0 1-1.995 3.017v2.513h3.23c1.89-1.74 2.983-4.307 2.983-7.357Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.964-.895 6.618-2.416l-3.231-2.513c-.895.6-2.04.956-3.387.956-2.605 0-4.812-1.76-5.602-4.126H3.06v2.59A9.999 9.999 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.398 13.9A6.01 6.01 0 0 1 6.084 12c0-.66.113-1.301.314-1.9V7.51H3.06A10 10 0 0 0 2 12c0 1.61.385 3.136 1.06 4.49l3.338-2.59Z" />
      <path fill="#EA4335" d="M12 5.973c1.468 0 2.786.505 3.823 1.495l2.868-2.868C16.959 2.987 14.695 2 12 2a9.999 9.999 0 0 0-8.94 5.51l3.338 2.59C7.188 7.733 9.395 5.973 12 5.973Z" />
    </svg>
  );
}

function LoginCardShowcase() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % LOGIN_TIERS.length),
      2800,
    );
    return () => window.clearInterval(timer);
  }, []);

  const tier = LOGIN_TIERS[active] ?? LOGIN_TIERS[0];

  return (
    <div className="relative min-h-[16rem] sm:min-h-[21rem] lg:min-h-[28rem]" style={{ perspective: "1200px" }}>
      <div className="absolute inset-[12%_4%_4%] rounded-[3rem] bg-[radial-gradient(circle_at_50%_45%,color-mix(in_oklab,var(--green)_18%,transparent),color-mix(in_oklab,var(--gold)_10%,transparent)_48%,transparent_70%)] blur-3xl" />
      <div className="absolute inset-0 grid place-items-center">
        <EditableMembershipCard
          key={tier.id}
          model={tier.model}
          className="vl-login-card-flip block w-[96%] max-w-[48rem] select-none drop-shadow-[0_30px_45px_rgba(0,0,0,.45)]"
        />
      </div>
    </div>
  );
}

function LoginPage() {
  const user = useAuth();
  const { auth, returnTo } = Route.useSearch();
  const message = auth ? AUTH_MESSAGES[auth] : undefined;
  const googleHref = `/auth/google?returnTo=${encodeURIComponent(returnTo)}`;

  if (user) {
    return (
      <section className="grain hero-wash relative isolate min-h-[calc(100vh-10rem)] overflow-hidden border-b border-hairline">
        <div className="shell grid min-h-[calc(100vh-10rem)] place-items-center py-[clamp(3rem,8vw,7rem)]">
          <div className="hyper-glass w-full max-w-xl rounded-[2rem] border border-hairline p-[clamp(1.5rem,4vw,2.5rem)] text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-full border border-[color-mix(in_oklab,var(--green)_40%,transparent)] bg-[color-mix(in_oklab,var(--green)_10%,transparent)]">
              <CheckCircle2 className="size-6 text-[var(--green)]" aria-hidden="true" />
            </div>
            <h1 className="mt-5 font-display text-[clamp(2rem,6vw,3.75rem)] font-black tracking-[-0.05em]">
              You're signed in
            </h1>
            <p className="mt-3 text-muted-foreground">
              Signed in as <strong className="text-foreground">{user.email}</strong>.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-2">
              <Link to="/account" className="press rounded-full bg-[var(--green-action)] px-6 py-3 font-semibold text-white">
                Open account
              </Link>
              <Link to="/" className="press rounded-full border border-hairline bg-surface-2 px-6 py-3 font-semibold">
                Go home
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="grain hero-wash relative isolate overflow-hidden border-b border-hairline">
      <style>{`
        @keyframes vl-login-card-flip {
          0% { opacity: 0; transform: perspective(900px) rotateY(-88deg) scale(.94); }
          20% { opacity: 1; transform: perspective(900px) rotateY(0deg) scale(1); }
          78% { opacity: 1; transform: perspective(900px) rotateY(0deg) scale(1); }
          100% { opacity: 0; transform: perspective(900px) rotateY(88deg) scale(.94); }
        }
        .vl-login-card-flip {
          animation: vl-login-card-flip 2.8s ease-in-out both;
          backface-visibility: hidden;
          transform-style: preserve-3d;
        }
        @media (prefers-reduced-motion: reduce) {
          .vl-login-card-flip { animation: none; }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-12%] top-[-15%] size-[32rem] rounded-full bg-[color-mix(in_oklab,var(--green)_13%,transparent)] blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-8%] size-[30rem] rounded-full bg-[color-mix(in_oklab,var(--gold)_11%,transparent)] blur-[110px]" />
      </div>

      <div className="shell grid min-h-[calc(100vh-8rem)] items-center gap-8 py-[clamp(2.5rem,7vw,6rem)] lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,.65fr)] lg:gap-[clamp(3rem,7vw,7rem)]">
        <div className="min-w-0">
          <LoginCardShowcase />
        </div>

        <div className="min-w-0">
          <h1
            className="mb-5 text-[clamp(2rem,4.1vw,4.4rem)] font-bold leading-[0.98] tracking-[-0.045em] text-white"
            style={{ fontFamily: '"Josefin Sans", "Inter Tight", system-ui, sans-serif' }}
          >
            Sign in to <span className="text-[var(--green)]">The Voice Lounge</span>
          </h1>

          <div className="hyper-glass relative overflow-hidden rounded-[2rem] border border-hairline p-[clamp(1.25rem,4vw,2rem)] shadow-[0_30px_80px_-52px_rgba(0,0,0,.9)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--gold),var(--green),transparent)] opacity-80" />

          {message && (
            <div
              role="status"
              className="mb-5 rounded-2xl border border-[color-mix(in_oklab,var(--gold)_30%,transparent)] bg-[color-mix(in_oklab,var(--gold)_7%,transparent)] px-4 py-3 text-sm leading-6"
            >
              {message}
            </div>
          )}

          <a
            href={googleHref}
            className="press flex min-h-12 items-center justify-center gap-3 rounded-full border border-black/10 bg-white px-5 font-semibold text-black shadow-sm hover:bg-white/95"
          >
            <GoogleIcon />
            Sign in with Google
          </a>

          <form action="/auth/email" method="post" className="mt-4 grid gap-3">
            <input type="hidden" name="returnTo" value={returnTo} />
            <input
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              placeholder="Email"
              aria-label="Email"
              className="min-h-12 w-full rounded-full border border-hairline bg-background/65 px-5 outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--green)]"
            />
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              minLength={8}
              required
              placeholder="Password"
              aria-label="Password"
              className="min-h-12 w-full rounded-full border border-hairline bg-background/65 px-5 outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--green)]"
            />
            <div className="grid grid-cols-2 gap-3">
              <button
                type="submit"
                name="intent"
                value="signin"
                className="press min-h-12 rounded-full bg-[var(--green-action)] px-5 font-bold text-white"
              >
                Login
              </button>
              <button
                type="submit"
                name="intent"
                value="signup"
                className="press min-h-12 rounded-full border border-hairline bg-surface-2 px-5 font-semibold"
              >
                Sign up
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </section>
  );
}
