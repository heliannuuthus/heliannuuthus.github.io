"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import Link from "next/link";

interface TagStampsProps {
  tags: string[];
  backHref: string;
}

export default function TagStamps({ tags, backHref }: TagStampsProps) {
  const [fanned, setFanned] = useState(false);

  if (tags.length === 0) return null;

  const count = tags.length;

  return (
    <div
      className={cn("relative shrink-0 ml-4", fanned && "z-50")}
      onMouseEnter={() => setFanned(true)}
      onMouseLeave={() => setFanned(false)}
    >
      {/* Invisible spacer for base size */}
      <div className="invisible">
        <div className="px-3 py-2 border-[1.5px]">
          <span className="text-[13px] font-bold">&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </div>
      </div>

      {tags.map((tag, i) => {
        const mid = (count - 1) / 2;
        const offset = i - mid;

        const stackTransform = `rotate(${offset * 3}deg)`;
        const fanTransform = `translateX(${offset * 60}px) rotate(${offset * 6}deg)`;

        return (
          <Link
            key={tag}
            href={`${backHref}?tag=${encodeURIComponent(tag)}`}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: fanned ? fanTransform : stackTransform,
              zIndex: fanned
                ? count - Math.abs(Math.round(offset))
                : count - i,
              transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
              transitionDelay: fanned
                ? `${i * 35}ms`
                : `${(count - 1 - i) * 35}ms`
            }}
          >
            <div className="border-[1.5px] border-dashed border-emerald-500/30 dark:border-emerald-400/25 rounded px-3 py-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm shadow-sm hover:border-emerald-500/50 dark:hover:border-emerald-400/40 hover:shadow-md transition-[border-color,box-shadow] duration-200">
              <span className="text-[13px] font-bold text-emerald-600 dark:text-emerald-400 leading-tight whitespace-nowrap">
                {tag}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
