import { createFileRoute } from "@tanstack/react-router";
import { GuestsExperience } from "@/components/pages/AudienceExperiences";

export const Route = createFileRoute("/guests")({
  head: () => ({
    meta: [
      { title: "Guests | The Voice Lounge" },
      { name: "description", content: "Research-backed directory of guests featured across Voice Lounge interviews, podcasts and programmes." },
      { property: "og:title", content: "Guests | The Voice Lounge" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: GuestsExperience,
});
