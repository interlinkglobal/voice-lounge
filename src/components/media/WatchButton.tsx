import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { usePlayer, trackFromEpisode } from "@/components/player/PlayerProvider";
import { useYouTubeVideoForKey } from "@/components/youtube/YouTubeFeedProvider";
import { useYouTubePlayer } from "@/components/youtube/YouTubePlayerProvider";
import { episodes } from "@/lib/content/catalog";

/**
 * The platform's primary action. Audio remains in the persistent player;
 * video episodes are mapped to the official channel and played in-site.
 */
export function WatchButton({
  targetId,
  label = "Watch",
  size = "md",
  className,
  fullWidth,
}: {
  targetId: string;
  label?: string | undefined;
  size?: "xs" | "sm" | "md" | "lg" | "tv" | undefined;
  className?: string | undefined;
  fullWidth?: boolean | undefined;
}) {
  const { play, current, playing, toggle } = usePlayer();
  const youtubeVideo = useYouTubeVideoForKey(targetId);
  const youtubePlayer = useYouTubePlayer();
  const episode = episodes.find((x) => x.id === targetId) ?? episodes.find((x) => x.podcastId === targetId);
  const isVideoEpisode = episode?.kind === "video" || Boolean(youtubeVideo);
  const playable = Boolean(youtubeVideo || (episode?.kind === "audio" && episode.mediaUrl));
  const isCurrent = Boolean(episode && episode.kind === "audio" && current?.id === episode.id);

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
    if (!playable || !episode && !youtubeVideo) {
      track("watch_unavailable", { id: targetId });
      return;
    }

    track("watch_click", { id: targetId });

    if (youtubeVideo) {
      youtubePlayer.open(youtubeVideo);
      return;
    }

    if (!episode) return;

    if (isCurrent) {
      toggle();
      return;
    }

    if (episode.kind !== "audio" || !episode.mediaUrl) return;

    const upNext = episodes
      .filter((x) => x.kind === "audio" && x.mediaUrl && x.podcastId === episode.podcastId && x.id !== episode.id)
      .slice(0, 6)
      .map(trackFromEpisode);
    play(trackFromEpisode(episode), upNext);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!playable}
      title={!playable ? "No verified playback source is mapped to this item yet." : undefined}
      aria-label={isCurrent && playing ? `Pause ${label}` : `${label} now`}
      className={cn(
        "press inline-flex items-center justify-center rounded-full font-semibold tracking-tight",
        "bg-[var(--green-action)] text-white shadow-[0_6px_18px_-8px_var(--green-deep)]",
        "hover:bg-[var(--emerald)] hover:text-[oklch(0.16_0.02_155)] hover:shadow-glow",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--emerald)]",
        sizes[size],
        fullWidth && "w-full",
        !playable && "cursor-not-allowed opacity-50",
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
