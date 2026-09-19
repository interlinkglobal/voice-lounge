import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { useAuth } from "@/components/auth/AuthProvider";

const AUTH_MESSAGES: Record<string, string> = {
  "invalid-input": "Enter a valid email address and a password with at least 8 characters.",
  "invalid-credentials": "That email and password combination was not accepted.",
  "signup-failed": "We could not create that account. Check the details and try again.",
  "check-email": "Check your email to confirm your account, then return here to sign in.",
  "cancelled": "Google sign-in was cancelled.",
  "invalid": "The sign-in request could not be verified. Please try again.",
  "error": "Sign-in could not be completed. Please try again.",
};

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    auth: typeof search.auth === "string" ? search.auth.slice(0, 40) : undefined,
    returnTo:
      typeof search.returnTo === "string" && search.returnTo.startsWith("/")
        ? search.returnTo.slice(0, 180)
        : "/account",
  }),
  head: () => ({
    meta: [
      { title: "Sign In to Voice Lounge Demo | The Voice Lounge" },
      {
        name: "description",
        content:
          "Sign in to The Voice Lounge with email or Google to keep your membership, profile and saved experiences connected.",
      },
      { property: "og:title", content: "Sign In to Voice Lounge Demo | The Voice Lounge" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LoginPage,
});

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
              <Link
                to="/account"
                className="press rounded-full bg-[var(--green-action)] px-6 py-3 font-semibold text-white"
              >
                Open account
              </Link>
              <Link
                to="/"
                className="press rounded-full border border-hairline bg-surface-2 px-6 py-3 font-semibold"
              >
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
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-12%] top-[-15%] size-[32rem] rounded-full bg-[color-mix(in_oklab,var(--green)_13%,transparent)] blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-8%] size-[30rem] rounded-full bg-[color-mix(in_oklab,var(--gold)_11%,transparent)] blur-[110px]" />
      </div>

      <div className="shell grid min-h-[calc(100vh-8rem)] items-center gap-8 py-[clamp(2.5rem,7vw,6rem)] lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.78fr)] lg:gap-[clamp(3rem,7vw,7rem)]">
        <div className="max-w-3xl">
          <Link to="/" aria-label="The Voice Lounge home" className="inline-flex">
            <Logo />
          </Link>

          <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--green)_32%,transparent)] bg-[color-mix(in_oklab,var(--green)_8%,transparent)] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--green)]">
            <ShieldCheck className="size-4" aria-hidden="true" />
            Secure member access
          </div>

          <h1 className="mt-5 max-w-3xl font-display text-[clamp(3rem,8vw,6.5rem)] font-black leading-[0.88] tracking-[-0.065em]">
            Sign In to <span className="text-gold-foil">Voice Lounge Demo.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-[clamp(1rem,1.45vw,1.28rem)] leading-relaxed text-muted-foreground">
            Keep your membership card, saved content and account experience connected across devices.
          </p>

          <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            {[
              ["Your membership", "Keep your plan and member card attached to your account."],
              ["Your library", "Return to saved shows, videos and account preferences."],
              ["Your identity", "Google sign-in keeps your verified name and profile image in sync."],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-2xl border border-hairline bg-card/45 p-4">
                <p className="font-display font-bold">{title}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{copy}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="hyper-glass relative overflow-hidden rounded-[2rem] border border-hairline p-[clamp(1.25rem,4vw,2rem)] shadow-[0_30px_80px_-52px_rgba(0,0,0,.9)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--gold),var(--green),transparent)] opacity-80" />

          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--gold)]">Member sign in</p>
            <h2 className="mt-2 font-display text-[clamp(1.8rem,4vw,2.6rem)] font-black tracking-[-0.045em]">
              Sign In to Voice Lounge Demo
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Continue with Google or use your email and password.
            </p>
          </div>

          {message && (
            <div
              role="status"
              className="mt-5 rounded-2xl border border-[color-mix(in_oklab,var(--gold)_30%,transparent)] bg-[color-mix(in_oklab,var(--gold)_7%,transparent)] px-4 py-3 text-sm leading-6"
            >
              {message}
            </div>
          )}

          <a
            href={googleHref}
            className="press flex min-h-12 items-center justify-center gap-3 rounded-full border border-hairline bg-white px-5 font-semibold text-black hover:bg-white/95"
          >
            <span
              aria-hidden="true"
              className="grid size-6 place-items-center rounded-full border border-black/10 font-display text-sm font-black"
            >
              G
            </span>
            Sign in with Google
          </a>

          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Sign in with Google to save playlists, keep your membership card and profile synced across devices, and return to your saved shows and videos.
          </p>

          <div className="my-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
            <span className="h-px flex-1 bg-hairline" />
            or use email
            <span className="h-px flex-1 bg-hairline" />
          </div>

          <form action="/auth/email" method="post" className="mt-6 grid gap-4">
            <input type="hidden" name="returnTo" value={returnTo} />

            <label className="grid gap-2">
              <span className="text-sm font-semibold">Email address</span>
              <span className="flex min-h-12 items-center gap-3 rounded-2xl border border-hairline bg-background/55 px-4 focus-within:border-[var(--green)]">
                <Mail className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <input
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  className="min-w-0 flex-1 bg-transparent py-3 outline-none placeholder:text-muted-foreground"
                />
              </span>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold">Password</span>
              <span className="flex min-h-12 items-center gap-3 rounded-2xl border border-hairline bg-background/55 px-4 focus-within:border-[var(--green)]">
                <LockKeyhole className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  minLength={8}
                  required
                  placeholder="At least 8 characters"
                  className="min-w-0 flex-1 bg-transparent py-3 outline-none placeholder:text-muted-foreground"
                />
              </span>
            </label>

            <button
              type="submit"
              name="intent"
              value="signin"
              className="press min-h-12 rounded-full bg-[var(--green-action)] px-5 font-bold text-white shadow-glow"
            >
              Sign in with email
            </button>

            <button
              type="submit"
              name="intent"
              value="signup"
              className="press min-h-11 rounded-full border border-hairline bg-surface-2 px-5 text-sm font-semibold"
            >
              Create a free account
            </button>
          </form>

          <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link to="/terms-of-service" className="font-semibold text-foreground underline-offset-4 hover:underline">
              Terms of Service
            </Link>{" "}
            and acknowledge our{" "}
            <Link to="/privacy-policy" className="font-semibold text-foreground underline-offset-4 hover:underline">
              Privacy Policy
            </Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
