"use client";

import { useCallback, useRef, useState } from "react";

interface CollapseProps {
  title?: string;
  children?: React.ReactNode;
}

export default function Collapse({
  title = "Details",
  children,
}: CollapseProps) {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [capsuleWidth, setCapsuleWidth] = useState(0);
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const open = pinned || hovered;

  const measureTitle = useCallback((node: HTMLSpanElement | null) => {
    if (node) {
      setCapsuleWidth(node.offsetWidth + 42);
    }
  }, []);

  const measured = capsuleWidth > 0;

  const handleEnter = () => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    setHovered(true);
  };

  const handleLeave = () => {
    leaveTimer.current = setTimeout(() => setHovered(false), 300);
  };

  return (
    <div className="my-6">
      <div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onClick={() => setPinned((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setPinned((v) => !v);
          }
        }}
        style={
          measured
            ? {
                width: open ? "60%" : capsuleWidth,
                borderRadius: open ? 16 : 9999,
              }
            : undefined
        }
        className={[
          "mx-auto overflow-hidden cursor-pointer select-none",
          "border border-default-200 dark:border-default-100/10",
          "transition-[width,border-radius,box-shadow,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open
            ? "shadow-lg bg-default-50/80 dark:bg-default-50/5 backdrop-blur-xl"
            : "shadow-sm bg-default-100 dark:bg-default-100/10",
          !measured && !open ? "w-fit rounded-full" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* header */}
        <div className="flex items-center justify-center px-5 py-2">
          <span
            ref={measureTitle}
            className="text-[13px] font-medium tracking-wide text-default-600 dark:text-default-400 whitespace-nowrap"
          >
            {title}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={[
              "shrink-0 overflow-hidden transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              open
                ? "w-4 h-4 ml-2 opacity-100 rotate-180"
                : "w-0 h-4 ml-0 opacity-0 rotate-0",
            ].join(" ")}
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* content */}
        <div
          className={[
            "grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            open
              ? "grid-rows-[1fr] opacity-100 delay-100"
              : "grid-rows-[0fr] opacity-0",
          ].join(" ")}
        >
          <div className="overflow-hidden">
            <div
              className="px-5 pb-4 text-sm leading-relaxed cursor-default [&>p:first-child]:mt-0 [&>p:last-child]:mb-0"
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
