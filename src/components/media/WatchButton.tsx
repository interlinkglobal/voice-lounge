import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { usePlayer, trackFromEpisode } from "@/components/player/PlayerProvider";
import { episodes } from "@/lib/content/catalog";

/**
 * The platform's primary action. Vibrant green surface, white label,
 * contrast-tuned in both themes.
 */
export function WatchButton({
  targetId,
  label = "Watch",
  size = "md",
  className,
  fullWidth,
}: {
  targetId: string;
  label?: string;
  size?: "xs" | "sm" | "md" | "lg" | "tv";
  className?: string;
  fullWidth?: boolean;
}) {
  const { play, current, playing, toggle } = usePlayer();
  const isCurrent = current?.id === targetId;

  const sizes: Record<string, string> = {
    xs: "h-7 gap-1 px-2 text-[0.68rem]",
    sm: "h-9 gap-1.5 px-3 text-[0.8rem]",
    md: "h-10 gap-2 px-4 text-[0.875rem]",
    lg: "h-12 gap-2.5 px-6 text-[0.98rem]",
    tv: "h-16 gap-3 px-9 text-[1.2rem]",
  };

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    track("watch_click", { id: targetId });
    if (isCurrent) {
      toggle();
      return;
    }
    const ep = episodes.find((x) => x.id === targetId) ?? episodes.find((x) => x.podcastId === targetId) ?? episodes[0];
    const upNext = episodes
      .filter((x) => x.podcastId === ep.podcastId && x.id !== ep.id)
      .slice(0, 6)
      .map(trackFromEpisode);
    play(trackFromEpisode(ep), upNext);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isCurrent && playing ? `Pause ${label}` : `${label} now`}
      className={cn(
        "press inline-flex items-center justify-center rounded-full font-semibold tracking-tight",
        "bg-[var(--green-action)] text-white shadow-[0_6px_18px_-8px_var(--green-deep)]",
        "hover:bg-[var(--emerald)] hover:text-[oklch(0.16_0.02_155)] hover:shadow-glow",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--emerald)]",
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
    >
      {isCurrent && playing ? (
        <span aria-hidden="true" className="flex h-3 items-end gap-[2px]">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-[2px] origin-bottom rounded-full bg-current"
              style={{ height: "100%", animation: `vl-bars ${620 + i * 140}ms ease-in-out infinite` }}
            />
          ))}
        </span>
      ) : (
        <Play className="size-[1.05em] shrink-0 fill-current" aria-hidden="true" />
      )}
      <span className="truncate">{isCurrent && playing ? "Playing" : label}</span>
    </button>
  );
}
