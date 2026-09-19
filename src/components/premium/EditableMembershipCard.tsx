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

export const MEMBERSHIP_CARD_ASSETS = {
  logo: "https://res.cloudinary.com/dlokees9a/image/upload/v1789822950/voice-lounge-card-logo_n3gfxc.png",
  badge: "https://res.cloudinary.com/dlokees9a/image/upload/v1789822950/sa-card-badge_xmly6k.png",
} as const;

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
  tagline = "VIEWER OF THE VOICE LOUNGE",
  className,
}: EditableMembershipCardProps) {
  const resolved = { ...DEFAULT_CHANGE, ...change };
  const style = {
    "--member-accent": resolved.color,
    "--member-metal": "#e6ba55",
  } as CSSProperties;

  return (
    <div
      role="img"
      className={cn(
        "member-card-frame relative aspect-[192/100] w-full rounded-[4.8%] p-[2px] text-[#f7f2e8]",
        className,
      )}
      style={{ ...style, containerType: "inline-size" }}
      aria-label={`${resolved.plan} card for ${resolved.name}`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[4.55%] bg-[#050908] shadow-[inset_0_0_34px_rgba(0,0,0,.76)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_13%_17%,color-mix(in_oklab,var(--member-accent)_34%,transparent),transparent_25%),radial-gradient(circle_at_58%_46%,color-mix(in_oklab,var(--member-accent)_14%,transparent),transparent_34%),linear-gradient(120deg,#022518_0%,#06110d_36%,#050706_55%,#090a09_100%)]" />
        <div className="absolute inset-0 opacity-[0.15] [background-image:radial-gradient(circle_at_center,white_0.55px,transparent_0.65px)] [background-size:3px_3px]" />

        <div className="member-card-metal-line absolute -right-[3%] -top-[24%] h-[70%] w-[50%] rotate-[7deg] rounded-[0_0_0_78%] border-b-[0.34cqw] border-l-[0.34cqw] border-[var(--member-metal)] bg-[#090b0a]/94" />
        <div className="member-card-accent-line absolute -right-[2%] top-[33%] h-[28%] w-[55%] -rotate-[8deg] rounded-[70%_0_0_70%] border-t-[0.3cqw] border-[var(--member-accent)] bg-[linear-gradient(180deg,color-mix(in_oklab,var(--member-accent)_14%,transparent),transparent)]" />
        <div className="member-card-metal-line absolute -left-[8%] top-[58%] h-[38%] w-[78%] -rotate-[5deg] rounded-[0_80%_0_0] border-t-[0.34cqw] border-[var(--member-metal)] bg-[linear-gradient(180deg,color-mix(in_oklab,var(--member-accent)_10%,#06110d),#060807_72%)]" />
        <div className="member-card-accent-line absolute -bottom-[10%] right-[7%] h-[31%] w-[66%] rotate-[5deg] rounded-[70%_0_0_0] border-t-[0.18cqw] border-[color-mix(in_oklab,var(--member-accent)_70%,transparent)] opacity-90" />

        <div className="absolute left-[5.2%] top-[6.4%] z-10 flex w-[64%] items-center gap-[3.1%]">
          <img
            src={MEMBERSHIP_CARD_ASSETS.logo}
            alt=""
            width={256}
            height={256}
            className="w-[15.8%] shrink-0 object-contain drop-shadow-[0_0_14px_color-mix(in_oklab,var(--member-metal)_58%,transparent)]"
            draggable={false}
          />
          <div className="min-w-0">
            <p className="whitespace-nowrap font-display text-[clamp(1.1rem,4.15cqw,3.5rem)] font-black leading-[.9] tracking-[-0.052em] text-[#fff5d7] drop-shadow-[0_2px_8px_rgba(0,0,0,.5)]">
              The Voice Lounge
            </p>
            <p className="mt-[2.4%] whitespace-nowrap text-[clamp(.5rem,1.5cqw,1.22rem)] font-semibold tracking-[0.29em] text-[var(--member-metal)]">
              SOUTH AFRICA
            </p>
            <p className="mt-[4.1%] whitespace-nowrap text-[clamp(.27rem,.72cqw,.6rem)] uppercase tracking-[0.39em] text-white/70">
              Podcasts <span className="text-[var(--member-accent)]">•</span> Shows <span className="text-[var(--member-accent)]">•</span> Culture <span className="text-[var(--member-accent)]">•</span> You
            </p>
          </div>
        </div>

        <div className="absolute right-[6.4%] top-[6.1%] z-10 w-[29%] text-center">
          <div className="flex items-center justify-center gap-[5%] text-[var(--member-metal)]">
            <span className="member-card-metal-line h-px flex-1 bg-[var(--member-metal)]" />
            <Crown className="w-[12.5%] drop-shadow-[0_0_5px_rgba(230,186,85,.75)]" strokeWidth={1.4} aria-hidden="true" />
            <span className="member-card-metal-line h-px flex-1 bg-[var(--member-metal)]" />
          </div>
          <p className="mt-[4%] whitespace-nowrap text-[clamp(.42rem,1.24cqw,1rem)] font-semibold tracking-[0.2em] text-[var(--member-metal)]">
            {resolved.plan}
          </p>
          <p className="mt-[2.3%] whitespace-nowrap text-[clamp(.3rem,.68cqw,.56rem)] tracking-[0.45em] text-white/74">{access}</p>
          <p className="mt-[3.6%] whitespace-nowrap text-[clamp(.23rem,.52cqw,.45rem)] uppercase tracking-[0.23em] text-white/46">
            Issued <span className="text-[var(--member-metal)]">{resolved.date}</span>
          </p>
        </div>

        <div className="absolute left-[5.35%] top-[37.3%] z-10 w-[49%]">
          <div className="member-card-metal-line mb-[3.1%] h-px w-[9%] bg-[var(--member-metal)]" />
          <p className="text-[clamp(.42rem,1.18cqw,.96rem)] font-medium tracking-[0.3em] text-[var(--member-metal)]">{role}</p>
          <p className="mt-[1.3%] font-display text-[clamp(1.55rem,5.7cqw,4.5rem)] font-black leading-[0.88] tracking-[-0.057em] text-[#fff7dc] drop-shadow-[0_3px_14px_rgba(0,0,0,.48)]">
            {resolved.name}
          </p>
          <p className="mt-[2.7%] text-[clamp(.42rem,1.16cqw,.95rem)] tracking-[0.28em] text-white/88">{country}</p>

          <div className="member-card-pill member-card-metal-line mt-[5.2%] inline-flex min-w-[84%] items-center justify-center rounded-full border border-[var(--member-metal)] bg-black/38 px-[5%] py-[2.35%]">
            <span className="whitespace-nowrap text-[clamp(.48rem,1.08cqw,.86rem)] tracking-[0.28em] text-[#f8e8ad]">{tagline}</span>
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

        <div className="absolute right-[5.2%] top-[46.4%] z-20 aspect-square w-[22.5%]">
          <img
            src={MEMBERSHIP_CARD_ASSETS.badge}
            alt="South Africa — Louder Together gold badge"
            width={512}
            height={512}
            className="h-full w-full object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,.58)]"
            draggable={false}
          />
        </div>

        <div className="absolute bottom-[5%] left-[5.3%] z-20 grid w-[63.5%] grid-cols-[0.88fr_1.28fr] items-end gap-[5.5%] border-t border-white/10 pt-[2.35%]">
          <div className="min-w-0">
            <p className="text-[clamp(.42rem,.92cqw,.76rem)] uppercase tracking-[0.38em] text-white/62">Member ID</p>
            <p className="mt-[1.8%] whitespace-nowrap text-[clamp(.5rem,1.18cqw,.96rem)] font-medium tracking-[0.28em] text-[var(--member-metal)]">{memberId}</p>
          </div>
          <div className="min-w-0 border-l border-[color-mix(in_oklab,var(--member-metal)_58%,transparent)] pl-[7%]">
            <p className="text-[clamp(.43rem,.96cqw,.8rem)] uppercase tracking-[0.33em] text-[var(--member-metal)]">Invite only</p>
            <p className="mt-[1.9%] whitespace-nowrap text-[clamp(.33rem,.64cqw,.55rem)] uppercase tracking-[0.21em] text-white/58">
              People <span className="text-[var(--member-accent)]">•</span> Stories <span className="text-[var(--member-accent)]">•</span> A louder tomorrow
            </p>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-[0.7%] z-40 rounded-[4.2%] border border-white/10" />
        <div className="member-card-edge-glint pointer-events-none absolute inset-0 z-50 rounded-[inherit]" aria-hidden="true" />
      </div>
    </div>
  );
}
