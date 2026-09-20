import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { VERIFIED_APPS, VERIFIED_SOCIALS, VOICE_LOUNGE } from "@/lib/voice-lounge/organization";

const COLUMNS: Array<{ heading: string; links: Array<{ label: string; to: string }> }> = [
  {
    heading: "Explore",
    links: [
      { label: "Discover", to: "/discover" },
      { label: "Shows", to: "/shows" },
      { label: "Episodes", to: "/episodes" },
      { label: "YouTube", to: "/youtube" },
      { label: "Live", to: "/live" },
    ],
  },
  {
    heading: "Voice Lounge",
    links: [
      { label: "Presenters", to: "/creators" },
      { label: "News & Press", to: "/news" },
      { label: "Premium", to: "/premium" },
      { label: "About", to: "/about" },
      { label: "Install web app", to: "/install" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Sign in", to: "/login" },
      { label: "Account", to: "/account" },
      { label: "Search", to: "/search" },
      { label: "Community", to: "/community" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy (POPIA)", to: "/privacy-policy" },
      { label: "Terms of service", to: "/terms-of-service" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-[var(--section-gap)] border-t border-hairline bg-[color-mix(in_oklab,var(--surface-2)_70%,var(--background))]">
      <div className="shell grid gap-10 py-[clamp(2rem,4vw,4rem)] lg:grid-cols-[minmax(0,1.25fr)_minmax(0,2fr)]">
        <div>
          <Logo />
          <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">
            {VOICE_LOUNGE.description}
          </p>
          <p className="mt-4 text-sm font-semibold text-foreground">{VOICE_LOUNGE.tagline}</p>
          <div className="mt-5 grid gap-1 text-sm text-muted-foreground">
            <a href={`mailto:${VOICE_LOUNGE.contact.email}`} className="hover:text-foreground">{VOICE_LOUNGE.contact.email}</a>
            <a href="tel:+27430506570" className="hover:text-foreground">{VOICE_LOUNGE.contact.phone}</a>
            <a href="tel:+27839507019" className="hover:text-foreground">{VOICE_LOUNGE.contact.mobile}</a>
          </div>
          <ul className="mt-5 flex flex-wrap gap-2">
            {VERIFIED_SOCIALS.map((social) => (
              <li key={social.platform}>
                <a href={social.url} target="_blank" rel="noreferrer" className="press inline-flex rounded-full border border-hairline px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
                  {social.platform}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            {VERIFIED_APPS.map((app) => (
              <a key={app.platform} href={app.url} target="_blank" rel="noreferrer" className="press rounded-full border border-hairline px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
                {app.label}
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">{col.heading}</h2>
              <ul className="mt-3 grid gap-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-muted-foreground hover:text-foreground">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="shell flex flex-col gap-2 border-t border-hairline py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 The Voice Lounge. Public information aligned to the 20 September 2026 research baseline.</p>
        <p>East London · Eastern Cape · South Africa</p>
      </div>
      <div aria-hidden="true" className="h-24 md:h-20" />
    </footer>
  );
}
