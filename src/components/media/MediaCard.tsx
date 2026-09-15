import { Link } from "@tanstack/react-router";
import { Bookmark, Clock, Crown, MoreHorizontal, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { Artwork } from "./Artwork";
import { WatchButton } from "./WatchButton";
import { useLibrary } from "@/components/system/library";
import type { MediaCardModel } from "@/lib/content/types";

export type CardVariant =
  | "standard"
  | "landscape"
  | "portrait"
  | "compact"
  | "continue"
  | "featured"
  | "premium"
  | "live"
  | "news"
  | "creator"
  | "micro"
  | "tv";

const WIDTH: Record<CardVariant, string> = {
  standard: "w-[clamp(11rem,46vw,20rem)]",
  landscape: "w-[clamp(15rem,72vw,26rem)]",
  portrait: "w-[clamp(9.5rem,36vw,15rem)]",
  compact: "w-full",
  continue: "w-[clamp(15rem,74vw,25rem)]",
  featured: "w-full",
  premium: "w-[clamp(13rem,58vw,23rem)]",
  live: "w-[clamp(15rem,74vw,25rem)]",
  news: "w-[clamp(14rem,68vw,24rem)]",
  creator: "w-[clamp(9rem,34vw,14rem)]",
  micro: "w-full",
  tv: "w-[clamp(20rem,28vw,34rem)]",
};

function Badges({ item }: { item: MediaCardModel }) {
  return (
    <div className="pointer-events-none absolute left-2 top-2 flex flex-wrap gap-1.5">
      {item.live && (
        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--live)] px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-white">
          <span className="size-1.5 rounded-full bg-white" style={{ animation: "vl-pulse-live 1.6s infinite" }} />
          Live
        </span>
      )}
      {item.premium && (
        <span className="inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-[var(--gold-warm)] backdrop-blur">
          <Crown className="size-3" aria-hidden="true" /> Premium
        </span>
      )}
      {item.badge && !item.live && (
        <span className="rounded-full bg-black/60 px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wider text-white/90 backdrop-blur">
          {item.badge}
        </span>
      )}
    </div>
  );
}

function SaveButton({ id, title }: { id: string; title: string }) {
  const { isSaved, toggleSave } = useLibrary();
  const saved = isSaved(id);
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from saved` : `Save ${title}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSave(id);
      }}
      className="press grid size-9 place-items-center rounded-full border border-hairline bg-surface/80 text-muted-foreground backdrop-blur hover:text-foreground"
    >
      <Bookmark className={cn("size-4", saved && "fill-[var(--gold)] text-[var(--gold)]")} aria-hidden="true" />
    </button>
  );
}

export function MediaCard({
  item,
  variant = "standard",
  priority,
  showWatch = true,
  className,
}: {
  item: MediaCardModel;
  variant?: CardVariant;
  priority?: boolean;
  showWatch?: boolean;
  className?: string;
}) {
  const onOpen = () => track("card_click", { id: item.id, kind: item.kind });

  /* ---- micro (smartwatch) ---- */
  if (variant === "micro") {
    return (
      <article className={cn("w-full", className)}>
        <Link
          to={item.href}
          onClick={onOpen}
          className="press flex w-full items-center gap-2 rounded-xl border border-hairline bg-card p-2"
        >
          <div className="w-10 shrink-0 overflow-hidden rounded-lg">
            <Artwork artwork={{ ...item.artwork, ratio: "1/1" }} label={item.title} />
          </div>
          <span className="min-w-0 flex-1 truncate text-[0.72rem] font-semibold leading-tight">{item.title}</span>
        </Link>
        {showWatch && <WatchButton targetId={item.id} size="xs" fullWidth className="mt-1.5" />}
      </article>
    );
  }

  /* ---- compact list row ---- */
  if (variant === "compact") {
    return (
      <article
        className={cn(
          "group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-transparent px-2 py-2 transition-colors hover:border-hairline hover:bg-surface-2/70",
          className,
        )}
      >
        {item.rank !== undefined && (
          <span className="w-7 text-right font-display text-lg font-extrabold text-muted-foreground tabular-nums sm:w-10 sm:text-2xl">
            {item.rank}
          </span>
        )}
        <div className="flex min-w-0 items-center gap-3">
          <div className="w-12 shrink-0 overflow-hidden rounded-lg sm:w-14">
            <Artwork artwork={{ ...item.artwork, ratio: "1/1" }} label={item.title} />
          </div>
          <div className="min-w-0">
            <Link to={item.href} onClick={onOpen} className="block truncate text-sm font-semibold hover:underline">
              {item.title}
            </Link>
            <p className="truncate text-xs text-muted-foreground">
              {[item.subtitle, item.duration ?? item.meta].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>
        {showWatch && <WatchButton targetId={item.id} size="sm" className="hidden sm:inline-flex" />}
        {showWatch && <WatchButton targetId={item.id} size="xs" label="" className="sm:hidden" />}
      </article>
    );
  }

  /* ---- creator ---- */
  if (variant === "creator") {
    return (
      <article className={cn("card-lift text-center", WIDTH.creator, className)}>
        <Link to={item.href} onClick={onOpen} className="block">
          <div className="overflow-hidden rounded-full border border-hairline">
            <Artwork artwork={{ ...item.artwork, ratio: "1/1" }} label={item.title} priority={priority} />
          </div>
          <h3 className="mt-3 truncate text-sm font-bold">{item.title}</h3>
          <p className="truncate text-xs text-muted-foreground">{item.subtitle}</p>
          <p className="mt-0.5 text-[0.7rem] text-muted-foreground/80">{item.stat}</p>
        </Link>
      </article>
    );
  }

  /* ---- featured editorial ---- */
  if (variant === "featured") {
    return (
      <article
        className={cn(
          "card-lift grain group relative overflow-hidden rounded-3xl border border-hairline bg-card",
          className,
        )}
      >
        <div className="grid gap-0 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <div className="relative">
            <Artwork artwork={{ ...item.artwork, ratio: "16/9" }} label={item.title} priority={priority} />
            <Badges item={item} />
          </div>
          <div className="flex flex-col justify-center gap-3 p-[clamp(1rem,2.5vw,2.25rem)]">
            {item.category && (
              <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--green)]">
                {item.category}
              </span>
            )}
            <Link to={item.href} onClick={onOpen}>
              <h3 className="font-display text-[var(--step-3)] font-extrabold leading-[1.05] hover:underline">
                {item.title}
              </h3>
            </Link>
            <p className="line-clamp-3 text-sm text-muted-foreground">{item.description}</p>
            <p className="text-xs text-muted-foreground/90">
              {[item.subtitle, item.meta, item.stat].filter(Boolean).join(" · ")}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              {showWatch && <WatchButton targetId={item.id} size="lg" />}
              <SaveButton id={item.id} title={item.title} />
            </div>
          </div>
        </div>
      </article>
    );
  }

  /* ---- news ---- */
  if (variant === "news") {
    return (
      <article
        className={cn(
          "card-lift group flex flex-col overflow-hidden rounded-2xl border border-hairline bg-card",
          WIDTH.news,
          className,
        )}
      >
        <Link to={item.href} onClick={() => track("news_open", { id: item.id })} className="block">
          <Artwork artwork={{ ...item.artwork, ratio: "16/9" }} label={item.title} priority={priority} />
        </Link>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--gold)]">
            {item.category}
          </span>
          <Link to={item.href} onClick={() => track("news_open", { id: item.id })}>
            <h3 className="font-display text-[1.05rem] font-bold leading-snug hover:underline">{item.title}</h3>
          </Link>
          <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
          <p className="mt-auto pt-1 text-xs text-muted-foreground/80">
            {item.subtitle} · {item.meta}
          </p>
        </div>
      </article>
    );
  }

  /* ---- default family: standard / landscape / portrait / continue / premium / live / tv ---- */
  const ratio = variant === "portrait" ? "4/5" : variant === "standard" ? "1/1" : "16/9";
  const isTv = variant === "tv";
  const isPremium = variant === "premium";

  return (
    <article
      className={cn(
        "card-lift group relative flex flex-col overflow-hidden rounded-2xl border bg-card",
        isPremium
          ? "border-[color-mix(in_oklab,var(--gold)_40%,transparent)] shadow-gold"
          : "border-hairline shadow-card",
        WIDTH[variant],
        className,
      )}
      style={{ containerType: "inline-size" }}
    >
      <Link to={item.href} onClick={onOpen} className="relative block overflow-hidden">
        <div className="transition-transform duration-[220ms] ease-[var(--ease-out-quick)] group-hover:scale-[1.045]">
          <Artwork artwork={{ ...item.artwork, ratio: ratio as never }} label={item.title} priority={priority} />
        </div>
        <Badges item={item} />
        {item.duration && (
          <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md bg-black/72 px-1.5 py-0.5 text-[0.66rem] font-medium text-white tabular-nums backdrop-blur">
            <Clock className="size-3" aria-hidden="true" />
            {item.duration}
          </span>
        )}
        {item.rank !== undefined && (
          <span className="absolute bottom-0 left-2 font-display text-[clamp(2.4rem,5vw,4rem)] font-black leading-none text-white/85 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
            {item.rank}
          </span>
        )}
        {typeof item.progress === "number" && (
          <span className="absolute inset-x-0 bottom-0 h-1 bg-black/45">
            <span
              className="block h-full grad-green"
              style={{ width: `${Math.min(100, item.progress)}%` }}
              role="progressbar"
              aria-valuenow={Math.round(item.progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${item.title} progress`}
            />
          </span>
        )}
      </Link>

      <div className={cn("flex flex-1 flex-col gap-1.5", isTv ? "p-6" : "p-3.5")}>
        {item.category && (
          <span
            className={cn(
              "text-[0.65rem] font-bold uppercase tracking-[0.14em]",
              isPremium ? "text-[var(--gold)]" : "text-[var(--green)]",
              isTv && "text-[0.85rem]",
            )}
          >
            {item.category}
          </span>
        )}
        <Link to={item.href} onClick={onOpen}>
          <h3
            className={cn(
              "line-clamp-2 font-display font-bold leading-snug hover:underline",
              isTv ? "text-2xl" : "text-[0.98rem]",
            )}
          >
            {item.title}
          </h3>
        </Link>
        {item.description && (
          <p className={cn("line-clamp-2 text-muted-foreground", isTv ? "text-base" : "text-[0.8rem]")}>
            {item.description}
          </p>
        )}
        <p className="truncate text-[0.72rem] text-muted-foreground/80">
          {[item.subtitle, item.meta].filter(Boolean).join(" · ")}
        </p>
        <div className="mt-auto flex items-center gap-2 pt-2.5">
          {showWatch && <WatchButton targetId={item.id} size={isTv ? "tv" : "sm"} />}
          <SaveButton id={item.id} title={item.title} />
          {item.live && <Radio className="size-4 text-[var(--live)]" aria-hidden="true" />}
          <button
            type="button"
            aria-label={`More options for ${item.title}`}
            onClick={(e) => e.preventDefault()}
            className="press ml-auto grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-surface-2 hover:text-foreground"
          >
            <MoreHorizontal className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}

/* ---------------- Skeletons ---------------- */

export function CardSkeleton({ variant = "standard" }: { variant?: CardVariant }) {
  if (variant === "compact")
    return (
      <div className="flex items-center gap-3 px-2 py-2">
        <div className="shimmer size-14 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="shimmer h-3.5 w-2/3 rounded" />
          <div className="shimmer h-3 w-1/3 rounded" />
        </div>
      </div>
    );
  const ratio = variant === "portrait" ? "125%" : variant === "standard" ? "100%" : "56.25%";
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-hairline bg-card", WIDTH[variant])}>
      <div className="shimmer w-full" style={{ paddingTop: ratio }} />
      <div className="space-y-2 p-3.5">
        <div className="shimmer h-2.5 w-16 rounded" />
        <div className="shimmer h-4 w-5/6 rounded" />
        <div className="shimmer h-3 w-2/3 rounded" />
        <div className="shimmer mt-3 h-9 w-24 rounded-full" />
      </div>
    </div>
  );
}
