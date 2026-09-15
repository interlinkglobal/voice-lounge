import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { Artwork as ArtworkModel } from "@/lib/content/types";

function seedNum(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

const RATIO: Record<string, string> = {
  "16/9": "56.25%",
  "1/1": "100%",
  "4/5": "125%",
  "3/2": "66.66%",
};

/**
 * Procedural cover art. Renders instantly, ships no bytes, reserves its own
 * space (no CLS) and is replaced automatically when `src` is supplied.
 */
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
  const art = useMemo(() => {
    const a = seedNum(artwork.seed);
    const b = seedNum(artwork.seed + "b");
    const c = seedNum(artwork.seed + "c");
    const family = Math.floor(a * 4);
    const hue = family === 0 ? 150 + b * 26 : family === 1 ? 86 + b * 18 : family === 2 ? 168 + b * 30 : 40 + b * 26;
    const hue2 = family === 3 ? 92 + c * 24 : 145 + c * 40;
    return {
      a,
      b,
      c,
      bars: Array.from({ length: 22 }, (_, i) => 0.18 + Math.abs(Math.sin((i + 1) * (1.4 + a * 3))) * 0.8),
      from: `oklch(${0.26 + a * 0.16} ${0.09 + b * 0.09} ${hue})`,
      to: `oklch(${0.14 + c * 0.1} ${0.05 + a * 0.06} ${hue2})`,
      accent: `oklch(${0.68 + b * 0.16} ${0.13 + c * 0.07} ${family === 3 ? 90 : 158})`,
      angle: Math.round(a * 140) + 110,
      rings: 2 + Math.floor(c * 3),
    };
  }, [artwork.seed]);

  const initials = (label ?? artwork.alt)
    .replace(/[^A-Za-z ]/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <div
      className={cn("relative w-full overflow-hidden bg-surface-2", className)}
      style={{ paddingTop: ratio }}
      role="img"
      aria-label={artwork.alt}
    >
      {artwork.src ? (
        <img
          src={artwork.src}
          alt={artwork.alt}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "auto"}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `linear-gradient(${art.angle}deg, ${art.from}, ${art.to})` }}
        >
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 200 120"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            {Array.from({ length: art.rings }).map((_, i) => (
              <circle
                key={i}
                cx={30 + art.b * 140}
                cy={20 + art.c * 80}
                r={18 + i * (14 + art.a * 16)}
                fill="none"
                stroke={art.accent}
                strokeOpacity={0.16 - i * 0.03}
                strokeWidth={0.9}
              />
            ))}
            <g transform="translate(0,120) scale(1,-1)" opacity={0.42}>
              {art.bars.map((h, i) => (
                <rect
                  key={i}
                  x={i * 9.2 + 2}
                  y={0}
                  width={4.4}
                  height={h * 62}
                  rx={2.2}
                  fill={art.accent}
                  opacity={0.25 + (i % 5) * 0.12}
                />
              ))}
            </g>
          </svg>
          <span
            aria-hidden="true"
            className="absolute left-3 top-3 font-display text-[clamp(0.9rem,3.2cqw,1.6rem)] font-bold tracking-tight text-white/85 mix-blend-plus-lighter"
          >
            {initials}
          </span>
          <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
        </div>
      )}
    </div>
  );
}
