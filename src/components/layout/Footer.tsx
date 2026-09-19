import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "./Logo";
import { track } from "@/lib/analytics";

const COLUMNS: Array<{ heading: string; links: Array<{ label: string; to: string }> }> = [
  {
    heading: "Explore",
    links: [
      { label: "Discover", to: "/discover" },
      { label: "Podcasts", to: "/podcasts" },
      { label: "Shows", to: "/shows" },
      { label: "Episodes", to: "/episodes" },
      { label: "Watch", to: "/watch" },
      { label: "Live", to: "/live" },
    ],
  },
  {
    heading: "Community",
    links: [
      { label: "Creators", to: "/creators" },
      { label: "Categories", to: "/categories" },
      { label: "Community", to: "/community" },
      { label: "News", to: "/news" },
      { label: "Search", to: "/search" },
      { label: "Premium", to: "/premium" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Careers", to: "/about" },
      { label: "Advertising", to: "/about" },
      { label: "Partnerships", to: "/about" },
      { label: "Press", to: "/news" },
      { label: "Contact", to: "/about" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy (POPIA)", to: "/privacy-policy" },
      { label: "Terms of service", to: "/terms-of-service" },
      { label: "Cookie settings", to: "/account" },
      { label: "Accessibility", to: "/about" },
      { label: "Data controls", to: "/account" },
      { label: "Report a problem", to: "/about" },
    ],
  },
];

export function NewsletterForm({ tone = "default" }: { tone?: "default" | "gold" }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
        setState(ok ? "done" : "error");
        if (ok) track("newsletter_signup", {});
      }}
      className="w-full max-w-md"
    >
      <label htmlFor={`nl-${tone}`} className="text-sm font-medium">
        Follow The Voice — a weekly letter from the newsroom
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          id={`nl-${tone}`}
          type="email"
          inputMode="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setState("idle");
          }}
          aria-invalid={state === "error"}
          aria-describedby={`nl-msg-${tone}`}
          placeholder="you@example.co.za"
          className="min-h-11 flex-1 rounded-full border border-hairline bg-surface-2 px-4 text-sm outline-none focus-visible:border-[var(--green)]"
        />
        <button
          type="submit"
          className={
            tone === "gold"
              ? "press min-h-11 rounded-full bg-[var(--gold)] px-5 text-sm font-semibold text-[oklch(0.16_0.02_90)]"
              : "press min-h-11 rounded-full bg-[var(--green-action)] px-5 text-sm font-semibold text-white"
          }
        >
          Subscribe
        </button>
      </div>
      <p
        id={`nl-msg-${tone}`}
        role="status"
        className={
          state === "error"
            ? "mt-2 text-sm text-destructive"
            : state === "done"
              ? "mt-2 text-sm text-[var(--green)]"
              : "mt-2 text-xs text-muted-foreground"
        }
      >
        {state === "error"
          ? "Enter a valid email address."
          : state === "done"
            ? "You're on the list. Look out for Thursday's letter."
            : "One email a week. Unsubscribe any time."}
      </p>
    </form>
  );
}

export function Footer() {
  return (
    <footer className="mt-[var(--section-gap)] border-t border-hairline bg-[color-mix(in_oklab,var(--surface-2)_70%,var(--background))]">
      <div className="shell grid gap-10 py-[clamp(2rem,4vw,4rem)] lg:grid-cols-[minmax(0,1.3fr)_minmax(0,2.4fr)]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            The Voice Lounge is where South Africa listens, watches and follows the voices shaping the culture.
            Built in Johannesburg, made for nine provinces.
          </p>
          <div className="mt-5">
            <NewsletterForm />
          </div>
          <ul className="mt-5 flex flex-wrap gap-2">
            {["Instagram", "X", "YouTube", "TikTok", "LinkedIn"].map((s) => (
              <li key={s}>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="press inline-flex rounded-full border border-hairline px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                {col.heading}
              </h2>
              <ul className="mt-3 grid gap-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-muted-foreground hover:text-foreground">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="shell flex flex-col gap-2 border-t border-hairline py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 The Voice Lounge (Pty) Ltd. Demonstration content — shows and articles are fictional.</p>
        <p>Johannesburg · Cape Town · Durban</p>
      </div>
      {/* clearance for the persistent player */}
      <div aria-hidden="true" className="h-24 md:h-20" />
    </footer>
  );
}
