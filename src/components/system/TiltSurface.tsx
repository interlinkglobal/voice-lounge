import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function TiltSurface({
  children,
  className,
  maxTilt = 5,
}: {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const reset = () => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--tilt-x", "0deg");
    node.style.setProperty("--tilt-y", "0deg");
    node.style.setProperty("--tilt-glare-x", "50%");
    node.style.setProperty("--tilt-glare-y", "50%");
    node.dataset.tiltActive = "false";
  };

  return (
    <div
      ref={ref}
      className={cn("tiltjs-surface", className)}
      data-tilt-active="false"
      onPointerEnter={(event) => {
        if (event.pointerType === "touch") return;
        event.currentTarget.dataset.tiltActive = "true";
      }}
      onPointerMove={(event) => {
        if (event.pointerType === "touch") return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        event.currentTarget.style.setProperty("--tilt-x", `${((0.5 - py) * maxTilt * 2).toFixed(2)}deg`);
        event.currentTarget.style.setProperty("--tilt-y", `${((px - 0.5) * maxTilt * 2).toFixed(2)}deg`);
        event.currentTarget.style.setProperty("--tilt-glare-x", `${(px * 100).toFixed(1)}%`);
        event.currentTarget.style.setProperty("--tilt-glare-y", `${(py * 100).toFixed(1)}%`);
      }}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      <div className="tiltjs-surface-inner">{children}</div>
      <span className="tiltjs-surface-glare" aria-hidden="true" />
    </div>
  );
}
