export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-xl border border-hairline bg-black shadow-glow">
        <img
          src="/voice-lounge-card-logo.png"
          alt=""
          className="size-full object-contain p-1"
          loading="eager"
          decoding="async"
        />
      </span>
      {!compact && (
        <span className="min-w-0 leading-none">
          <span className="block font-display text-[0.95rem] font-extrabold tracking-tight">The Voice Lounge</span>
          <span className="block text-[0.6rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            South Africa
          </span>
        </span>
      )}
    </span>
  );
}
