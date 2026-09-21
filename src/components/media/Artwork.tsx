import { cn } from "@/lib/utils";
import type { Artwork as ArtworkModel } from "@/lib/content/types";
import { SmartImage, type FallbackRatio } from "@/components/media/SmartImage";

const RATIO: Record<string, string> = {
  "16/9": "56.25%",
  "1/1": "100%",
  "4/5": "125%",
  "3/2": "66.66%",
};

export function Artwork({
  artwork,
  className,
  priority,
  label,
}: {
  artwork: ArtworkModel;
  className?: string | undefined;
  priority?: boolean | undefined;
  label?: string | undefined;
}) {
  const ratio = RATIO[artwork.ratio ?? "16/9"];
  const fallbackRatio: FallbackRatio =
    artwork.ratio === "1/1" ? "1:1" :
    artwork.ratio === "4/5" ? "9:16" :
    "16:9";

  return (
    <div
      className={cn("media-shine relative w-full overflow-hidden bg-black", className)}
      style={{ paddingTop: ratio }}
      role="img"
      aria-label={artwork.alt}
    >
      <SmartImage
        src={artwork.src}
        fallbackRatio={fallbackRatio}
        alt={artwork.alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        className="absolute inset-0 h-full w-full object-cover transition-[transform,filter] duration-500 ease-[var(--ease-out-quick)]"
      />
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/[0.035]" aria-hidden="true" />
    </div>
  );
}
