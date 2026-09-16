import { useEffect, useState } from "react";
import { Crown, Headphones, Sparkles, Users, Zap } from "lucide-react";

const MOMENTS = [
  { icon: Zap, label: "Zero interruption", detail: "Ad-free, immediate playback" },
  { icon: Headphones, label: "Studio-grade", detail: "Premium audio and video access" },
  { icon: Users, label: "Member rooms", detail: "Closer access to creators" },
] as const;

export function PremiumCeremony() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 8000);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="premium-ceremony fixed inset-0 z-[120] overflow-hidden bg-[oklch(0.08_0.01_90)] text-white" role="dialog" aria-modal="true" aria-label="Voice Lounge Premium experience">
      <div className="premium-ceremony-orb premium-ceremony-orb-a" />
      <div className="premium-ceremony-orb premium-ceremony-orb-b" />
      <button type="button" onClick={() => setVisible(false)} className="press hyper-glass absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-20 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-white/75 hover:text-white">Skip ceremony</button>

      <div className="relative z-10 grid min-h-full place-items-center px-4 py-14">
        <div className="w-full max-w-6xl text-center">
          <div className="premium-ceremony-kicker mx-auto inline-flex items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--gold)_40%,transparent)] bg-black/30 px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.22em] text-[var(--gold-warm)] backdrop-blur-2xl">
            <Crown className="size-4" /> Premium member environment
          </div>

          <div className="premium-ceremony-title mt-6">
            <p className="font-display text-[clamp(2.3rem,7vw,7rem)] font-black leading-[0.88] tracking-[-0.055em] text-gold-foil">Welcome beyond the lounge.</p>
            <p className="mx-auto mt-5 max-w-2xl text-[clamp(0.95rem,1.6vw,1.25rem)] leading-relaxed text-white/55">A deliberately quieter, faster experience reserved for viewers who want less interface between them and the conversation.</p>
          </div>

          <div className="premium-ceremony-card mx-auto mt-8 w-full max-w-3xl">
            <div className="media-shine premium-geometry relative overflow-hidden">
              <img src="/card 2.png" alt="Casey T. Voice Lounge Premium member card" className="block h-auto w-full drop-shadow-[0_30px_80px_rgba(0,0,0,0.6)]" />
            </div>
          </div>

          <div className="premium-ceremony-moments mx-auto mt-7 grid max-w-4xl gap-3 sm:grid-cols-3">
            {MOMENTS.map(({ icon: Icon, label, detail }, index) => (
              <div key={label} className="hyper-glass premium-geometry p-4 text-left" style={{ animationDelay: `${3.1 + index * 0.75}s` }}>
                <span className="grid size-10 place-items-center rounded-full bg-[color-mix(in_oklab,var(--gold)_18%,transparent)] text-[var(--gold-warm)]"><Icon className="size-5" /></span>
                <p className="mt-3 font-display text-base font-bold">{label}</p>
                <p className="mt-1 text-xs leading-5 text-white/50">{detail}</p>
              </div>
            ))}
          </div>

          <div className="premium-ceremony-final mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold-warm)]"><Sparkles className="size-4" /> Member experience ready</div>
        </div>
      </div>
    </div>
  );
}
