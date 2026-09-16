import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Artwork as ArtworkModel } from "@/lib/content/types";
import { stockImageForSeed } from "@/lib/stock-images";

const RATIO: Record<string, string> = {
  "16/9": "56.25%",
  "1/1": "100%",
  "4/5": "125%",
  "3/2": "66.66%",
};

/**
 * Real-image renderer. Explicit art wins; every other surface receives a
 * deterministic stock photograph. If a remote source breaks, rotate through
 * another real stock image instead of falling back to procedural/demo art.
 */
export function Artwork({
  artwork,
  className,
  priority,
}: {
  artwork: ArtworkModel;
  className?: string;
  priority?: boolean;
  label?: string;
}) {
  const ratio = RATIO[artwork.ratio ?? "16/9"];
  const [recovery, setRecovery] = useState(0);
  const src = recovery === 0 && artwork.src
    ? artwork.src
    : stockImageForSeed(artwork.seed, recovery + (artwork.src ? 0 : 1));

  return (
    <div
      className={cn("media-shine relative w-full overflow-hidden bg-black", className)}
      style={{ paddingTop: ratio }}
      role="img"
      aria-label={artwork.alt}
    >
      <img
        src={src}
        alt={artwork.alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        onError={() => setRecovery((value) => Math.min(value + 1, 18))}
        className="absolute inset-0 h-full w-full object-cover transition-[transform,filter] duration-500 ease-[var(--ease-out-quick)]"
      />
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/[0.035]" aria-hidden="true" />
    </div>
  );
}
