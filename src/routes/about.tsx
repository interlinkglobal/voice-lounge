import { createFileRoute } from "@tanstack/react-router";
import { AboutResearchExperience } from "@/components/pages/AudienceExperiences";
import { VOICE_LOUNGE } from "@/lib/voice-lounge/organization";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About The Voice Lounge | East London Media, Podcasts, Radio & Video" },
      {
        name: "description",
        content: "A comprehensive researched profile of The Voice Lounge in East London: online radio, podcasts, YouTube video, shows, guests, studio production, artist development, apps, news and public contact information.",
      },
      { property: "og:title", content: "About The Voice Lounge | East London Media, Podcasts, Radio & Video" },
      {
        property: "og:description",
        content: "Research-rich profile of The Voice Lounge: history, programmes, guests, video, radio, studio production, apps, audience signals, commercial model and public contacts.",
      },
      { property: "og:type", content: "article" },
      { name: "robots", content: "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About The Voice Lounge",
          description: VOICE_LOUNGE.description,
          about: {
            "@type": "Organization",
            name: VOICE_LOUNGE.name,
            url: VOICE_LOUNGE.publicWebsite,
            foundingLocation: {
              "@type": "Place",
              name: "East London, Eastern Cape, South Africa",
            },
            areaServed: "Eastern Cape, South Africa",
            sameAs: VOICE_LOUNGE.socials.map((item) => item.url),
            contactPoint: {
              "@type": "ContactPoint",
              telephone: VOICE_LOUNGE.contact.mobile,
              email: VOICE_LOUNGE.contact.email,
              contactType: "customer service",
            },
          },
        }),
      },
    ],
  }),
  component: AboutResearchExperience,
});
