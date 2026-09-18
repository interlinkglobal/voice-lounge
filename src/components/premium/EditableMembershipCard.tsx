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

function SoundMark() {
  return (
    <div className="grid aspect-square w-[11.2%] place-items-center rounded-full border border-[var(--member-accent)] bg-[radial-gradient(circle,color-mix(in_oklab,var(--member-accent)_22%,transparent),transparent_63%)] shadow-[0_0_26px_color-mix(in_oklab,var(--member-accent)_70%,transparent),inset_0_0_18px_color-mix(in_oklab,var(--member-accent)_18%,transparent)]">
      <div className="flex h-[42%] items-center gap-[7%]" aria-hidden="true">
        {[35, 58, 78, 100, 78, 58, 35].map((height, index) => (
          <span
            key={index}
            className="block w-[8%] min-w-[2px] rounded-full bg-white shadow-[0_0_8px_white]"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function SouthAfricaSeal() {
  return (
    <div className="relative aspect-square w-full rounded-full border-[0.32cqw] border-[var(--member-metal)] bg-[radial-gradient(circle_at_45%_38%,#3a2f1a_0%,#17130d_34%,#080909_72%)] shadow-[0_0_24px_color-mix(in_oklab,var(--member-metal)_42%,transparent),inset_0_0_0_1px_#161616,inset_0_0_20px_rgba(230,186,85,.08)]">
      <div className="absolute inset-[9%] rounded-full border border-[color-mix(in_oklab,var(--member-metal)_72%,transparent)]" />
      <span className="absolute left-1/2 top-[11%] -translate-x-1/2 whitespace-nowrap text-[clamp(.3rem,.7vw,.64rem)] font-semibold uppercase tracking-[0.22em] text-[var(--member-metal)]">
        South Africa
      </span>
      <svg
        viewBox="0 0 120 90"
        className="absolute left-1/2 top-1/2 w-[48%] -translate-x-1/2 -translate-y-[46%]"
        aria-hidden="true"
      >
        <path
          d="M14 35 23 31 28 20 39 22 44 17 49 23 57 19 65 22 70 16 84 18 91 26 106 28 102 42 97 49 98 58 89 61 84 70 71 72 65 80 54 75 46 78 38 70 29 68 25 57 17 50Z"
          fill="var(--member-metal)"
          stroke="color-mix(in oklab,var(--member-metal) 55%,#6f4f10)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="83" cy="48" r="4" fill="#10100f" />
      </svg>
      <span className="absolute bottom-[10%] left-1/2 -translate-x-1/2 whitespace-nowrap text-[clamp(.27rem,.62vw,.56rem)] font-semibold uppercase tracking-[0.18em] text-[var(--member-metal)]">
        Louder Together
      </span>
      <span className="absolute left-[8%] top-1/2 -translate-y-1/2 text-[var(--member-metal)]">★</span>
      <span className="absolute right-[8%] top-1/2 -translate-y-1/2 text-[var(--member-metal)]">★</span>
    </div>
  );
}

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
        "relative aspect-[192/100] w-full overflow-hidden rounded-[4.8%] border border-[var(--member-metal)] bg-[#050908] text-[#f7f2e8] shadow-[0_26px_45px_rgba(0,0,0,.5),0_0_0_1px_rgba(230,186,85,.4),inset_0_0_0_2px_color-mix(in_oklab,var(--member-metal)_78%,#fff_8%),inset_0_0_34px_rgba(0,0,0,.75)]",
        className,
      )}
      style={{ ...style, containerType: "inline-size" }}
      aria-label={`${resolved.plan} card for ${resolved.name}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,color-mix(in_oklab,var(--member-accent)_34%,transparent),transparent_24%),radial-gradient(circle_at_58%_46%,color-mix(in_oklab,var(--member-accent)_13%,transparent),transparent_32%),linear-gradient(120deg,#022518_0%,#06110d_36%,#050706_55%,#090a09_100%)]" />
      <div className="absolute inset-0 opacity-[0.16] [background-image:radial-gradient(circle_at_center,white_0.55px,transparent_0.65px)] [background-size:3px_3px]" />

      <div className="absolute -right-[4%] -top-[23%] h-[68%] w-[52%] rotate-[8deg] rounded-[0_0_0_80%] border-b-[0.35vw] border-l-[0.35vw] border-[var(--member-metal)] bg-[#0b0c0c]/90 shadow-[-10px_12px_30px_rgba(0,0,0,.35)]" />
      <div className="absolute -right-[2%] top-[33%] h-[28%] w-[55%] -rotate-[8deg] rounded-[70%_0_0_70%] border-t-[0.3vw] border-[var(--member-accent)] bg-[linear-gradient(180deg,color-mix(in_oklab,var(--member-accent)_14%,transparent),transparent)]" />
      <div className="absolute -left-[8%] top-[58%] h-[38%] w-[78%] -rotate-[5deg] rounded-[0_80%_0_0] border-t-[0.36vw] border-[var(--member-metal)] bg-[linear-gradient(180deg,color-mix(in_oklab,var(--member-accent)_10%,#06110d),#060807_72%)]" />
      <div className="absolute -bottom-[10%] right-[7%] h-[31%] w-[66%] rotate-[5deg] rounded-[70%_0_0_0] border-t border-[color-mix(in_oklab,var(--member-accent)_55%,transparent)] opacity-80" />

      <div className="absolute left-[4.7%] top-[8.6%] flex w-[55%] items-center gap-[3.2%]">
        <SoundMark />
        <div className="min-w-0">
          <p className="whitespace-nowrap font-display text-[clamp(.62rem,2.95vw,2.5rem)] font-black leading-none tracking-[-0.045em] text-[#faf7f0]">
            The Voice Lounge
          </p>
          <p className="mt-[2.5%] whitespace-nowrap text-[clamp(.3rem,1.35vw,1.15rem)] font-medium tracking-[0.28em] text-[var(--member-metal)]">
            SOUTH AFRICA
          </p>
          <p className="mt-[4%] whitespace-nowrap text-[clamp(.22rem,.73vw,.62rem)] uppercase tracking-[0.43em] text-white/72">
            Podcasts <span className="text-[var(--member-accent)]">•</span> Shows <span className="text-[var(--member-accent)]">•</span> Culture <span className="text-[var(--member-accent)]">•</span> You
          </p>
        </div>
      </div>

      <div className="absolute right-[7.7%] top-[6.5%] w-[28%] text-center">
        <div className="flex items-center justify-center gap-[5%] text-[var(--member-metal)]">
          <span className="h-px flex-1 bg-[var(--member-metal)]" />
          <Crown className="w-[12%]" strokeWidth={1.4} aria-hidden="true" />
          <span className="h-px flex-1 bg-[var(--member-metal)]" />
        </div>
        <p className="mt-[4%] whitespace-nowrap text-[clamp(.28rem,1.15vw,.98rem)] font-semibold tracking-[0.21em] text-[var(--member-metal)]">
          {resolved.plan}
        </p>
        <p className="mt-[2.5%] whitespace-nowrap text-[clamp(.2rem,.65vw,.55rem)] tracking-[0.5em] text-white/72">{access}</p>
      </div>

      <div className="absolute left-[5.4%] top-[37%] z-10 w-[47%]">
        <div className="mb-[4%] h-px w-[9%] bg-[var(--member-metal)]" />
        <p className="text-[clamp(.26rem,1.12vw,.95rem)] font-medium tracking-[0.32em] text-[var(--member-metal)]">{role}</p>
        <p className="mt-[1.5%] font-display text-[clamp(1rem,4.55vw,3.85rem)] font-black leading-[0.9] tracking-[-0.055em] text-[#faf7f0] drop-shadow-[0_3px_14px_rgba(0,0,0,.45)]">
          {resolved.name}
        </p>
        <p className="mt-[3%] text-[clamp(.25rem,1.05vw,.9rem)] tracking-[0.28em] text-white/86">{country}</p>
        <div className="mt-[5.5%] inline-flex min-w-[74%] items-center justify-center rounded-full border border-[var(--member-metal)] bg-black/30 px-[6%] py-[2.2%] shadow-[0_0_14px_color-mix(in_oklab,var(--member-metal)_28%,transparent),inset_0_0_14px_rgba(230,186,85,.08)]">
          <span className="whitespace-nowrap text-[clamp(.22rem,.78vw,.67rem)] tracking-[0.31em] text-[#f4e1a6]">{tagline}</span>
        </div>
      </div>

      <div className="absolute bottom-[22%] right-[5.8%] flex h-[35%] w-[43%] items-end justify-between gap-[1.25%] overflow-hidden opacity-95" aria-hidden="true">
        {WAVE_BARS.map((height, index) => (
          <span
            key={index}
            className="block w-full rounded-t-full bg-[linear-gradient(180deg,color-mix(in_oklab,var(--member-accent)_98%,white_8%),color-mix(in_oklab,var(--member-accent)_34%,#020302))] shadow-[0_0_7px_color-mix(in_oklab,var(--member-accent)_52%,transparent)]"
            style={{ height: `${height}%`, opacity: 0.58 + ((index % 5) * 0.08) }}
          />
        ))}
      </div>

      <div className="absolute bottom-[6.8%] right-[6.3%] z-20 aspect-square w-[18.8%]">
        <SouthAfricaSeal />
      </div>

      <div className="absolute bottom-[5.1%] left-[5.3%] z-20 flex w-[89%] items-end justify-between border-t border-white/5 pt-[2.2%]">
        <div>
          <p className="text-[clamp(.18rem,.58vw,.5rem)] uppercase tracking-[0.48em] text-white/62">Member ID</p>
          <p className="mt-[2%] whitespace-nowrap text-[clamp(.27rem,.95vw,.82rem)] font-medium tracking-[0.34em] text-[var(--member-metal)]">{memberId}</p>
        </div>
        <div className="mx-[3%] h-[4.2cqw] w-px bg-[var(--member-metal)]/65" />
        <div className="mr-auto">
          <p className="text-[clamp(.2rem,.7vw,.6rem)] uppercase tracking-[0.44em] text-[var(--member-metal)]">Invite only</p>
          <p className="mt-[2%] whitespace-nowrap text-[clamp(.17rem,.5vw,.43rem)] uppercase tracking-[0.36em] text-white/55">
            People <span className="text-[var(--member-accent)]">•</span> Stories <span className="text-[var(--member-accent)]">•</span> A louder tomorrow
          </p>
        </div>
        <div className="text-right">
          <p className="text-[clamp(.17rem,.5vw,.43rem)] uppercase tracking-[0.35em] text-white/50">Issued</p>
          <p className="mt-[2%] whitespace-nowrap text-[clamp(.23rem,.72vw,.62rem)] font-semibold tracking-[0.18em] text-[var(--member-metal)]">{resolved.date}</p>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-[0.55%] z-30 rounded-[4.45%] border border-white/10" />
      <div className="pointer-events-none absolute inset-0 z-40 rounded-[inherit] shadow-[inset_0_0_0_2px_var(--member-metal)]" />
      <div className="pointer-events-none absolute inset-x-[4.5%] top-[0.35%] z-40 h-[0.22%] bg-[linear-gradient(90deg,transparent,var(--member-accent),var(--member-metal),transparent)] opacity-85" />
    </article>
  );
}
