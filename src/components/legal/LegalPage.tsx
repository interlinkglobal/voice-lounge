import { Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

export interface LegalSection {
  title: string;
  body: ReactNode;
}

interface LegalPageProps {
  eyebrow: string;
  title: string;
  summary: string;
  updated: string;
  sections: LegalSection[];
  relatedLabel: string;
  relatedTo: "/privacy-policy" | "/terms-of-service";
}

export function LegalPage({
  eyebrow,
  title,
  summary,
  updated,
  sections,
  relatedLabel,
  relatedTo,
}: LegalPageProps) {
  return (
    <article className="pb-[var(--section-gap)]">
      <header className="grain hero-wash border-b border-hairline">
        <div className="shell py-[clamp(3.5rem,8vw,7rem)]">
          <Link
            to="/"
            className="press inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-2/75 px-4 py-2 text-sm font-semibold backdrop-blur hover:border-[var(--green)] hover:text-[var(--green)]"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to The Voice Lounge
          </Link>

          <div className="mt-8 max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--green)_35%,transparent)] bg-[color-mix(in_oklab,var(--green)_8%,transparent)] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--green)]">
              <ShieldCheck className="size-4" aria-hidden="true" />
              {eyebrow}
            </div>
            <h1 className="mt-5 font-display text-[var(--step-6)] font-black leading-[0.92] tracking-[-0.055em]">
              {title}
            </h1>
            <p className="mt-5 max-w-3xl text-[clamp(1rem,1.45vw,1.25rem)] leading-relaxed text-muted-foreground">
              {summary}
            </p>
            <p className="mt-5 text-sm font-medium text-muted-foreground">Last updated: {updated}</p>
          </div>
        </div>
      </header>

      <div className="shell mt-[var(--section-gap)] grid gap-8 lg:grid-cols-[minmax(0,15rem)_minmax(0,52rem)] lg:items-start lg:justify-between">
        <nav aria-label={`${title} sections`} className="hyper-glass hidden rounded-3xl border border-hairline p-4 lg:sticky lg:top-24 lg:block">
          <p className="px-2 text-[0.68rem] font-black uppercase tracking-[0.18em] text-muted-foreground">On this page</p>
          <ol className="mt-3 grid gap-1">
            {sections.map((section, index) => (
              <li key={section.title}>
                <a
                  href={`#legal-${index + 1}`}
                  className="block rounded-xl px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="min-w-0">
          <div className="grid gap-5">
            {sections.map((section, index) => (
              <section
                key={section.title}
                id={`legal-${index + 1}`}
                className="scroll-mt-28 rounded-[2rem] border border-hairline bg-card/55 p-[clamp(1.25rem,3vw,2rem)]"
              >
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold)]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-2 font-display text-[clamp(1.4rem,2.4vw,2rem)] font-extrabold">
                  {section.title}
                </h2>
                <div className="mt-4 grid gap-4 text-[0.96rem] leading-7 text-muted-foreground [&_a]:font-semibold [&_a]:text-[var(--green)] [&_a]:underline-offset-4 hover:[&_a]:underline [&_li]:pl-1 [&_strong]:text-foreground">
                  {section.body}
                </div>
              </section>
            ))}
          </div>

          <aside className="mt-8 rounded-[2rem] border border-[color-mix(in_oklab,var(--green)_30%,transparent)] bg-[color-mix(in_oklab,var(--green)_7%,var(--card))] p-6">
            <p className="font-display text-lg font-bold">Related legal information</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              These documents should be read together with the controls and notices presented inside The Voice Lounge.
            </p>
            <Link
              to={relatedTo}
              className="press mt-4 inline-flex rounded-full border border-hairline bg-surface-2 px-4 py-2 text-sm font-semibold"
            >
              {relatedLabel}
            </Link>
          </aside>
        </div>
      </div>
    </article>
  );
}
