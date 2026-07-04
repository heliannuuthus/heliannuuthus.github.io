"use client";

import { useCallback, useRef } from "react";
import { cn } from "@/lib/cn";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export default function SpotlightCard({
  children,
  className,
  disabled = false
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (disabled || event.pointerType === "touch") return;

      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -4;
      const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 4;

      el.style.setProperty("--rb-spotlight-x", `${x}%`);
      el.style.setProperty("--rb-spotlight-y", `${y}%`);
      el.style.setProperty("--rb-tilt-x", `${rotateX}deg`);
      el.style.setProperty("--rb-tilt-y", `${rotateY}deg`);
    },
    [disabled]
  );

  const handlePointerLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    el.style.setProperty("--rb-tilt-x", "0deg");
    el.style.setProperty("--rb-tilt-y", "0deg");
  }, []);

  return (
    <div
      ref={ref}
      className={cn("rb-spotlight-card", className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </div>
  );
}
