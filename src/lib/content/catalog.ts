import type {
  Category,
  Collection,
  Creator,
  Episode,
  LiveEvent,
  NewsArticle,
  Podcast,
  SALanguage,
  Province,
  SubscriptionPlan,
  UserProfile,
} from "./types";

/* ------------------------------------------------------------------
   Deterministic pseudo-randomness (SSR-safe: no Math.random anywhere)
   ------------------------------------------------------------------ */

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

const pick = <T,>(arr: readonly T[], seed: string): T => arr[Math.floor(hash(seed) * arr.length) % arr.length];
const between = (seed: string, min: number, max: number) => Math.floor(min + hash(seed) * (max - min));

/* ------------------------------------------------------------------
   Categories
   ------------------------------------------------------------------ */

const CATEGORY_DEFS: Array<[string, string, Category["accent"]]> = [
  ["Business", "Boardroom strategy, markets and the people moving capital.", "gold"],
  ["Entrepreneurship", "Founders building in Joburg, Cape Town and beyond.", "green"],
  ["Technology", "Fintech, AI, infrastructure and the African internet.", "green"],
  ["Sport", "Rugby, football, cricket and the noise in between.", "green"],
  ["Music", "Amapiano, jazz, gospel and the studios behind them.", "gold"],
  ["Entertainment", "Screens, stages and the industry that feeds them.", "gold"],
  ["Comedy", "Stand-up, satire and hosts who cannot be trusted.", "green"],
  ["Society & Culture", "Identity, cities, history and the arguments we keep having.", "ink"],
  ["News", "Daily briefings and long memory on the national story.", "ink"],
  ["Education", "Learning, campuses and the skills economy.", "green"],
  ["Lifestyle", "Food, style, travel and how we actually live.", "gold"],
  ["Health & Wellness", "Bodies, minds, clinics and quiet recoveries.", "green"],
  ["Relationships", "Love, family and the conversations nobody records.", "gold"],
  ["Faith & Spirituality", "Belief, practice and community life.", "ink"],
  ["African Stories", "Continental history, migration and memory.", "gold"],
  ["Youth & Campus", "Student voices and the next working generation.", "green"],
  ["Film & Television", "Production, commissioning and the local screen trade.", "ink"],
  ["Motoring", "Cars, roads and the long drive to Durban.", "ink"],
];

export const categories: Category[] = CATEGORY_DEFS.map(([name, blurb, accent], i) => ({
  id: `cat-${i + 1}`,
  slug: name.toLowerCase().replace(/[^a-z]+/g, "-"),
  name,
  blurb,
  accent,
  count: between(`cat${name}`, 34, 480),
}));

/* ------------------------------------------------------------------
   Creators
   ------------------------------------------------------------------ */

const CREATOR_DEFS: Array<[string, string, string, Province, string]> = [
  ["Thandiwe Mokoena", "Host, The Rand Room", "Johannesburg", "Gauteng", "Former markets reporter who now explains the economy without the jargon tax."],
  ["Sipho Radebe", "Host, Kasi Frequencies", "Soweto", "Gauteng", "Documents township music economies and the producers who built them."],
  ["Lerato Khumalo", "Creator & Producer", "Sandton", "Gauteng", "Built The Voice Lounge's interview strand and still cuts her own tape."],
  ["Riaan de Villiers", "Host, Tafel Gesprekke", "Stellenbosch", "Western Cape", "Afrikaans long-form conversation with farmers, chefs and novelists."],
  ["Naledi Motaung", "Host, Second Draft", "Cape Town", "Western Cape", "Writers, editors and the fight for a local publishing industry."],
  ["Ayanda Zulu", "Host, Full Time Feelings", "Durban", "KwaZulu-Natal", "Football obsessive. Opinions delivered at pace, receipts attached."],
  ["Kegomoditswe Sello", "Host, Build It Here", "Mahikeng", "North West", "Small-business operator turned interviewer of small-business operators."],
  ["Farhana Ismail", "Investigative Producer", "Cape Town", "Western Cape", "Long-form accountability reporting for audio."],
  ["Bongani Mthembu", "Host, The Long Reply", "Pietermaritzburg", "KwaZulu-Natal", "Slow interviews. One guest, ninety minutes, no rush."],
  ["Chuma Nomvete", "Host, Ekhaya Nights", "Gqeberha", "Eastern Cape", "Late-night culture show recorded in front of a small live room."],
  ["Mpho Dlamini", "Host, Code & Country", "Midrand", "Gauteng", "Engineer covering African fintech infrastructure and platform policy."],
  ["Zanele Ncube", "Host, Clinic Hours", "Bloemfontein", "Free State", "A doctor's notebook on public health, burnout and rural care."],
  ["Jaco Pretorius", "Host, Hard Shoulder", "Centurion", "Gauteng", "Motoring, logistics and the state of the N1."],
  ["Nontobeko Sithole", "Host, Ubuntu Business", "Richards Bay", "KwaZulu-Natal", "Industrial towns, labour and the people who keep ports open."],
  ["Kabelo Moloi", "Comedian & Host", "Tembisa", "Gauteng", "Stand-up who interviews other comedians badly, on purpose."],
  ["Aisha Patel", "Host, Frequency Files", "Umhlanga", "KwaZulu-Natal", "Music documentary series on South African record-making."],
  ["Tshepo Maake", "Host, Campus Signal", "Polokwane", "Limpopo", "Student politics, graduate unemployment and first jobs."],
  ["Lindiwe Booysen", "Host, Table of Two", "Paarl", "Western Cape", "Relationships, family and the things said after the guests leave."],
  ["Sanele Ndlovu", "Host, Faith in Practice", "Nelspruit", "Mpumalanga", "Congregational life, ethics and public belief."],
  ["Refilwe Sibiya", "Host, The Handover", "Kimberley", "Northern Cape", "Succession, family firms and mining-town economies."],
  ["Vuyo Mahlangu", "Host, Screen Test", "Johannesburg", "Gauteng", "Commissioning, production budgets and the local screen trade."],
  ["Hlengiwe Zwane", "Host, Amapiano Archive", "Katlehong", "Gauteng", "Tracks the genre's producers, sample culture and touring economics."],
  ["Dumisani Khoza", "Host, Court of Appeal", "Pretoria", "Gauteng", "Law, courts and constitutional argument for non-lawyers."],
  ["Michelle Adams", "Host, The Quiet Hour", "Knysna", "Western Cape", "Wellness, sleep and slow living without the supplements pitch."],
];

export const creators: Creator[] = CREATOR_DEFS.map(([name, role, city, province, bio], i) => ({
  id: `crt-${i + 1}`,
  slug: name.toLowerCase().replace(/[^a-z]+/g, "-"),
  name,
  role,
  city,
  province,
  bio,
  followers: between(`flw${name}`, 1800, 184000),
  shows: [],
  verified: hash(`ver${name}`) > 0.42,
  artwork: { seed: `creator-${name}`, alt: `Portrait of ${name}`, ratio: "1/1" },
}));

/* ------------------------------------------------------------------
   Podcasts
   ------------------------------------------------------------------ */

const PODCAST_DEFS: Array<[string, string, string, string]> = [
  ["The Rand Room", "Business", "Markets, policy and the rand — decoded weekly.", "A weekly reading of the numbers that move South African households, from repo decisions to grocery inflation, with the analysts who actually price the risk."],
  ["Build It Here", "Entrepreneurship", "Founders on what the pitch decks leave out.", "Operators talk cash flow, hiring mistakes and the unglamorous middle of building a company outside a funding bubble."],
  ["Code & Country", "Technology", "African fintech, platforms and the rails beneath them.", "Payment infrastructure, data policy and the engineers quietly building the continent's transaction layer."],
  ["Full Time Feelings", "Sport", "PSL, Bafana and the arguments that never end.", "A fast football show for people who watch every match and still want to shout about it afterwards."],
  ["Amapiano Archive", "Music", "The genre, its producers and its paperwork.", "Sample clearance, log drums, touring economics and oral history from the people who built the sound."],
  ["Screen Test", "Film & Television", "Inside the South African screen trade.", "Commissioners, producers and showrunners on budgets, co-productions and why good scripts stall."],
  ["Kabelo Interrupts", "Comedy", "Comedians interviewed badly, deliberately.", "Kabelo Moloi derails his own guests for an hour. Occasionally a real conversation breaks out."],
  ["Kasi Frequencies", "Society & Culture", "Township music economies, block by block.", "Producers, promoters and sound engineers on how local scenes actually pay their bills."],
  ["The Long Reply", "Society & Culture", "One guest. Ninety minutes. No rush.", "Bongani Mthembu's patient interview strand, recorded in a single take with almost no edits."],
  ["Morning Brief SA", "News", "The national story in eighteen minutes.", "A weekday briefing on politics, courts and the economy, out before the 07:00 traffic report."],
  ["Second Draft", "Education", "Writers, editors and the local book trade.", "Craft conversations with novelists, poets and the editors who make their sentences shorter."],
  ["Clinic Hours", "Health & Wellness", "A doctor's notebook from the public sector.", "Dr Zanele Ncube on triage, burnout, rural clinics and what patients are never told."],
  ["Table of Two", "Relationships", "Honest conversations about love and family.", "Couples, therapists and the arguments people only admit to once the recorder stops."],
  ["Faith in Practice", "Faith & Spirituality", "Belief, ethics and congregational life.", "How faith communities handle money, grief, politics and the generation that stopped attending."],
  ["Ubuntu Business", "Business", "Ports, plants and industrial South Africa.", "Labour, logistics and the towns whose economies depend on a single employer."],
  ["Hard Shoulder", "Motoring", "Cars, freight and the state of the roads.", "Road tests, logistics economics and long-distance driving culture."],
  ["Campus Signal", "Youth & Campus", "Student politics and the first job.", "Registration queues, NSFAS, graduate unemployment and what a degree buys in 2026."],
  ["Ekhaya Nights", "Entertainment", "Late-night culture from Gqeberha.", "Music, comedy and unscripted conversation recorded in front of a small live audience."],
  ["Court of Appeal", "News", "Constitutional argument for non-lawyers.", "Judgments explained, precedent traced and the machinery of the courts made legible."],
  ["Frequency Files", "Music", "A documentary series on record-making.", "Each season follows one South African album from demo to master."],
  ["Tafel Gesprekke", "Society & Culture", "Afrikaanse gesprekke oor kos, land en storie.", "Boere, kokke en skrywers gesels lank en stadig oor werk, grond en gemeenskap."],
  ["The Handover", "Business", "Succession in family firms.", "Second- and third-generation owners on inheritance, conflict and letting go."],
  ["The Quiet Hour", "Health & Wellness", "Slow living without the supplement pitch.", "Sleep, attention and rest, treated as infrastructure rather than aesthetics."],
  ["Sisters in Studio", "Entrepreneurship", "Women building outside the funding bubble.", "Founders on bootstrapping, procurement, childcare and negotiating with banks."],
  ["Night Shift Stories", "Society & Culture", "The country between midnight and five.", "Nurses, security guards, DJs and bakers describe the hours most people sleep through."],
  ["The Fixture List", "Sport", "Rugby, cricket and the selection wars.", "Weekly tactical breakdowns with former players and the statisticians they distrust."],
  ["Mother Tongue", "African Stories", "Language, memory and the words we keep.", "Linguists, poets and grandparents on isiZulu, Sesotho, isiXhosa and what translation loses."],
  ["Deal Flow", "Business", "Private capital on the continent.", "Fund managers, term sheets and the African deals that closed or quietly died."],
  ["Studio 47", "Music", "Live sessions from a Braamfontein room.", "Three songs, one interview, recorded to tape in front of thirty people."],
  ["Plain Language", "Education", "Complicated things, explained once, properly.", "Economics, law and science unpacked without the seminar voice."],
  ["Gogo's Kitchen", "Lifestyle", "Food, memory and the recipes nobody wrote down.", "Cooks across nine provinces reconstruct family dishes and the histories attached to them."],
  ["The Commute", "News", "Twenty-five minutes, five stories, no filler.", "An afternoon wrap for the drive home, built for people who missed the news cycle."],
  ["Founders After Dark", "Entrepreneurship", "The failures founders only discuss late.", "Down rounds, co-founder splits and the businesses that did not survive."],
  ["Line of Play", "Sport", "The business of South African sport.", "Broadcast rights, sponsorship and the finances behind the fixtures."],
  ["Voices of the Karoo", "African Stories", "Small towns, big distances.", "Reporting from dorpies most national coverage drives straight past."],
  ["The Green Room", "Entertainment", "Backstage with performers before the lights.", "Actors, musicians and comedians, thirty minutes before they walk on."],
  ["Switchboard", "Technology", "The infrastructure nobody sees.", "Load-shedding, fibre, spectrum and the systems that keep the country online."],
  ["Homeground", "Lifestyle", "Cities, housing and where we live.", "Property, planning and what it now costs to be near work."],
  ["The Sunday Sermon Club", "Faith & Spirituality", "Belief, debated respectfully.", "A roundtable across traditions on ethics, doubt and public life."],
  ["Wired Youth", "Youth & Campus", "Growing up online in South Africa.", "Creators, teachers and teenagers on attention, safety and ambition."],
];

const LANGUAGES: SALanguage[] = ["English", "isiZulu", "isiXhosa", "Sesotho", "Setswana", "Afrikaans"];
const PROVINCES: Province[] = [
  "Gauteng",
  "Western Cape",
  "KwaZulu-Natal",
  "Eastern Cape",
  "Free State",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
];

export const podcasts: Podcast[] = PODCAST_DEFS.map(([title, catName, tagline, description], i) => {
  const cat = categories.find((c) => c.name === catName) ?? categories[0];
  const creator = creators[i % creators.length];
  return {
    id: `pod-${i + 1}`,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    title,
    tagline,
    description,
    categoryId: cat.id,
    creatorId: creator.id,
    language: title === "Tafel Gesprekke" ? "Afrikaans" : pick(LANGUAGES, `lang${title}`),
    province: pick(PROVINCES, `prov${title}`),
    format: pick(["Audio", "Video", "Hybrid"] as const, `fmt${title}`),
    episodeCount: between(`eps${title}`, 14, 240),
    rating: Number((4.1 + hash(`rate${title}`) * 0.85).toFixed(1)),
    plays: between(`play${title}`, 42000, 3400000),
    isOriginal: hash(`orig${title}`) > 0.62,
    isPremium: hash(`prem${title}`) > 0.82,
    artwork: { seed: `pod-${title}`, alt: `${title} podcast artwork`, ratio: "1/1" },
  };
});

creators.forEach((c) => {
  c.shows = podcasts.filter((p) => p.creatorId === c.id).map((p) => p.title);
});

/* ------------------------------------------------------------------
   Episodes
   ------------------------------------------------------------------ */

const EPISODE_TITLES: string[] = [
  "The repo decision nobody priced in",
  "What a Joburg water tariff actually funds",
  "Selling to government without losing your shirt",
  "The log drum went global. Who got paid?",
  "Three seasons, one commissioning brief",
  "Bafana's midfield problem, explained slowly",
  "Everything we got wrong about load-shedding tariffs",
  "A port town after the retrenchments",
  "The interview that took four years to land",
  "Why your medical aid changed its formulary",
  "Second-hand trucks and the freight squeeze",
  "First salary, no safety net",
  "Recording an album in nine days",
  "Constitutional Court, plain language edition",
  "The family business that refused to split",
  "Night shift at Baragwanath",
  "What the fixture list hides",
  "Grandmothers, grammar and lost verbs",
  "A down round, described honestly",
  "Braamfontein at 2am",
  "Fibre reached the street. Then what?",
  "Rent, commute, repeat",
  "Doubt, from three pulpits",
  "The teenager who monetised homework",
  "Karoo distances and the cost of petrol",
  "Thirty minutes before curtain",
  "The deal that died in due diligence",
  "Cooking for a house of eleven",
  "Five stories, no filler",
  "An editor's red pen, uncapped",
  "Bootstrapping while pregnant",
  "The stadium sponsorship maths",
  "Township promoters and the door split",
  "How a sample clearance really works",
  "The graduate unemployment number, unpacked",
  "Rural clinic, one doctor, Friday",
  "Why we still argue about 1994",
  "A producer's hard drive, twenty years deep",
  "Selling a family farm",
  "The quiet economics of church",
];

const HOSTED_MEDIA = [
  "https://cdn.pixabay.com/audio/2022/03/15/audio_c8c8a73467.mp3",
  "https://cdn.pixabay.com/audio/2022/10/25/audio_946f4f6693.mp3",
  "https://cdn.pixabay.com/audio/2021/08/09/audio_88447e769f.mp3",
  "https://cdn.pixabay.com/audio/2022/01/18/audio_d0c6ff1bab.mp3",
];
const BASE_DATE = Date.UTC(2026, 8, 15);

export const episodes: Episode[] = Array.from({ length: 180 }, (_, i) => {
  const podcast = podcasts[i % podcasts.length];
  const title = EPISODE_TITLES[(i * 7) % EPISODE_TITLES.length];
  const kind: Episode["kind"] = hash(`kind${i}`) > 0.55 ? "video" : "audio";
  const daysAgo = between(`day${i}`, 0, 210);
  return {
    id: `ep-${i + 1}`,
    slug: `${podcast.slug}-${i + 1}`,
    title,
    description: `${podcast.title} · ${title}. A ${kind === "video" ? "filmed" : "recorded"} conversation from ${podcast.province}, produced for The Voice Lounge.`,
    podcastId: podcast.id,
    number: between(`num${i}`, 1, 180),
    season: between(`sea${i}`, 1, 7),
    durationSec: between(`dur${i}`, 8, 132) * 60,
    publishedAt: new Date(BASE_DATE - daysAgo * 86400000).toISOString(),
    kind,
    plays: between(`pl${i}`, 1200, 940000),
    language: podcast.language,
    artwork: { seed: `ep-${i}-${title}`, alt: `${title} — ${podcast.title}`, ratio: "16/9" },
    // Video playback is resolved exclusively through the official YouTube feed.
    mediaUrl: kind === "video" ? "" : HOSTED_MEDIA[i % HOSTED_MEDIA.length],
    transcriptAvailable: hash(`tr${i}`) > 0.3,
    isPremium: hash(`epprem${i}`) > 0.88,
  };
});

/* ------------------------------------------------------------------
   News
   ------------------------------------------------------------------ */

const NEWS_DEFS: Array<[string, string, string]> = [
  ["The Voice Lounge commissions twelve new Originals for summer", "Voice Lounge", "Six audio strands and six filmed series enter production across four provinces, with the first titles landing in October."],
  ["South African podcast listening passes a third of urban adults", "Industry", "New measurement from a Johannesburg research house puts weekly reach ahead of commercial radio in the 25–34 bracket."],
  ["Amapiano's touring economy is finally being measured", "Music", "Promoters and booking agents share fee data for the first time, and the numbers complicate the export story."],
  ["Inside the studio build in Braamfontein", "Voice Lounge", "Three rooms, one live floor and an acoustic problem that took four months to solve."],
  ["Local screen production faces a commissioning bottleneck", "Film & Television", "Producers report longer decision cycles as broadcasters restructure their content pipelines."],
  ["Creators are moving from platform revenue to direct membership", "Creator", "A shift in how South African independents fund their shows, with numbers from six studios."],
  ["Fibre reached the townships. Listening habits changed with it.", "Technology", "Video podcast consumption has grown fastest in areas that received fixed-line access after 2023."],
  ["Why sports podcasts are outgrowing sports radio", "Sport", "On-demand tactical shows are capturing the audience that used to wait for the phone-in."],
  ["Publishers and podcasters are finally sharing audiences", "Media", "Newsroom-produced audio is bringing print subscribers into daily listening."],
  ["The rand, the repo rate and your grocery bill", "Business", "What the latest monetary policy decision means for household budgets before December."],
  ["A new generation of isiZulu-language shows is scaling", "Culture", "Vernacular programming is finding national reach without translating itself."],
  ["Comedy clubs are becoming podcast studios", "Entertainment", "Live rooms in Cape Town and Durban are doubling as production spaces."],
  ["Advertising is following attention into long-form audio", "Business", "Media buyers describe a slow but durable budget shift."],
  ["Interview: the producer who records everything to tape", "Interviews", "A conversation about workflow, patience and refusing to edit for pace."],
  ["Opinion: South Africa does not have a talent problem", "Opinion", "It has a distribution problem, and the fix is unglamorous."],
  ["Feature: the night shift, recorded", "Features", "How one team spent six months reporting the hours between midnight and five."],
  ["Voice Lounge Premium enters open testing", "Voice Lounge", "Ad-free listening, early access and member rooms arrive for an initial group of listeners."],
  ["Universities are teaching audio production properly at last", "Education", "Four institutions have added dedicated podcast modules this year."],
  ["The archive problem: who keeps South African audio?", "Culture", "Broadcast tape is degrading while nobody holds a mandate to preserve it."],
  ["Live podcast recordings are selling out faster than comedy", "Entertainment", "Ticket data from three promoters shows demand outpacing venue supply."],
  ["What creators actually earn: a survey of 140 shows", "Creator", "Median revenue, the long tail and the gap between reach and income."],
  ["Film festivals are commissioning audio companions", "Film & Television", "Documentary teams are releasing podcast strands alongside features."],
  ["Load-shedding changed how the country listens", "Technology", "Download behaviour still spikes around the schedule, two years on."],
  ["Most read this month: the stories you finished", "Trending", "Completion rates, not clicks, ranked our top twenty pieces."],
];

export const news: NewsArticle[] = NEWS_DEFS.map(([headline, section, standfirst], i) => ({
  id: `news-${i + 1}`,
  slug: headline.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60),
  headline,
  standfirst,
  body: [
    standfirst,
    "Reporting for this piece was carried out across Johannesburg, Cape Town and Durban over three weeks. Figures quoted are drawn from operators who agreed to share them on the record.",
    "The Voice Lounge newsroom publishes corrections openly. Where a source declined to comment, that is stated in the text rather than implied.",
    "This is demonstration editorial content created for The Voice Lounge platform build and does not describe real events.",
  ],
  section,
  author: creators[(i * 3) % creators.length].name,
  publishedAt: new Date(BASE_DATE - between(`n${i}`, 0, 120) * 86400000).toISOString(),
  readingMinutes: between(`rm${i}`, 3, 12),
  artwork: { seed: `news-${headline}`, alt: headline, ratio: "16/9" },
  featured: i < 3,
}));

/* ------------------------------------------------------------------
   Live
   ------------------------------------------------------------------ */

const LIVE_DEFS: Array<[string, string, LiveEvent["status"], string]> = [
  ["The Rand Room: Budget Reaction Live", "Markets", "live", "Live analysis from the studio floor as the numbers land."],
  ["Full Time Feelings: Derby Postmatch", "Sport", "live", "Immediate reaction with callers, straight after the final whistle."],
  ["Ekhaya Nights Live from Gqeberha", "Entertainment", "soon", "Music, comedy and unscripted conversation in front of a live room."],
  ["Build It Here: Founder Clinic", "Business", "soon", "Open Q&A with three operators taking questions on pricing."],
  ["Amapiano Archive: Producer Session", "Music", "scheduled", "A working session with two producers and a hard drive."],
  ["Court of Appeal: Judgment Day Brief", "News", "scheduled", "A ruling read and explained as it is handed down."],
  ["Second Draft Live: Editing on Stage", "Culture", "scheduled", "A manuscript cut down in public, with the author present."],
  ["Campus Signal: Registration Special", "Youth", "scheduled", "Students calling in from six campuses."],
  ["Studio 47: Three Songs to Tape", "Music", "scheduled", "A live-to-tape session with no overdubs."],
  ["Clinic Hours: Ask a Doctor", "Health", "ended", "Listener questions answered without diagnosis."],
  ["The Long Reply Live", "Culture", "ended", "Ninety minutes, one guest, a full theatre."],
  ["Switchboard: Grid Briefing", "Technology", "ended", "A working explanation of the week's system status."],
];

export const liveEvents: LiveEvent[] = LIVE_DEFS.map(([title, strand, status, description], i) => ({
  id: `live-${i + 1}`,
  slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  title,
  description,
  host: creators[(i * 5) % creators.length].name,
  startsAt: new Date(BASE_DATE + (status === "ended" ? -1 : 1) * between(`lv${i}`, 1, 120) * 3600000).toISOString(),
  durationMin: between(`ld${i}`, 30, 150),
  status,
  listeners: between(`ll${i}`, 210, 18400),
  strand,
  artwork: { seed: `live-${title}`, alt: title, ratio: "16/9" },
}));

/* ------------------------------------------------------------------
   Collections, plans, profile
   ------------------------------------------------------------------ */

export const collections: Collection[] = [
  ["Nine Provinces, Nine Voices", "One defining show from every province.", "Voice Lounge Editorial", "green"],
  ["The Interview Canon", "Twenty conversations worth the full ninety minutes.", "Lerato Khumalo", "gold"],
  ["Built From Nothing", "Founder stories without the funding-round gloss.", "Business Desk", "green"],
  ["After Midnight", "Shows for the hours nobody schedules.", "Night Desk", "ink"],
  ["Mother Tongue Sessions", "Vernacular programming leading the charts.", "Culture Desk", "gold"],
  ["The Sound of the City", "Music journalism from six scenes.", "Music Desk", "green"],
].map(([title, blurb, curator, tone], i) => ({
  id: `col-${i + 1}`,
  slug: (title as string).toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  title: title as string,
  blurb: blurb as string,
  curator: curator as string,
  tone: tone as Collection["tone"],
  itemIds: podcasts.slice(i * 4, i * 4 + 8).map((p) => p.id),
}));

export const plans: SubscriptionPlan[] = [
  {
    id: "plan-free",
    name: "Lounge",
    priceZar: 0,
    cadence: "month",
    summary: "The full catalogue, with advertising.",
    perks: ["Full podcast catalogue", "Video podcasts", "Follow creators", "Personal playlists", "Two devices"],
  },
  {
    id: "plan-premium",
    name: "Premium",
    priceZar: 89,
    cadence: "month",
    summary: "Ad-free, early access and member rooms.",
    perks: [
      "No advertising",
      "Early access to Originals",
      "Exclusive filmed episodes",
      "Lossless audio where available",
      "Saved for offline",
      "Premium creator rooms",
      "Six devices",
    ],
    highlight: true,
  },
  {
    id: "plan-studio",
    name: "Studio",
    priceZar: 149,
    cadence: "month",
    summary: "For households and working teams.",
    perks: [
      "Everything in Premium",
      "Five member profiles",
      "Shared collections",
      "Partner perks at venues",
      "Priority live event access",
      "Annual member evening",
    ],
  },
];

export const demoProfile: UserProfile = {
  id: "usr-1",
  displayName: "Naledi Mahlangu",
  handle: "@naledi",
  city: "Johannesburg",
  memberSince: "2024-03-11",
  premium: true,
  languages: ["English", "isiZulu", "Sesotho"],
  minutesListened: 18420,
};

/* ------------------------------------------------------------------
   Lookups
   ------------------------------------------------------------------ */

export const podcastById = (id: string) => podcasts.find((p) => p.id === id);
export const creatorById = (id: string) => creators.find((c) => c.id === id);
export const categoryById = (id: string) => categories.find((c) => c.id === id);
export const episodeById = (id: string) => episodes.find((e) => e.id === id);
export const podcastBySlug = (slug: string) => podcasts.find((p) => p.slug === slug);
export const newsBySlug = (slug: string) => news.find((n) => n.slug === slug);
export const creatorBySlug = (slug: string) => creators.find((c) => c.slug === slug);

export { hash, between, pick };
