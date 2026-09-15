export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-xl grad-green shadow-glow">
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
          <g fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <path d="M5 9v6M9 6v12M13 4v16M17 8v8M21 11v2" opacity="0.95" />
          </g>
        </svg>
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
