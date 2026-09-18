import type { CSSProperties } from "react";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MembershipCardChanges {
  name: string;
  color: string;
  date: string;
  plan: string;
}

export interface EditableMembershipCardProps {
  change?: Partial<MembershipCardChanges>;
  memberId?: string;
  role?: string;
  country?: string;
  access?: string;
  tagline?: string;
  className?: string;
}

const DEFAULT_CHANGE: MembershipCardChanges = {
  name: "Sihle P.",
  color: "#18e97a",
  date: "18 SEP 2026",
  plan: "PREMIUM MEMBER",
};

const WAVE_BARS = [32, 46, 58, 72, 52, 40, 64, 78, 54, 44, 68, 90, 70, 56, 74, 50, 62, 42, 66, 48, 38, 54, 72, 46, 64, 52, 36, 58, 76, 44, 68, 40];

export function EditableMembershipCard({
  change,
  memberId = "TVL-SA-002547",
  role = "SPECIAL GUEST",
  country = "SOUTH AFRICA",
  access = "ALL ACCESS",
  tagline = "GUEST OF THE VOICE LOUNGE",
  className,
}: EditableMembershipCardProps) {
  const resolved = { ...DEFAULT_CHANGE, ...change };
  const style = {
    "--member-accent": resolved.color,
    "--member-metal": "#e6ba55",
  } as CSSProperties;

  return (
    <article
      className={cn(
        "relative aspect-[192/100] w-full overflow-hidden rounded-[4.8%] bg-[#050908] text-[#f7f2e8] shadow-[0_26px_45px_rgba(0,0,0,.5),0_0_0_1px_rgba(230,186,85,.22),inset_0_0_34px_rgba(0,0,0,.76)]",
        className,
      )}
      style={{ ...style, containerType: "inline-size" }}
      aria-label={`${resolved.plan} card for ${resolved.name}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_13%_17%,color-mix(in_oklab,var(--member-accent)_34%,transparent),transparent_25%),radial-gradient(circle_at_58%_46%,color-mix(in_oklab,var(--member-accent)_14%,transparent),transparent_34%),linear-gradient(120deg,#022518_0%,#06110d_36%,#050706_55%,#090a09_100%)]" />
      <div className="absolute inset-0 opacity-[0.15] [background-image:radial-gradient(circle_at_center,white_0.55px,transparent_0.65px)] [background-size:3px_3px]" />

      <div className="member-card-metal-line absolute -right-[4%] -top-[23%] h-[68%] w-[52%] rotate-[8deg] rounded-[0_0_0_80%] border-b-[0.34cqw] border-l-[0.34cqw] border-[var(--member-metal)] bg-[#0b0c0c]/90 shadow-[-10px_12px_30px_rgba(0,0,0,.35)]" />
      <div className="member-card-accent-line absolute -right-[2%] top-[33%] h-[28%] w-[55%] -rotate-[8deg] rounded-[70%_0_0_70%] border-t-[0.3cqw] border-[var(--member-accent)] bg-[linear-gradient(180deg,color-mix(in_oklab,var(--member-accent)_14%,transparent),transparent)]" />
      <div className="member-card-metal-line absolute -left-[8%] top-[58%] h-[38%] w-[78%] -rotate-[5deg] rounded-[0_80%_0_0] border-t-[0.34cqw] border-[var(--member-metal)] bg-[linear-gradient(180deg,color-mix(in_oklab,var(--member-accent)_10%,#06110d),#060807_72%)]" />
      <div className="member-card-accent-line absolute -bottom-[10%] right-[7%] h-[31%] w-[66%] rotate-[5deg] rounded-[70%_0_0_0] border-t-[0.18cqw] border-[color-mix(in_oklab,var(--member-accent)_70%,transparent)] opacity-90" />

      <div className="absolute left-[5.4%] top-[7.6%] z-10 flex w-[58%] items-center gap-[2.8%]">
        <img
          src="/voice-lounge-card-logo.png"
          alt=""
          width={256}
          height={256}
          className="w-[11.8%] shrink-0 object-contain drop-shadow-[0_0_12px_color-mix(in_oklab,var(--member-accent)_35%,transparent)]"
          draggable={false}
        />
        <div className="min-w-0">
          <p className="whitespace-nowrap font-display text-[clamp(.68rem,3.05cqw,2.55rem)] font-black leading-[.92] tracking-[-0.05em] text-[#faf7f0]">
            The Voice Lounge
          </p>
          <p className="mt-[2.6%] whitespace-nowrap text-[clamp(.29rem,1.27cqw,1.05rem)] font-semibold tracking-[0.31em] text-[var(--member-metal)]">
            SOUTH AFRICA
          </p>
          <p className="mt-[4.5%] whitespace-nowrap text-[clamp(.2rem,.67cqw,.56rem)] uppercase tracking-[0.39em] text-white/67">
            Podcasts <span className="text-[var(--member-accent)]">•</span> Shows <span className="text-[var(--member-accent)]">•</span> Culture <span className="text-[var(--member-accent)]">•</span> You
          </p>
        </div>
      </div>

      <div className="absolute right-[6.7%] top-[6.3%] z-10 w-[29%] text-center">
        <div className="flex items-center justify-center gap-[5%] text-[var(--member-metal)]">
          <span className="member-card-metal-line h-px flex-1 bg-[var(--member-metal)]" />
          <Crown className="w-[12%] drop-shadow-[0_0_5px_rgba(230,186,85,.75)]" strokeWidth={1.4} aria-hidden="true" />
          <span className="member-card-metal-line h-px flex-1 bg-[var(--member-metal)]" />
        </div>
        <p className="mt-[4%] whitespace-nowrap text-[clamp(.28rem,1.12cqw,.94rem)] font-semibold tracking-[0.21em] text-[var(--member-metal)]">
          {resolved.plan}
        </p>
        <p className="mt-[2.2%] whitespace-nowrap text-[clamp(.18rem,.58cqw,.49rem)] tracking-[0.49em] text-white/70">{access}</p>
        <p className="mt-[4%] whitespace-nowrap text-[clamp(.16rem,.47cqw,.4rem)] uppercase tracking-[0.25em] text-white/42">
          Issued <span className="text-[var(--member-metal)]">{resolved.date}</span>
        </p>
      </div>

      <div className="absolute left-[5.4%] top-[36.5%] z-10 w-[47%]">
        <div className="member-card-metal-line mb-[3.5%] h-px w-[9%] bg-[var(--member-metal)]" />
        <p className="text-[clamp(.25rem,1.03cqw,.86rem)] font-medium tracking-[0.31em] text-[var(--member-metal)]">{role}</p>
        <p className="mt-[1.4%] font-display text-[clamp(1rem,4.35cqw,3.65rem)] font-black leading-[0.9] tracking-[-0.055em] text-[#faf7f0] drop-shadow-[0_3px_14px_rgba(0,0,0,.45)]">
          {resolved.name}
        </p>
        <p className="mt-[3%] text-[clamp(.24rem,.93cqw,.78rem)] tracking-[0.28em] text-white/84">{country}</p>

        <div className="member-card-pill member-card-metal-line mt-[5.6%] inline-flex min-w-[77%] items-center justify-center rounded-full border border-[var(--member-metal)] bg-black/34 px-[6%] py-[2.2%]">
          <span className="whitespace-nowrap text-[clamp(.2rem,.67cqw,.56rem)] tracking-[0.3em] text-[#f4e1a6]">{tagline}</span>
        </div>
      </div>

      <div className="absolute bottom-[19%] right-[5.7%] flex h-[38%] w-[45%] items-end justify-between gap-[1.25%] overflow-hidden opacity-95" aria-hidden="true">
        {WAVE_BARS.map((height, index) => (
          <span
            key={index}
            className="block w-full rounded-t-full bg-[linear-gradient(180deg,color-mix(in_oklab,var(--member-accent)_98%,white_8%),color-mix(in_oklab,var(--member-accent)_34%,#020302))] shadow-[0_0_7px_color-mix(in_oklab,var(--member-accent)_52%,transparent)]"
            style={{ height: `${height}%`, opacity: 0.58 + ((index % 5) * 0.08) }}
          />
        ))}
      </div>

      <div className="absolute right-[5.2%] top-[47%] z-20 aspect-square w-[22.5%]">
        <img
          src="/sa-card-badge.png"
          alt="South Africa — Louder Together gold badge"
          width={512}
          height={512}
          className="h-full w-full object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,.58)]"
          draggable={false}
        />
      </div>

      <div className="absolute bottom-[5.3%] left-[5.4%] z-20 grid w-[62.5%] grid-cols-[0.82fr_1.25fr] items-end gap-[6%] border-t border-white/8 pt-[2.2%]">
        <div className="min-w-0">
          <p className="text-[clamp(.16rem,.5cqw,.42rem)] uppercase tracking-[0.45em] text-white/56">Member ID</p>
          <p className="mt-[2.2%] whitespace-nowrap text-[clamp(.25rem,.82cqw,.69rem)] font-medium tracking-[0.3em] text-[var(--member-metal)]">{memberId}</p>
        </div>
        <div className="min-w-0 border-l border-[color-mix(in_oklab,var(--member-metal)_58%,transparent)] pl-[8%]">
          <p className="text-[clamp(.18rem,.58cqw,.49rem)] uppercase tracking-[0.39em] text-[var(--member-metal)]">Invite only</p>
          <p className="mt-[2.4%] whitespace-nowrap text-[clamp(.14rem,.39cqw,.34rem)] uppercase tracking-[0.24em] text-white/52">
            People <span className="text-[var(--member-accent)]">•</span> Stories <span className="text-[var(--member-accent)]">•</span> A louder tomorrow
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-[0.6%] z-40 rounded-[4.4%] border border-white/10" />
      <div className="member-card-perimeter pointer-events-none absolute inset-0 z-50 rounded-[4.8%]" aria-hidden="true" />
    </article>
  );
}
