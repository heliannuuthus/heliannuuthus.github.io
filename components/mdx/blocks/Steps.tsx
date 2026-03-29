"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

interface StepItem {
  key?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
}

interface StepsProps {
  items?: StepItem[];
  current?: number;
  direction?: "horizontal" | "vertical";
}

export default function Steps({
  items = [],
  current: initialCurrent = 0,
  direction = "vertical",
}: StepsProps) {
  const [current, setCurrent] = useState(initialCurrent);

  return (
    <div
      className={cn(
        "my-4",
        direction === "horizontal"
          ? "flex items-start gap-4 overflow-x-auto"
          : "flex flex-col"
      )}
    >
      {items.map((item, index) => {
        const isActive = index === current;
        const isDone = index < current;

        return (
          <div
            key={item.key ?? index}
            className={cn(
              "flex gap-3 cursor-pointer group",
              direction === "horizontal" && "flex-col items-center min-w-[120px]"
            )}
            onClick={() => setCurrent(index)}
          >
            <div className={cn("flex flex-col items-center", direction === "vertical" && "pt-0.5")}>
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors",
                  isActive
                    ? "bg-emerald-500 text-white"
                    : isDone
                      ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
                      : "bg-default-200 dark:bg-default-100/10 text-default-400"
                )}
              >
                {isDone ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              {direction === "vertical" && index < items.length - 1 && (
                <div className={cn(
                  "w-px flex-1 min-h-[24px] my-1",
                  isDone ? "bg-emerald-300 dark:bg-emerald-700" : "bg-default-200 dark:bg-default-100/10"
                )} />
              )}
            </div>

            <div className={cn("pb-4 min-w-0", direction === "horizontal" && "text-center")}>
              <div
                className={cn(
                  "text-[14px] font-medium leading-snug transition-colors",
                  isActive
                    ? "text-zinc-900 dark:text-zinc-50"
                    : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200"
                )}
              >
                {item.title}
              </div>
              {isActive && item.description && (
                <div className="mt-2 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {item.description}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
