import { createFileRoute } from "@tanstack/react-router";
import { GuestsDirectoryExperience } from "@/components/pages/GuestExperiences";

export const Route = createFileRoute("/guests/")({
  head: () => ({
    meta: [
      { title: "Guests | The Voice Lounge" },
      { name: "description", content: "Guests featured across Voice Lounge interviews, podcasts and official YouTube programming." },
    ],
  }),
  component: GuestsDirectoryExperience,
});
