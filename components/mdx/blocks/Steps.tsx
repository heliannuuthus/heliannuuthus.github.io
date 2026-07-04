"use client";

import React, { useState } from "react";
import { cn } from "@/lib/cn";

interface StepProps {
  title?: string;
  children?: React.ReactNode;
}

export function Step({ children }: StepProps) {
  return <>{children}</>;
}

export default function Steps({ children }: { children?: React.ReactNode }) {
  const [current, setCurrent] = useState(0);

  const steps = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<StepProps> =>
      React.isValidElement(child)
  );

  return (
    <div className="my-4 flex flex-col">
      {steps.map((step, index) => {
        const isActive = index === current;
        const isDone = index < current;
        const title = step.props.title || `Step ${index + 1}`;

        return (
          <div
            key={index}
            className="flex gap-3 cursor-pointer group"
            onClick={() => setCurrent(index)}
          >
            <div className="flex flex-col items-center pt-0.5">
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
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-px flex-1 min-h-[24px] my-1",
                    isDone
                      ? "bg-emerald-300 dark:bg-emerald-700"
                      : "bg-default-200 dark:bg-default-100/10"
                  )}
                />
              )}
            </div>

            <div className="pb-4 min-w-0">
              <div
                className={cn(
                  "text-[14px] font-medium leading-snug transition-colors",
                  isActive
                    ? "text-zinc-900 dark:text-zinc-50"
                    : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200"
                )}
              >
                {title}
              </div>
              {isActive && step.props.children && (
                <div className="mt-2 text-[13px] leading-relaxed text-default-600 dark:text-default-400">
                  {step.props.children}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
