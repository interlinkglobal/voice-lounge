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
const BRAND_PLACEHOLDER_PREFIXES = ["person-", "show-", "press-", "collection-"];

export function Artwork({
  artwork,
  className,
  priority,
  label,
}: {
  artwork: ArtworkModel;
  className?: string;
  priority?: boolean;
  label?: string;
}) {
  const ratio = RATIO[artwork.ratio ?? "16/9"];
  const [recovery, setRecovery] = useState(0);
  const brandedFallback = BRAND_PLACEHOLDER_PREFIXES.some((prefix) => artwork.seed.startsWith(prefix));
  const useBrandPlaceholder = brandedFallback && (!artwork.src || recovery > 0);
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
      {useBrandPlaceholder ? (
        <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_25%_20%,color-mix(in_oklab,var(--green)_22%,transparent),transparent_38%),radial-gradient(circle_at_80%_82%,color-mix(in_oklab,var(--gold)_16%,transparent),transparent_42%),#050806] p-5 text-center">
          <div>
            <span className="font-display text-[clamp(1.4rem,7vw,4rem)] font-black tracking-[-0.06em] text-[var(--gold)]">TVL</span>
            {label && <span className="mt-2 block text-xs font-bold uppercase tracking-[0.16em] text-white/65">{label}</span>}
          </div>
        </div>
      ) : (
        <img
          src={src}
          alt={artwork.alt}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "auto"}
          onError={() => setRecovery((value) => Math.min(value + 1, 18))}
          className="absolute inset-0 h-full w-full object-cover transition-[transform,filter] duration-500 ease-[var(--ease-out-quick)]"
        />
      )}
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/[0.035]" aria-hidden="true" />
    </div>
  );
}
