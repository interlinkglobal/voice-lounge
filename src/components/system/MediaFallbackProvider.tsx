import { useEffect, type ReactNode } from "react";
import { FALLBACK_IMAGES, type FallbackRatio } from "@/components/media/SmartImage";

function inferFallback(image: HTMLImageElement): FallbackRatio {
  const declared = image.dataset.fallbackRatio as FallbackRatio | undefined;
  if (declared && declared in FALLBACK_IMAGES) return declared;

  const rect = image.getBoundingClientRect();
  const width = rect.width || image.width || Number(image.getAttribute("width")) || 0;
  const height = rect.height || image.height || Number(image.getAttribute("height")) || 0;

  if (width > 0 && height > 0) {
    const ratio = width / height;
    if (ratio < 0.78) return "9:16";
    if (ratio < 1.18) return "1:1";
  }

  return "16:9";
}

export function MediaFallbackProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const onError = (event: Event) => {
      const image = event.target;
      if (!(image instanceof HTMLImageElement)) return;
      if (image.dataset.fallbackApplied === "true") return;

      const ratio = inferFallback(image);
      const fallback = FALLBACK_IMAGES[ratio];
      if (image.src.endsWith(fallback)) return;

      image.dataset.fallbackApplied = "true";
      image.src = fallback;
    };

    document.addEventListener("error", onError, true);
    return () => document.removeEventListener("error", onError, true);
  }, []);

  return children;
}
