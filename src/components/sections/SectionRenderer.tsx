import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CardSkeleton, MediaCard } from "@/components/media/MediaCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { SectionSpec } from "./types";

/* ---------- reveal-on-approach wrapper (progressive loading) ---------- */

function useNear<T extends HTMLElement>(priority?: boolean) {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(!!priority);
  useEffect(() => {
    if (near || !ref.current) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "700px 0px" },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [near]);
  return { ref, near };
}

/* ---------- rail with desktop controls ---------- */

function Rail({ spec }: { spec: SectionSpec }) {
  const scroller = useRef<HTMLDivElement>(null);
  const variant = spec.variant ?? "standard";
  const nudge = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(280, el.clientWidth * 0.8), behavior: "smooth" });
  };
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -top-12 right-0 hidden gap-1.5 md:flex">
        {[-1, 1].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => nudge(d as 1 | -1)}
            aria-label={d < 0 ? `Scroll ${spec.title} left` : `Scroll ${spec.title} right`}
            className="press pointer-events-auto grid size-9 place-items-center rounded-full border border-hairline bg-surface text-muted-foreground hover:text-foreground"
          >
            {d < 0 ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
          </button>
        ))}
      </div>
      <div ref={scroller} className="rail-scroll -mx-[var(--gutter)] px-[var(--gutter)]">
        {(spec.items ?? []).map((item, i) => (
          <MediaCard key={item.id + i} item={item} variant={variant} priority={spec.priority && i < 3} />
        ))}
      </div>
    </div>
  );
}

const COLS: Record<number, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-3 xl:grid-cols-4",
  5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5",
  6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
};

function Body({ spec }: { spec: SectionSpec }) {
  const items = spec.items ?? [];
  switch (spec.layout) {
    case "rail":
      return <Rail spec={spec} />;

    case "grid":
      return (
        <div className={cn("grid gap-[var(--rail-gap)]", COLS[spec.columns ?? 4])}>
          {items.map((item, i) => (
            <MediaCard
              key={item.id + i}
              item={item}
              variant={spec.variant ?? "standard"}
              className="w-full"
              priority={spec.priority && i < 4}
            />
          ))}
        </div>
      );

    case "mosaic":
      return (
        <div className="grid gap-[var(--rail-gap)] md:grid-cols-4 md:grid-rows-2">
          {items.slice(0, 5).map((item, i) => (
            <MediaCard
              key={item.id + i}
              item={item}
              variant={i === 0 ? "landscape" : "standard"}
              className={cn("w-full", i === 0 && "md:col-span-2 md:row-span-2")}
              priority={spec.priority && i === 0}
            />
          ))}
        </div>
      );

    case "ranked":
      return (
        <ol className="grid gap-1 md:grid-cols-2 md:gap-x-8">
          {items.map((item, i) => (
            <li key={item.id + i}>
              <MediaCard item={{ ...item, rank: i + 1 }} variant="compact" />
            </li>
          ))}
        </ol>
      );

    case "featured":
      return (
        <div className="grid gap-[var(--rail-gap)]">
          {items.slice(0, 2).map((item, i) => (
            <MediaCard key={item.id + i} item={item} variant="featured" priority={spec.priority && i === 0} />
          ))}
        </div>
      );

    case "editorial":
      return (
        <div className="grid gap-[var(--rail-gap)] lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          {items[0] && <MediaCard item={items[0]} variant="featured" priority={spec.priority} />}
          <ul className="grid gap-1 content-start">
            {items.slice(1, 6).map((item) => (
              <li key={item.id}>
                <MediaCard item={item} variant="compact" />
              </li>
            ))}
          </ul>
        </div>
      );

    case "chips":
      return (
        <ul className="flex flex-wrap gap-2">
          {(spec.chips ?? []).map((c) =>
            c.to ? (
              <li key={c.label}>
                <Link
                  to={c.to}
                  className="press inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-2 px-4 py-2 text-sm font-medium hover:border-[var(--green)] hover:text-[var(--green)]"
                >
                  {c.label}
                  {c.meta && <span className="text-xs text-muted-foreground">{c.meta}</span>}
                </Link>
              </li>
            ) : (
              <li
                key={c.label}
                className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-2 px-4 py-2 text-sm font-medium"
              >
                {c.label}
                {c.meta && <span className="text-xs text-muted-foreground">{c.meta}</span>}
              </li>
            ),
          )}
        </ul>
      );

    case "stats":
      return (
        <dl className="grid grid-cols-2 gap-[var(--rail-gap)] lg:grid-cols-4">
          {(spec.stats ?? []).map((s) => (
            <div key={s.k} className="rounded-2xl border border-hairline bg-card p-5">
              <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{s.k}</dt>
              <dd className="mt-2 font-display text-[var(--step-3)] font-extrabold leading-none">{s.v}</dd>
            </div>
          ))}
        </dl>
      );

    case "steps":
      return (
        <ol className="grid gap-[var(--rail-gap)] md:grid-cols-2 xl:grid-cols-4">
          {(spec.steps ?? []).map((s, i) => (
            <li key={s.k} className="relative rounded-2xl border border-hairline bg-card p-5">
              <span className="font-display text-3xl font-black text-[var(--green)]">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 font-display text-lg font-bold">{s.k}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.v}</p>
            </li>
          ))}
        </ol>
      );

    case "schedule":
      return (
        <ul className="divide-y divide-[var(--hairline)] overflow-hidden rounded-2xl border border-hairline bg-card">
          {items.map((item) => (
            <li key={item.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-3 sm:p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{item.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {[item.subtitle, item.meta, item.category].filter(Boolean).join(" · ")}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <MediaCard item={item} variant="compact" showWatch className="hidden" />
                <Link
                  to={item.href}
                  className="press rounded-full border border-hairline px-3 py-1.5 text-xs font-semibold hover:border-[var(--green)]"
                >
                  Details
                </Link>
              </div>
            </li>
          ))}
        </ul>
      );

    case "faq":
      return (
        <Accordion type="single" collapsible className="mx-auto w-full max-w-3xl">
          {(spec.faq ?? []).map((f, i) => (
            <AccordionItem key={f.q} value={`i${i}`}>
              <AccordionTrigger className="text-left font-display text-base font-semibold">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      );

    case "quote":
      return (
        <figure className="mx-auto max-w-4xl text-center">
          <blockquote className="font-display text-[var(--step-3)] font-semibold leading-tight">
            “{spec.quote?.text}”
          </blockquote>
          <figcaption className="mt-4 text-sm text-muted-foreground">
            {spec.quote?.who}
            {spec.quote?.role ? ` · ${spec.quote.role}` : ""}
          </figcaption>
        </figure>
      );

    case "cta":
      return (
        <div
          className={cn(
            "grain relative overflow-hidden rounded-3xl border p-[clamp(1.25rem,4vw,3.5rem)]",
            spec.tone === "gold"
              ? "border-[color-mix(in_oklab,var(--gold)_45%,transparent)] bg-[color-mix(in_oklab,var(--gold)_10%,var(--card))]"
              : "border-hairline bg-card hero-wash",
          )}
        >
          <div className="max-w-2xl">
            <h3 className="font-display text-[var(--step-4)] font-extrabold leading-[1.02]">{spec.title}</h3>
            {spec.blurb && <p className="mt-3 text-muted-foreground">{spec.blurb}</p>}
            {spec.body}
            {spec.action && (
              <Link
                to={spec.action.to}
                className={cn(
                  "press mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold",
                  spec.tone === "gold"
                    ? "bg-[var(--gold)] text-[oklch(0.16_0.02_90)] hover:shadow-gold"
                    : "bg-[var(--green-action)] text-white hover:shadow-glow",
                )}
              >
                {spec.action.label}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      );

    case "split":
      return (
        <div className="grid items-center gap-[clamp(1rem,3vw,3rem)] lg:grid-cols-2">
          <div className="space-y-4 text-muted-foreground">{spec.body}</div>
          <div className="grid gap-[var(--rail-gap)] sm:grid-cols-2">
            {items.slice(0, 4).map((item) => (
              <MediaCard key={item.id} item={item} variant="standard" className="w-full" />
            ))}
          </div>
        </div>
      );

    case "panel":
    default:
      return <div className="rounded-3xl border border-hairline bg-card p-[clamp(1rem,3vw,2.5rem)]">{spec.body}</div>;
  }
}

function SkeletonFor({ spec }: { spec: SectionSpec }) {
  if (["cta", "faq", "quote", "panel", "stats", "steps", "chips"].includes(spec.layout)) {
    return <div className="shimmer h-48 w-full rounded-3xl" />;
  }
  if (spec.layout === "ranked")
    return (
      <div className="grid gap-1 md:grid-cols-2 md:gap-x-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} variant="compact" />
        ))}
      </div>
    );
  return (
    <div className="rail-scroll">
      {Array.from({ length: 5 }).map((_, i) => (
        <CardSkeleton key={i} variant={spec.variant ?? "standard"} />
      ))}
    </div>
  );
}

export function Section({ spec, index }: { spec: SectionSpec; index: number }) {
  const { ref, near } = useNear<HTMLElement>(spec.priority || index < 2);
  const bare = spec.layout === "cta" || spec.layout === "quote";

  return (
    <section
      ref={ref}
      id={spec.id}
      aria-labelledby={`${spec.id}-h`}
      className={cn("shell", !spec.priority && "deferred")}
      style={{ marginBlockStart: "var(--section-gap)" }}
    >
      {!bare && (
        <header className="mb-[clamp(0.9rem,1.6vw,1.6rem)] grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
          <div className="min-w-0">
            {spec.eyebrow && (
              <p
                className={cn(
                  "mb-1.5 text-[0.7rem] font-bold uppercase tracking-[0.2em]",
                  spec.tone === "gold" ? "text-[var(--gold)]" : "text-[var(--green)]",
                )}
              >
                {spec.eyebrow}
              </p>
            )}
            <h2 id={`${spec.id}-h`} className="font-display text-[var(--step-3)] font-extrabold leading-[1.05]">
              {spec.title}
            </h2>
            {spec.blurb && <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{spec.blurb}</p>}
          </div>
          {spec.action && (
            <Link
              to={spec.action.to}
              className="press shrink-0 rounded-full border border-hairline px-4 py-2 text-xs font-semibold hover:border-[var(--green)] hover:text-[var(--green)]"
            >
              {spec.action.label}
            </Link>
          )}
        </header>
      )}
      {bare && <h2 id={`${spec.id}-h`} className="sr-only">{spec.title}</h2>}
      {near ? <Body spec={spec} /> : <SkeletonFor spec={spec} />}
    </section>
  );
}

export function SectionList({ sections }: { sections: SectionSpec[] }) {
  return (
    <>
      {sections.map((s, i) => (
        <Section key={s.id} spec={s} index={i} />
      ))}
    </>
  );
}

/** Wrapper for bespoke (non-spec) route sections so they share rhythm + a11y. */
export function Band({
  id,
  eyebrow,
  title,
  blurb,
  tone,
  children,
  bare,
}: {
  id: string;
  eyebrow?: string | undefined;
  title: string;
  blurb?: string | undefined;
  tone?: "default" | "gold" | undefined;
  children?: React.ReactNode | undefined;
  bare?: boolean | undefined;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-h`}
      className="shell deferred"
      style={{ marginBlockStart: "var(--section-gap)" }}
    >
      {bare ? (
        <h2 id={`${id}-h`} className="sr-only">
          {title}
        </h2>
      ) : (
        <header className="mb-[clamp(0.9rem,1.6vw,1.6rem)]">
          {eyebrow && (
            <p
              className={cn(
                "mb-1.5 text-[0.7rem] font-bold uppercase tracking-[0.2em]",
                tone === "gold" ? "text-[var(--gold)]" : "text-[var(--green)]",
              )}
            >
              {eyebrow}
            </p>
          )}
          <h2 id={`${id}-h`} className="font-display text-[var(--step-3)] font-extrabold leading-[1.05]">
            {title}
          </h2>
          {blurb && <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{blurb}</p>}
        </header>
      )}
      {children}
    </section>
  );
}
