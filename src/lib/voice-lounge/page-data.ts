import {
  creatorCard,
  episodeCard,
  liveCard,
  newsCard,
  podcastCard,
  q,
  universalSearch,
} from "@/lib/content/adapters";
import { categories, creators, liveEvents } from "@/lib/content/catalog";
import type { MediaCardModel } from "@/lib/content/types";
import type { PageKey } from "@/lib/voice-lounge/routes";

const LANGUAGES = ["English", "isiZulu", "isiXhosa", "Sesotho", "Setswana", "Afrikaans"];
const PROVINCES = ["Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Free State", "Limpopo", "Mpumalanga", "North West", "Northern Cape"];
const FORMATS = ["Audio", "Video", "Hybrid"];
const MOODS = ["Quick hit", "Deep dive", "Laugh", "Learn", "Debate", "Unwind"];
const DISCOVERY_TAGS = ["New voices", "Staff picks", "Originals", "Independent", "Local stories", "Long-form"];

export function pageCards(page: PageKey, title: string, index: number, query = ""): MediaCardModel[] {
  const t = title.toLowerCase();

  if (page === "search" && query.trim()) {
    const hits = universalSearch(query).map((hit) => hit.card);
    if (t.includes("podcast")) return hits.filter((x) => x.kind === "podcast").slice(0, 12);
    if (t.includes("episode")) return hits.filter((x) => x.kind === "episode").slice(0, 12);
    if (t.includes("video")) return hits.filter((x) => x.kind === "video").slice(0, 12);
    if (t.includes("creator")) return hits.filter((x) => x.kind === "creator").slice(0, 12);
    if (t.includes("news")) return hits.filter((x) => x.kind === "news").slice(0, 12);
    if (t.includes("live")) return hits.filter((x) => x.kind === "live").slice(0, 12);
    if (t.includes("top result")) return hits.slice(0, 4);
    if (t.includes("full filterable")) return hits.slice(0, 24);
  }

  if (page === "news") {
    const aliases: Array<[string, string]> = [
      ["voice lounge", "Voice Lounge"], ["creator", "Creator"], ["technology", "Technology"],
      ["business", "Business"], ["music", "Music"], ["film", "Film & Television"],
      ["sport", "Sport"], ["opinion", "Opinion"], ["features", "Features"], ["entertainment", "Entertainment"],
    ];
    const hit = aliases.find(([needle]) => t.includes(needle));
    return (hit ? q.newsBySection(hit[1], 10) : q.latestNews(12)).map(newsCard);
  }

  if (page === "creators" || t.includes("creator") || t.includes("host") || t.includes("voices") || t.includes("contributors")) {
    return creators.slice(index % 7, (index % 7) + 10).map(creatorCard);
  }

  if (page === "live" || t.includes("live") || t.includes("schedule") || t.includes("premiere") || t.includes("replay")) {
    const rows = t.includes("currently") ? q.liveNow() : t.includes("starting") ? q.liveSoon() : t.includes("past") || t.includes("replay") ? q.liveEnded() : liveEvents;
    return rows.slice(0, 10).map(liveCard);
  }

  if (t.includes("news") || t.includes("stories") || t.includes("announcements") || t.includes("press") || t.includes("media industry")) {
    return q.latestNews(10).map(newsCard);
  }
  if (t.includes("continue")) return q.continueItems(10);
  if (t.includes("hidden gems")) return q.hiddenGems(10).map(podcastCard);
  if (t.includes("original")) return q.originals(10).map(podcastCard);
  if (t.includes("premium")) return q.premiumPodcasts(10).map(podcastCard);
  if (t.includes("short") || t.includes("under 20")) return q.shortEpisodes(10).map(episodeCard);
  if (t.includes("long-form") || t.includes("deep-dive")) return q.longEpisodes(10).map(episodeCard);
  if (t.includes("video") || page === "watch") return q.videoEpisodes(10).map(episodeCard);
  if (t.includes("audio-first")) return q.audioEpisodes(10).map(episodeCard);
  if (t.includes("latest") || t.includes("recent") || t.includes("new this")) return q.latestEpisodes(10).map(episodeCard);
  if (t.includes("trending") || t.includes("most played") || t.includes("top 10") || t.includes("charts") || t.includes("most watched")) {
    return q.trendingEpisodes(10).map((item, rank) => episodeCard(item, { rank: rank + 1 }));
  }

  const categoryAliases: Array<[string, string]> = [
    ["entrepreneur", "Entrepreneurship"], ["business", "Business"], ["technology", "Technology"],
    ["sport", "Sport"], ["music", "Music"], ["entertainment", "Entertainment"], ["comedy", "Comedy"],
    ["society", "Society & Culture"], ["culture", "Society & Culture"], ["education", "Education"],
    ["health", "Health & Wellness"], ["lifestyle", "Lifestyle"], ["faith", "Faith & Spirituality"],
    ["african stories", "African Stories"], ["youth", "Youth & Campus"], ["film", "Film & Television"], ["news", "News"],
  ];
  const category = categoryAliases.find(([needle]) => t.includes(needle));
  if (category) {
    const rows = q.podcastsByCategory(category[1], 10);
    if (rows.length) return rows.map(podcastCard);
  }

  if (t.includes("podcast") || page === "podcasts" || page === "shows" || page === "categories") {
    return q.topPodcasts(10).map((item, rank) => podcastCard(item, { rank: rank + 1 }));
  }

  const mixed = [...q.latestEpisodes(6).map(episodeCard), ...q.topPodcasts(6).map(podcastCard)];
  const shift = index % mixed.length;
  return [...mixed.slice(shift), ...mixed.slice(0, shift)].slice(0, 10);
}

export function chipsFor(title: string) {
  const t = title.toLowerCase();
  const rows = t.includes("language") ? LANGUAGES
    : t.includes("province") || t.includes("region") ? PROVINCES
      : t.includes("format") ? FORMATS
        : t.includes("mood") ? MOODS
          : t.includes("categor") || t.includes("topic") ? categories.map((c) => c.name)
            : t.includes("duration") ? ["Under 20 min", "20–45 min", "45–90 min", "90+ min"]
              : t.includes("date") ? ["Today", "This week", "This month", "This year"]
                : t.includes("popularity") ? ["Trending", "Most played", "Most saved", "Editors' picks"]
                  : DISCOVERY_TAGS;
  return rows.slice(0, 18).map((label) => ({ label, to: t.includes("categor") ? "/categories" : "/search" }));
}
