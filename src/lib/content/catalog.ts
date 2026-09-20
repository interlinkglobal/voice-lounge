import type {
  Category,
  Collection,
  Creator,
  Episode,
  LiveEvent,
  NewsArticle,
  Podcast,
  SubscriptionPlan,
  UserProfile,
} from "./types";

const slugify = (value: string) =>
  value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const CATEGORY_DEFS: Array<[string, string, Category["accent"], number]> = [
  ["News & Politics", "Current affairs, public life and Eastern Cape conversations.", "ink", 2],
  ["Interviews & Culture", "Long-form conversations, culture and community voices.", "green", 5],
  ["Music & Entertainment", "Artists, sessions, DJs and entertainment conversations.", "gold", 3],
  ["Sport", "Sports conversation from The Voice Lounge.", "green", 1],
  ["Faith & Spirituality", "Faith, fellowship and spiritual reflection.", "ink", 5],
  ["Community & Development", "Learning, youth and community development.", "green", 1],
  ["Lifestyle", "Lifestyle conversation and weekend programming.", "gold", 1],
];

export const categories: Category[] = CATEGORY_DEFS.map(([name, blurb, accent, count], index) => ({
  id: `cat-${index + 1}`,
  slug: slugify(name),
  name,
  blurb,
  accent,
  count,
}));

const CATEGORY_ID = Object.fromEntries(categories.map((item) => [item.name, item.id])) as Record<string, string>;

const CREATOR_DEFS: Array<{
  id: string;
  name: string;
  role: string;
  bio: string;
  shows?: string[];
  image?: string;
}> = [
  { id: "network", name: "The Voice Lounge", role: "East London media network", bio: "The Eastern Cape's Voice, Amplified — an East London multimedia organisation spanning radio, podcasts, studio production, editorial work, mobile apps and commercial media.", shows: [] },
  { id: "miss-vee", name: "Miss Vee", role: "Presenter", bio: "Presenter named on The Voice Lounge's current public programme schedule.", shows: [] },
  { id: "garth-ah-mook", name: "Garth Ah-Mook", role: "Presenter / music contributor", bio: "Presenter named on The Voice Lounge schedule and in the public on-demand catalogue.", shows: [] },
  { id: "baby-obuhle-sihu", name: "Baby Obuhle Sihu", role: "Host, Beyond The Grey", bio: "Host associated publicly with Beyond The Grey and Connect & Learn.", shows: ["pod-beyond-the-grey", "pod-connect-and-learn"], image: "/politics-beyond-the-grey-by-baby-obuhle-sihu.png" },
  { id: "zan", name: "Zan", role: "Host, Refuel Lounge", bio: "Voice Lounge presenter associated with Refuel Lounge.", shows: ["pod-refuel-lounge"], image: "/comedy-refuel-lounge.png" },
  { id: "brian", name: "Brian", role: "Presenter", bio: "Presenter named on The Voice Lounge's current public programme schedule.", shows: [] },
  { id: "asanda-magaqa", name: "Asanda Magaqa", role: "Presenter", bio: "Presenter named on The Voice Lounge's current public programme schedule.", shows: [] },
  { id: "tsepang", name: "Tsepang", role: "Presenter", bio: "Presenter named on The Voice Lounge's current public programme schedule.", shows: [] },
  { id: "narcho-mabizela", name: "Narcho Mabizela", role: "Presenter", bio: "Presenter named on the official schedule. Public catalogue copy also contains the spelling “Nacho Mabizela”; the canonical spelling remains subject to management confirmation.", shows: [] },
  { id: "sasa-mapolisa", name: "Sasa Mapolisa", role: "Presenter", bio: "Presenter named on The Voice Lounge's current public programme schedule.", shows: [] },
  { id: "tsepo-nontyi", name: "Tsepo Nontyi", role: "Presenter", bio: "Presenter named on The Voice Lounge's public schedule and on-demand catalogue.", shows: [], image: "/lifestyle-the-trial-lounge-tsepo-nontyi.png" },
  { id: "tsepang-liphapang", name: "Tsepang Liphapang", role: "Presenter", bio: "Presenter named on The Voice Lounge's current public programme schedule.", shows: [], image: "/lifestyle-tsepang-liphapang.png" },
  { id: "pastor-mafaya", name: "Pastor Mafaya", role: "Presenter", bio: "Presenter named on The Voice Lounge's current public programme schedule.", shows: [] },
  { id: "pastor-jaytee", name: "Pastor Jaytee", role: "Presenter", bio: "Presenter named on The Voice Lounge's current public programme schedule.", shows: [] },
  { id: "pastor-gugu", name: "Pastor Gugu", role: "Presenter", bio: "Presenter named on The Voice Lounge schedule; the public catalogue also features Pastor Gugu Mbuku.", shows: [] },
];

export const creators: Creator[] = CREATOR_DEFS.map((item) => ({
  id: `crt-${item.id}`,
  slug: slugify(item.name),
  name: item.name,
  role: item.role,
  city: "East London",
  province: "Eastern Cape",
  bio: item.bio,
  followers: 0,
  shows: item.shows ?? [],
  verified: undefined,
  artwork: {
    seed: `person-${item.id}`,
    src: item.image,
    alt: item.image ? `Portrait of ${item.name}` : `The Voice Lounge profile placeholder for ${item.name}`,
    ratio: "1/1",
  },
}));

const SHOW_DEFS: Array<{
  id: string;
  title: string;
  category: string;
  tagline: string;
  creator?: string;
}> = [
  { id: "breakfast-plug", title: "The Breakfast Plug", category: "News & Politics", tagline: "A recurring Voice Lounge programme with public catalogue entries covering daily news and practical current-affairs conversations." },
  { id: "beyond-the-grey", title: "Beyond The Grey", category: "News & Politics", tagline: "Current affairs, politics, community issues and long-form conversation.", creator: "baby-obuhle-sihu" },
  { id: "refuel-lounge", title: "Refuel Lounge", category: "Music & Entertainment", tagline: "A recurring Voice Lounge programme with music and entertainment conversations.", creator: "zan" },
  { id: "3-2-6-lounge", title: "3-2-6 Lounge", category: "Interviews & Culture", tagline: "A recurring programme listed on The Voice Lounge's official schedule." },
  { id: "the-voicelounge-sitting", title: "The VoiceLounge Sitting", category: "Interviews & Culture", tagline: "A recurring programme listed on The Voice Lounge's official schedule." },
  { id: "sports-lounge", title: "The Sports Lounge", category: "Sport", tagline: "The Voice Lounge's sports programme." },
  { id: "after-dark-lounge", title: "After Dark Lounge", category: "Interviews & Culture", tagline: "A recurring programme listed on The Voice Lounge's official schedule." },
  { id: "spirit-and-truth", title: "Spirit & Truth", category: "Faith & Spirituality", tagline: "Faith and spiritual conversation from The Voice Lounge." },
  { id: "triumph-lounge", title: "The Triumph Lounge", category: "Interviews & Culture", tagline: "A recurring Voice Lounge conversation programme." },
  { id: "solitude-lounge", title: "Solitude Lounge", category: "Interviews & Culture", tagline: "A recurring programme listed on The Voice Lounge's official schedule." },
  { id: "connect-and-learn", title: "Connect & Learn", category: "Community & Development", tagline: "Learning and community-development programming from The Voice Lounge.", creator: "baby-obuhle-sihu" },
  { id: "weekend-gateaway", title: "The Weekend Gateaway", category: "Lifestyle", tagline: "A weekend programme listed on the current public schedule; spelling follows the source and should be confirmed by management." },
  { id: "music-lounge", title: "The Music Lounge", category: "Music & Entertainment", tagline: "Music programming from The Voice Lounge." },
  { id: "logos-moment", title: "The Logos Moment", category: "Faith & Spirituality", tagline: "A faith-focused programme listed on the current public schedule." },
  { id: "grace-connection", title: "The Grace Connection", category: "Faith & Spirituality", tagline: "A faith-focused programme listed on the current public schedule." },
  { id: "chapter-lounge", title: "The Chapter Lounge", category: "Interviews & Culture", tagline: "A recurring programme listed on The Voice Lounge's official schedule." },
  { id: "rhythm-and-sound-lounge", title: "Rhythm & Sound Lounge", category: "Music & Entertainment", tagline: "Music programming listed on The Voice Lounge's current public schedule." },
  { id: "koinonia-the-fellowship", title: "Koinonia — The Fellowship", category: "Faith & Spirituality", tagline: "A recurring Sunday spiritual-reflection and biblical-teaching programme." },
];

export const podcasts: Podcast[] = SHOW_DEFS.map((item) => ({
  id: `pod-${item.id}`,
  slug: slugify(item.title),
  title: item.title,
  tagline: item.tagline,
  description: `${item.tagline} The programme is part of the public Voice Lounge schedule in East London, Eastern Cape.`,
  categoryId: CATEGORY_ID[item.category] ?? CATEGORY_ID["Interviews & Culture"],
  creatorId: item.creator ? `crt-${item.creator}` : "crt-network",
  language: "English",
  province: "Eastern Cape",
  format: "Hybrid",
  episodeCount: 0,
  rating: 0,
  plays: 0,
  isOriginal: true,
  isPremium: undefined,
  artwork: { seed: `show-${item.id}`, alt: `${item.title} — The Voice Lounge`, ratio: "1/1" },
}));

const EPISODE_DEFS: Array<{
  id: string;
  title: string;
  description: string;
  podcastId?: string;
  publishedAt?: string;
}> = [
  { id: "lee-generes-music-journey", title: "Lee Generes joins Narcho Mabizela for a conversation about her music journey", description: "Music journey, identity, ambition, entertainment and social-media rise." },
  { id: "sivenathi-nazo-ward-18", title: "Beyond The Grey — Sivenathi Nazo | Ward 18 Councillor Candidate", description: "Local issues, community priorities and ward representation.", podcastId: "pod-beyond-the-grey" },
  { id: "siyanda-vazi-ubomi-foundation", title: "The Triumph — Mr Siyanda Vazi, Ubomi Foundation Founder", description: "A conversation about Ubomi Foundation's child and community-development work.", podcastId: "pod-triumph-lounge" },
  { id: "breakfast-plug-national-wills-week", title: "The Breakfast Plug — National Wills Week", description: "Wills, estate planning, protecting family and legacy.", podcastId: "pod-breakfast-plug" },
  { id: "sihle-peter-cwenga-presidents-letter", title: "Beyond The Grey — Sihle Peter Cwenga: Breaking Down the President's Recent Letter", description: "Discussion of the President's letter and issues raised in it.", podcastId: "pod-beyond-the-grey" },
  { id: "khanya-makhaphela-tsepo-nontyi", title: "Khanya Makhaphela sits down with Tsepo Nontyi", description: "Accounting career, professional challenges and opportunities, and owning an accounting firm." },
  { id: "khanya-sakube-beyond-the-grey", title: "Beyond The Grey — Khanya Sakube", description: "Youth development, community-building and constructive recreational spaces.", podcastId: "pod-beyond-the-grey" },
  { id: "miss-vee-garth-daily-news-round-up", title: "Miss Vee and Garth — Daily News Round Up", description: "A daily and current-news roundup from The Voice Lounge." },
  { id: "kuyasa-kela-art-tradition", title: "Beyond The Grey — Kuyasa Kela: Can art challenge tradition?", description: "Visual art, Xhosa identity, culture, heritage and challenging convention.", podcastId: "pod-beyond-the-grey" },
  { id: "vuyisa-mnyabiso-feeding-centre", title: "Beyond The Grey — Vuyisa Mnyabiso", description: "Community feeding work serving more than 200 homeless people weekly.", podcastId: "pod-beyond-the-grey" },
  { id: "sesethu-righteous-redeemer-live", title: "Live Performance by Sesethu — Righteous Redeemer", description: "A Voice Lounge live performance by Sesethu-Isipho Maneli." },
  { id: "tvl-breakfast-plug", title: "TVL The Breakfast Plug", description: "Daily-news headlines and roundup.", podcastId: "pod-breakfast-plug" },
  { id: "pastor-gugu-mbuku-spiritual-empowerment", title: "Pastor Gugu Mbuku — spiritual empowerment", description: "Spiritual empowerment, transitions, personal limitations and themes from I Had To Leave To Live." },
  { id: "garth-ah-mook-music-session", title: "Garth Ah-Mook Music Session", description: "An underground-house music session." },
  { id: "koinonia-pastor-tetese", title: "Koinonia on The Voice Lounge — Pastor Tetese", description: "Spiritual reflection and teaching around 1 Samuel 17:34.", podcastId: "pod-koinonia-the-fellowship" },
  { id: "koinonia-sunday-reflection", title: "Koinonia on The Voice Lounge", description: "Recurring Sunday spiritual reflection and biblical teaching.", podcastId: "pod-koinonia-the-fellowship" },
  { id: "duke-maplanka-rainbow-nation", title: "That image of the rainbow nation and ubuntu is gone?", description: "Migration, South African politics, human rights and ubuntu." },
  { id: "joshua-maponga-faith-spirituality", title: "Joshua Maponga on faith, religion and African spirituality", description: "Faith, African spirituality and biblical origins and interpretation." },
  { id: "joshua-maponga-country", title: "What do you know about your country? — Joshua Maponga", description: "African identity, spirituality and faith." },
  { id: "0CBa4S4FpzM", title: "From Mayibuye to Mabahambe | Joshua Maponga", description: "Faith, identity, African philosophy, geopolitics and leadership.", publishedAt: "2026-07-01T00:00:00.000Z" },
  { id: "joshua-maponga-wars-profitable", title: "Wars are profitable — Joshua Maponga", description: "A Voice Lounge catalogue conversation featuring Joshua Maponga." },
  { id: "ku-gompo-march-protest", title: "March and March protest in Ku-Gompo", description: "A Voice Lounge catalogue item covering a protest in Ku-Gompo." },
  { id: "state-v-mlindelwa-tyekana-family", title: "The State vs Mlindelwa “Man B” Tyekana — victim family", description: "A Voice Lounge catalogue item concerning the case and the victim's family." },
  { id: "glorious-sunday-sasa", title: "A glorious Sunday morning with Sasa", description: "A Sunday Voice Lounge catalogue item featuring Sasa." },
  { id: "malacosta", title: "Malacosta", description: "A title currently exposed in The Voice Lounge's public on-demand catalogue; further metadata remains unspecified." },
  { id: "the-new-economy", title: "The New Economy", description: "A title currently exposed in The Voice Lounge's public on-demand catalogue; further metadata remains unspecified." },
  { id: "apostle-s-khoza", title: "Apostle S Khoza", description: "A Voice Lounge catalogue item featuring Apostle S Khoza." },
];

export const episodes: Episode[] = EPISODE_DEFS.map((item, index) => ({
  id: item.id,
  slug: slugify(item.title),
  title: item.title,
  description: item.description,
  podcastId: item.podcastId ?? "",
  number: index + 1,
  season: 1,
  durationSec: 0,
  publishedAt: item.publishedAt ?? "",
  kind: "video",
  plays: 0,
  language: "English",
  artwork: { seed: `show-episode-${item.id}`, alt: item.title, ratio: "16/9" },
  mediaUrl: "",
  transcriptAvailable: false,
  isPremium: undefined,
}));

export const news: NewsArticle[] = [
  {
    id: "legacy-udm-buffalo-city-candidate-list",
    slug: "udm-heads-to-court-over-buffalo-city-candidate-list-snub",
    headline: "UDM heads to court over Buffalo City candidate list snub",
    standfirst: "The UDM said it would pursue legal remedies after its Buffalo City ward candidates were absent from the IEC's certified candidate list for the 4 November 2026 local government elections.",
    body: [
      "The UDM said its Buffalo City ward candidates were missing from the Electoral Commission's certified candidate list, leaving deputy president and mayoral candidate Nqabayomzi Kwankwa as the party's candidate on the proportional-representation list.",
      "Kwankwa said the party had not abandoned its ward candidates and attributed the omission to problems in the candidate-list process. He said the UDM would continue campaigning while pursuing available legal channels.",
      "Daily Dispatch reported that UDM president Bantu Holomisa had written to the IEC seeking a resolution and that the party intended to allow the courts to determine the dispute.",
    ],
    section: "News",
    author: "Daily Dispatch",
    publishedAt: "2026-09-18T12:01:00.000+02:00",
    readingMinutes: 2,
    artwork: {
      seed: "legacy-udm-buffalo-city",
      src: "https://www.thevoicelounge.co.za/images/content_6aad3c75a4489.avif",
      alt: "UDM Buffalo City candidate-list story from the legacy Voice Lounge news archive",
      ratio: "16/9",
    },
    sourceLabel: "Daily Dispatch",
    sourceUrl: "https://www.dailydispatch.co.za/news/2026-09-18-udm-heads-to-court-over-buffalo-city-candidate-list-snub/",
    featured: true,
  },
  {
    id: "legacy-protection-orders-opinion",
    slug: "sa-must-learn-from-best-practices-to-strengthen-protection-orders",
    headline: "SA must learn from best practices to strengthen protection orders",
    standfirst: "A Daily Dispatch opinion column argued that South Africa should strengthen the enforcement and monitoring systems behind protection orders used in gender-based-violence cases.",
    body: [
      "In a Daily Dispatch opinion column, Makgwathane Mothapo argued that South Africa's protection-order framework is weakened by inconsistent implementation and enforcement, particularly in cases involving gender-based violence and femicide.",
      "The column referred to public calls for stronger implementation made during commemorative events for Uyinene Mrwetyana and discussed international approaches used in Spain and Australia, including centralised monitoring and risk-management systems.",
      "The proposals in the column are the author's analysis and recommendations, not findings adopted independently by The Voice Lounge. The original publication remains the source for the complete argument and supporting examples.",
    ],
    section: "Opinion",
    author: "Makgwathane Mothapo",
    publishedAt: "2026-09-18T12:29:00.000+02:00",
    readingMinutes: 2,
    artwork: {
      seed: "legacy-protection-orders",
      src: "https://www.thevoicelounge.co.za/images/content_6aad34eb4b687.avif",
      alt: "Protection-orders opinion story from the legacy Voice Lounge news archive",
      ratio: "16/9",
    },
    sourceLabel: "Daily Dispatch",
    sourceUrl: "https://www.dailydispatch.co.za/news/opinion/2026-09-18-sa-must-learn-from-best-practices-to-strengthen-protection-orders/",
    featured: true,
  },
  {
    id: "legacy-nqwazi-disciplinary-process",
    slug: "nqwazis-long-delayed-disciplinary-process-found-to-be-defective",
    headline: "Nqwazi’s long-delayed disciplinary process found to be defective",
    standfirst: "A disciplinary chair found that Nelson Mandela Bay municipality had not followed required regulations in proceedings against suspended city manager Noxolo Nqwazi.",
    body: [
      "The Herald reported that disciplinary chair Prof Adriaan van der Walt found the municipality had failed to comply with Section 5 of the Local Government: Disciplinary Regulations for Senior Managers, 2010.",
      "The ruling found that council had not made the required determination about whether the alleged misconduct was serious, and that required authorisation for the appointment of the presiding officer and evidence leader was also absent.",
      "The existing proceedings were terminated. The ruling did not prevent the municipality from beginning a new process that complies with the applicable regulations.",
    ],
    section: "Politics",
    author: "The Herald",
    publishedAt: "2026-09-18T08:24:00.000+02:00",
    readingMinutes: 2,
    artwork: {
      seed: "legacy-nqwazi-disciplinary",
      src: "https://www.thevoicelounge.co.za/images/content_6aad2ce7c7735.avif",
      alt: "Noxolo Nqwazi disciplinary-process story from the legacy Voice Lounge news archive",
      ratio: "16/9",
    },
    sourceLabel: "The Herald",
    sourceUrl: "https://www.theherald.co.za/politics/2026-09-18-nqwazis-long-delayed-disciplinary-process-found-to-be-defective/",
    featured: true,
  },
  {
    id: "news-station-manager-2025",
    slug: "veteran-radio-manager-signs-up-with-the-voice-lounge",
    headline: "Daily Dispatch profiles The Voice Lounge station manager",
    standfirst: "November 2025 reporting documented Thobeka Buswana's appointment, the August 2025 online-radio launch and the organisation's early growth.",
    body: [
      "Daily Dispatch reported on 6 November 2025 that veteran broadcaster Thobeka Buswana had joined The Voice Lounge as station manager.",
      "The same report records that the online-radio operation went live on 1 August 2025 and described a 22-person team including presenters and technical staff at that time.",
      "Current employment status should be reconfirmed with management before presenting a permanent 2026 leadership biography.",
    ],
    section: "Press",
    author: "Daily Dispatch",
    publishedAt: "2025-11-06T00:00:00.000Z",
    readingMinutes: 2,
    artwork: { seed: "press-station-manager", alt: "Press coverage of The Voice Lounge", ratio: "16/9" },
    featured: true,
  },
  {
    id: "news-sesethu-signing",
    slug: "sesethu-maneli-first-voice-lounge-label-signing",
    headline: "Sesethu Maneli becomes The Voice Lounge label's first reported signing",
    standfirst: "March 2026 reporting documented the brand's expansion from podcasting into radio, studio operations and record-label activity.",
    body: [
      "Daily Dispatch reported on 20 March 2026 that Sesethu Maneli became the first artist signed to The Voice Lounge's newly launched record label.",
      "The reporting also documented management's account that The Voice Lounge began as a podcast before expanding into online radio and recording-studio operations.",
    ],
    section: "Press",
    author: "Daily Dispatch",
    publishedAt: "2026-03-20T00:00:00.000Z",
    readingMinutes: 2,
    artwork: { seed: "press-sesethu-signing", alt: "Press coverage of Sesethu Maneli and The Voice Lounge", ratio: "16/9" },
    featured: true,
  },
  {
    id: "news-sesethu-live-recording",
    slug: "voice-lounge-live-recording-sesethu-maneli",
    headline: "Voice Lounge recording project with Sesethu Maneli receives press coverage",
    standfirst: "April 2026 coverage described a Voice Lounge-produced live recording and the organisation's artist-development ambitions.",
    body: [
      "Daily Dispatch reported on 28 April 2026 on a Voice Lounge-produced live recording involving Sesethu Maneli.",
      "The report records management's stated ambition to create a pathway for Eastern Cape artists.",
    ],
    section: "Press",
    author: "Daily Dispatch",
    publishedAt: "2026-04-28T00:00:00.000Z",
    readingMinutes: 2,
    artwork: { seed: "press-sesethu-live-recording", alt: "Press coverage of a Voice Lounge recording project", ratio: "16/9" },
    featured: true,
  },
  {
    id: "news-herald-sesethu",
    slug: "the-herald-covers-sesethu-maneli-releases",
    headline: "The Herald covers Voice Lounge artist development",
    standfirst: "July 2026 coverage provides another public signal of The Voice Lounge's record-label and artist-development activity.",
    body: [
      "The Herald published coverage on 6 July 2026 concerning Sesethu Maneli and new releases associated with the Voice Lounge artist-development story.",
      "The item supports the wider public record that The Voice Lounge now operates beyond a podcast catalogue.",
    ],
    section: "Press",
    author: "The Herald",
    publishedAt: "2026-07-06T00:00:00.000Z",
    readingMinutes: 2,
    artwork: { seed: "press-herald-sesethu", alt: "The Herald coverage associated with The Voice Lounge", ratio: "16/9" },
  },
];

export const liveEvents: LiveEvent[] = [];

export const collections: Collection[] = [
  {
    id: "col-joshua-maponga",
    slug: "joshua-maponga-conversations",
    title: "Joshua Maponga conversations",
    blurb: "A research-backed cluster of Voice Lounge catalogue conversations on identity, faith, spirituality, geopolitics and leadership.",
    curator: "The Voice Lounge",
    itemIds: ["joshua-maponga-faith-spirituality", "joshua-maponga-country", "0CBa4S4FpzM", "joshua-maponga-wars-profitable"],
    tone: "gold",
  },
  {
    id: "col-beyond-grey",
    slug: "beyond-the-grey",
    title: "Beyond The Grey",
    blurb: "Public catalogue conversations connected to Beyond The Grey.",
    curator: "The Voice Lounge",
    itemIds: ["sivenathi-nazo-ward-18", "sihle-peter-cwenga-presidents-letter", "khanya-sakube-beyond-the-grey", "kuyasa-kela-art-tradition", "vuyisa-mnyabiso-feeding-centre"],
    tone: "green",
  },
];

export const plans: SubscriptionPlan[] = [
  {
    id: "plan-public",
    name: "Public access",
    priceZar: 0,
    cadence: "month",
    summary: "Browse the public website and official Voice Lounge video catalogue.",
    perks: ["Public website access", "Official YouTube catalogue", "Voice Lounge programme discovery"],
  },
  {
    id: "plan-premium",
    name: "Premium",
    priceZar: 9.99,
    cadence: "month",
    summary: "The publicly advertised Voice Lounge premium price after a seven-day trial.",
    perks: [
      "7-day trial",
      "Uninterrupted live streaming",
      "Studio audio",
      "Exclusive podcasts",
      "Premium podcast back-catalogues",
      "Broadcaster shout-out functionality",
      "Real-time notifications and reminders",
    ],
    highlight: true,
  },
];

export const demoProfile: UserProfile = {
  id: "profile-placeholder",
  displayName: "Member",
  handle: "",
  city: "",
  memberSince: "",
  premium: false,
  languages: [],
  minutesListened: 0,
};

export const podcastById = (id: string) => podcasts.find((p) => p.id === id);
export const creatorById = (id: string) => creators.find((c) => c.id === id);
export const categoryById = (id: string) => categories.find((c) => c.id === id);
export const episodeById = (id: string) => episodes.find((e) => e.id === id);
export const podcastBySlug = (slug: string) => podcasts.find((p) => p.slug === slug);
export const newsBySlug = (slug: string) => news.find((n) => n.slug === slug);
export const creatorBySlug = (slug: string) => creators.find((c) => c.slug === slug);

export function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

export const between = (seed: string, min: number, max: number) =>
  Math.floor(min + hash(seed) * (max - min));

export const pick = <T,>(arr: readonly T[], seed: string): T =>
  arr[Math.floor(hash(seed) * arr.length) % arr.length];
