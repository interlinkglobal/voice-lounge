import type { YouTubeFeedVideo } from "@/lib/youtube.functions";

export type ScheduleDay = "Monday–Friday" | "Saturday" | "Sunday";

export interface ShowScheduleEntry {
  podcastId: string;
  day: ScheduleDay;
  time: string;
  host: string;
}

export const PODCAST_FALLBACK_THUMBNAILS = [
  "https://res.cloudinary.com/dlokees9a/image/upload/v1789909792/podcast-thumbail-3_vvs9ad.avif",
  "https://res.cloudinary.com/dlokees9a/image/upload/v1789909792/podcast-thumbnail-2_fnmy0h.avif",
  "https://res.cloudinary.com/dlokees9a/image/upload/v1789909792/podcast-thumbnail-1_mvrnri.avif",
] as const;

export const PODCAST_THUMBNAILS: Record<string, string> = {
  "pod-breakfast-plug": "/images/podcasts/breakfast-plug.jpg",
  "pod-beyond-the-grey": "/images/podcasts/beyond-the-grey.jpg",
  "pod-refuel-lounge": "/images/podcasts/refuel-lounge.jpg",
  "pod-3-2-6-lounge": "/images/podcasts/3-2-6-lounge.jpg",
  "pod-the-voicelounge-sitting": "/images/podcasts/the-voicelounge-sitting.jpg",
  "pod-sports-lounge": "/images/podcasts/sports-lounge.jpg",
  "pod-after-dark-lounge": "/images/podcasts/after-dark-lounge.jpg",
  "pod-spirit-and-truth": "/images/podcasts/spirit-and-truth.jpg",
  "pod-triumph-lounge": "/images/podcasts/triumph-lounge.jpg",
  "pod-solitude-lounge": "/images/podcasts/solitude-lounge.jpg",
  "pod-connect-and-learn": "/images/podcasts/connect-and-learn.jpg",
  "pod-weekend-gateaway": "/images/podcasts/weekend-gateaway.jpg",
  "pod-music-lounge": "/images/podcasts/music-lounge.jpg",
  "pod-logos-moment": "/images/podcasts/logos-moment.jpg",
  "pod-grace-connection": "/images/podcasts/grace-connection.jpg",
  "pod-chapter-lounge": "/images/podcasts/chapter-lounge.jpg",
  "pod-rhythm-and-sound-lounge": "/images/podcasts/rhythm-and-sound-lounge.jpg",
  "pod-koinonia-the-fellowship": "/images/podcasts/koinonia-the-fellowship.jpg",
};

export const SHOW_SCHEDULE: ShowScheduleEntry[] = [
  { podcastId: "pod-breakfast-plug", day: "Monday–Friday", time: "06:00 – 09:00", host: "Miss Vee & Garth Ah-Mook" },
  { podcastId: "pod-beyond-the-grey", day: "Monday–Friday", time: "09:00 – 12:00", host: "Baby Obuhle Sihu" },
  { podcastId: "pod-refuel-lounge", day: "Monday–Friday", time: "12:00 – 15:00", host: "Zan" },
  { podcastId: "pod-3-2-6-lounge", day: "Monday–Friday", time: "15:00 – 18:00", host: "Brian" },
  { podcastId: "pod-the-voicelounge-sitting", day: "Monday–Friday", time: "18:00 – 19:00", host: "Asanda Magaqa" },
  { podcastId: "pod-sports-lounge", day: "Monday–Friday", time: "18:00 – 19:00", host: "Tsepang" },
  { podcastId: "pod-after-dark-lounge", day: "Monday–Friday", time: "19:00 – 22:00", host: "Narcho Mabizela" },
  { podcastId: "pod-spirit-and-truth", day: "Monday–Friday", time: "19:00 – 22:00", host: "Sasa Mapolisa" },
  { podcastId: "pod-triumph-lounge", day: "Monday–Friday", time: "22:00 – 01:00", host: "Tsepo Nontyi" },
  { podcastId: "pod-solitude-lounge", day: "Saturday", time: "06:00 – 09:00", host: "Tsepang Liphapang" },
  { podcastId: "pod-connect-and-learn", day: "Saturday", time: "09:00 – 12:00", host: "Baby Obuhle Sihu" },
  { podcastId: "pod-weekend-gateaway", day: "Saturday", time: "12:00 – 15:00", host: "Zan" },
  { podcastId: "pod-music-lounge", day: "Saturday", time: "15:00 – 18:00", host: "Narcho Mabizela" },
  { podcastId: "pod-after-dark-lounge", day: "Saturday", time: "19:00 – 21:00", host: "Resident DJ" },
  { podcastId: "pod-logos-moment", day: "Sunday", time: "06:00 – 09:00", host: "Pastor Mafaya" },
  { podcastId: "pod-grace-connection", day: "Sunday", time: "09:00 – 12:00", host: "Pastor Jaytee" },
  { podcastId: "pod-chapter-lounge", day: "Sunday", time: "12:00 – 15:00", host: "Tsepo" },
  { podcastId: "pod-rhythm-and-sound-lounge", day: "Sunday", time: "15:00 – 18:00", host: "Zan" },
  { podcastId: "pod-koinonia-the-fellowship", day: "Sunday", time: "18:00 – 22:00", host: "Pastor Gugu" },
];

const SHOW_ALIASES: Record<string, string[]> = {
  "the-breakfast-plug": ["breakfast plug", "miss vee", "garth ah mook"],
  "beyond-the-grey": ["beyond the grey", "beyond grey"],
  "refuel-lounge": ["refuel lounge"],
  "3-2-6-lounge": ["3 2 6 lounge", "326 lounge"],
  "the-voicelounge-sitting": ["voicelounge sitting", "voice lounge sitting", "asanda magaqa"],
  "the-sports-lounge": ["sports lounge"],
  "after-dark-lounge": ["after dark lounge"],
  "spirit-truth": ["spirit truth", "spirit and truth", "sasa mapolisa"],
  "the-triumph-lounge": ["triumph lounge", "the triumph"],
  "solitude-lounge": ["solitude lounge"],
  "connect-learn": ["connect learn", "connect and learn"],
  "the-weekend-gateaway": ["weekend gateaway", "weekend getaway"],
  "the-music-lounge": ["music lounge"],
  "the-logos-moment": ["logos moment"],
  "the-grace-connection": ["grace connection"],
  "the-chapter-lounge": ["chapter lounge"],
  "rhythm-sound-lounge": ["rhythm sound lounge", "rhythm and sound lounge"],
  "koinonia-the-fellowship": ["koinonia", "the fellowship", "pastor gugu"],
};

export function normalizeProgrammeText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function programmeVideos(videos: YouTubeFeedVideo[], slug: string, title: string) {
  const aliases = SHOW_ALIASES[slug] ?? [normalizeProgrammeText(title)];
  return videos.filter((video) => {
    const haystack = normalizeProgrammeText(`${video.title} ${video.description}`);
    return aliases.some((alias) => haystack.includes(normalizeProgrammeText(alias)));
  });
}
