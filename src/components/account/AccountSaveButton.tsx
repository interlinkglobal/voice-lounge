import { Bookmark, Check } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/utils";

export function AccountSaveButton({
  contentType,
  contentId,
  title,
  imageUrl,
  collection = "saved",
  className,
  label = "Save",
}: {
  contentType: "video" | "podcast" | "episode" | "show" | "article" | "content";
  contentId: string;
  title?: string | null;
  imageUrl?: string | null;
  collection?: "saved" | "watch_later" | "listen_later";
  className?: string;
  label?: string;
}) {
  const user = useAuth();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!user) {
      window.location.assign(`/login?returnTo=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save_content",
          collection,
          content_type: contentType,
          content_id: contentId,
          title,
          image_url: imageUrl,
        }),
      });
      if (response.ok) setSaved(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void save()}
      disabled={busy}
      aria-pressed={saved}
      className={cn(
        "press inline-flex min-h-10 items-center justify-center gap-2 border border-hairline px-4 text-sm font-bold disabled:opacity-60",
        saved && "border-[var(--green)] text-[var(--green)]",
        className,
      )}
    >
      {saved ? <Check className="size-4" aria-hidden="true" /> : <Bookmark className="size-4" aria-hidden="true" />}
      {saved ? "Saved" : label}
    </button>
  );
}
