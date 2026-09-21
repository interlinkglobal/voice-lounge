import { useEffect, useState, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type FallbackRatio = "1:1" | "9:16" | "16:9";

export const FALLBACK_IMAGES: Record<FallbackRatio, string> = {
  "1:1": "/fallback-image-1x1.png",
  "9:16": "/fallback-image-9x16.png",
  "16:9": "/fallback-image-16x9.png",
};

export function SmartImage({
  src,
  fallbackRatio = "16:9",
  className,
  alt,
  ...props
}: Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string | null | undefined;
  fallbackRatio?: FallbackRatio | undefined;
}) {
  const fallback = FALLBACK_IMAGES[fallbackRatio];
  const [resolvedSrc, setResolvedSrc] = useState(src?.trim() || fallback);

  useEffect(() => {
    setResolvedSrc(src?.trim() || fallback);
  }, [src, fallback]);

  return (
    <img
      {...props}
      src={resolvedSrc}
      alt={alt}
      data-fallback-ratio={fallbackRatio}
      onError={(event) => {
        if (resolvedSrc !== fallback) setResolvedSrc(fallback);
        props.onError?.(event);
      }}
      className={cn(className)}
    />
  );
}
