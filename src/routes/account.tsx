import { createFileRoute } from "@tanstack/react-router";
import { AccountExperience } from "@/components/pages/AccountExperience";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Account | The Voice Lounge" },
      { name: "description", content: "Manage your Voice Lounge membership, playlists, language, activity and requests." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AccountExperience,
});
