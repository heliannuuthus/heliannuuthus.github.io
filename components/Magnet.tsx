"use client";

import { useCallback, useRef } from "react";
import { cn } from "@/lib/cn";

interface MagnetProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export default function Magnet({
  children,
  className,
  strength = 0.28
}: MagnetProps) {
  const ref = useRef<HTMLSpanElement>(null);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLSpanElement>) => {
      if (event.pointerType === "touch") return;

      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      el.style.setProperty("--rb-magnet-x", `${x * strength}px`);
      el.style.setProperty("--rb-magnet-y", `${y * strength}px`);
    },
    [strength]
  );

  const handlePointerLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rb-magnet-x", "0px");
    el.style.setProperty("--rb-magnet-y", "0px");
  }, []);

  return (
    <span
      ref={ref}
      className={cn("rb-magnet", className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </span>
  );
}
