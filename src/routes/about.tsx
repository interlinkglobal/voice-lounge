import { createFileRoute } from "@tanstack/react-router";
import { AboutResearchExperience } from "@/components/pages/AudienceExperiences";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About The Voice Lounge | East London Media, Podcasts, Radio & Video" },
      {
        name: "description",
        content: "A comprehensive researched profile of The Voice Lounge in East London: online radio, podcasts, YouTube video, shows, guests, studio production, artist development, apps, news and public contact information.",
      },
      { property: "og:title", content: "About The Voice Lounge | East London Media, Podcasts, Radio & Video" },
      { property: "og:type", content: "article" },
    ],
  }),
  component: AboutResearchExperience,
});
