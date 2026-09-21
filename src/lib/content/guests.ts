import type { YouTubeFeedVideo } from "@/lib/youtube.functions";
import { normalizeProgrammeText } from "@/lib/content/programme-directory";

export interface GuestLink {
  label: string;
  url: string;
  kind: "website" | "linkedin" | "social";
}

export interface GuestProfile {
  slug: string;
  name: string;
  description: string;
  aliases?: string[];
  image?: string | null;
  links?: GuestLink[];
  source: "research" | "legacy" | "youtube";
}

function slugifyGuest(value: string) {
  return normalizeProgrammeText(value).replace(/s+/g, "-");
}

export const VERIFIED_GUESTS: GuestProfile[] = [
  { slug: "lee-generes", name: "Lee Generes", description: "Music guest who joined Narcho Mabizela for a Voice Lounge conversation about her music journey, identity, ambition and entertainment.", source: "research" },
  { slug: "sivenathi-nazo", name: "Sivenathi Nazo", description: "Beyond The Grey guest in a conversation about Ward 18, local priorities, community issues and representation.", source: "research" },
  { slug: "siyanda-vazi", name: "Siyanda Vazi", description: "Founder of Ubomi Foundation SA, featured in a conversation about child and community-development work.", links: [{ label: "Ubomi Foundation SA", url: "https://infoubomifoundationsa.org/about", kind: "website" }], source: "research" },
  { slug: "siyambonga-jara", name: "Siyambonga Jara", description: "Wills and estate-planning specialist featured on The Breakfast Plug during National Wills Week.", links: [{ label: "LinkedIn", url: "https://za.linkedin.com/in/siyambonga-jara-6228795a", kind: "linkedin" }], source: "research" },
  { slug: "sihle-peter-cwenga", name: "Sihle Peter Cwenga", description: "Beyond The Grey guest in a discussion breaking down issues raised in the President's letter.", source: "research" },
  { slug: "khanya-makhaphela", name: "Khanya Makhaphela", aliases: ["Khanya Makapela"], description: "Accounting professional featured in a Voice Lounge sit-down covering career development, professional challenges and owning an accounting firm.", links: [{ label: "LinkedIn", url: "https://za.linkedin.com/in/khanya-makapela-bap-sa-376732190", kind: "linkedin" }], source: "research" },
  { slug: "khanya-sakube", name: "Khanya Sakube", description: "Beyond The Grey guest in a discussion about youth development, community-building and constructive recreational spaces.", source: "research" },
  { slug: "kuyasa-kela", name: "Kuyasa Kela", description: "East London-born visual artist featured on Beyond The Grey discussing Xhosa identity, culture, heritage and whether art can challenge tradition.", links: [{ label: "Public profile", url: "https://newworkwits.co.za/project/kuyasa-kela/", kind: "website" }, { label: "LinkedIn", url: "https://za.linkedin.com/in/kuyasa-kela-12a68912b", kind: "linkedin" }], source: "research" },
  { slug: "vuyisa-mnyabiso", name: "Vuyisa Mnyabiso", aliases: ["Vuyiswa Mnyabiso"], description: "Founder associated with the God Is Able Feeding Centre, featured in a community conversation about feeding more than 200 people weekly.", source: "research" },
  { slug: "sesethu-isipho-maneli", name: "Sesethu-Isipho Maneli", aliases: ["Sesethu Maneli", "Sesethu"], description: "Voice Lounge artist and guest whose appearances developed into a broader artist-development and recording story.", source: "research" },
  { slug: "pastor-gugu-mbuku", name: "Pastor Gugu Mbuku", aliases: ["Pastor Gugu"], description: "Faith guest and presenter featured in sessions on spiritual empowerment, transitions, personal limitations and themes from I Had To Leave To Live.", source: "legacy" },
  { slug: "pastor-tetese", name: "Pastor Tetese", description: "Koinonia guest featured in spiritual reflection and biblical teaching around 1 Samuel 17:34.", source: "legacy" },
  { slug: "duke-maplanka-atterball", name: "Duke Maplanka Atterball", aliases: ["Duke Atterbell Maplanka", "Duke Maplanka"], description: "Guest in a Voice Lounge conversation about migration, South African public life, human rights and ubuntu.", source: "research" },
  { slug: "joshua-maponga", name: "Joshua Maponga", aliases: ["Bishop Joshua Maponga"], description: "Recurring long-form guest in Voice Lounge conversations on African identity, faith, spirituality, geopolitics and leadership.", links: [{ label: "Website", url: "http://www.joshuamaponga.com", kind: "website" }, { label: "LinkedIn", url: "https://za.linkedin.com/in/joshua-iii-marara-maponga-793ba921", kind: "linkedin" }], source: "youtube" },
  { slug: "dr-noma-mbeki", name: "Dr Noma Mbeki", description: "Refuel Lounge guest identified in the public Voice Lounge catalogue as an entrepreneur, philanthropist and musician.", source: "research" },
  { slug: "goldmax", name: "Goldmax", aliases: ["Gold Max"], description: "Music guest identified in the Voice Lounge release record through a Refuel Lounge interview.", source: "research" },
  { slug: "woza-bakzin", name: "Woza Bakzin", description: "Music guest identified in the Voice Lounge release record through a Refuel Lounge interview.", source: "research" },
  { slug: "apostle-s-khoza", name: "Apostle S Khoza", description: "Named principal voice in a Voice Lounge on-demand catalogue item recovered in the public research baseline.", source: "research" },
  { slug: "mawande-oscar-makalima", name: "Mawande Oscar Makalima", description: "Financial analyst featured in The New Economy, discussing how international conflict and macroeconomic change can affect household finances.", links: [{ label: "LinkedIn", url: "https://za.linkedin.com/in/mawande-oscar-makalima-239aba11", kind: "linkedin" }], source: "legacy" },
];

const GUEST_PATTERN = /(?:guest|joins?|joined by|featuring|features|ft\.?)[\s:–—-]+([A-Z][A-Za-zÀ-ÿ'’.-]+(?:\s+(?:[A-Z][A-Za-zÀ-ÿ'’.-]+|[A-Z]\.?)){0,3})/g;
const BLOCKED = new Set([
  "the voice lounge",
  "voice lounge",
  "the breakfast plug",
  "beyond the grey",
  "refuel lounge",
  "spirit truth",
  "spirit and truth",
]);

function aliasesFor(profile: GuestProfile) {
  return [profile.name, ...(profile.aliases ?? [])].map(normalizeProgrammeText);
}

export function videosForGuest(videos: YouTubeFeedVideo[], guest: GuestProfile) {
  const aliases = aliasesFor(guest);
  return videos.filter((video) => {
    const haystack = normalizeProgrammeText(`${video.title} ${video.description}`);
    return aliases.some((alias) => alias.length > 2 && haystack.includes(alias));
  });
}

export function buildGuestDirectory(videos: YouTubeFeedVideo[]) {
  const profiles = new Map<string, GuestProfile>();
  for (const guest of VERIFIED_GUESTS) profiles.set(guest.slug, guest);

  for (const video of videos) {
    const searchable = `${video.title}\n${video.description}`;
    for (const match of searchable.matchAll(GUEST_PATTERN)) {
      const name = match[1]?.replace(/\s+/g, " ").trim();
      if (!name) continue;
      const normalized = normalizeProgrammeText(name);
      if (name.length < 4 || BLOCKED.has(normalized)) continue;
      if (VERIFIED_GUESTS.some((guest) => aliasesFor(guest).includes(normalized))) continue;
      const slug = slugifyGuest(name);
      if (!slug || profiles.has(slug)) continue;
      profiles.set(slug, {
        slug,
        name,
        description: "Guest detected from public metadata on the official Voice Lounge YouTube channel. Additional profile details can be added when verified.",
        source: "youtube",
      });
    }
  }

  return [...profiles.values()]
    .map((guest) => {
      const appearances = videosForGuest(videos, guest);
      return {
        ...guest,
        image: guest.image ?? appearances[0]?.thumbnail ?? null,
        appearanceCount: appearances.length,
      };
    })
    .sort((a, b) => (b.appearanceCount - a.appearanceCount) || a.name.localeCompare(b.name));
}

export function guestBySlug(videos: YouTubeFeedVideo[], slug: string) {
  return buildGuestDirectory(videos).find((guest) => guest.slug === slug) ?? null;
}
