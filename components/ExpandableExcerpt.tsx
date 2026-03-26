"use client";

import { useState, useRef, useEffect } from "react";

interface ExpandableExcerptProps {
  text: string;
}

export default function ExpandableExcerpt({ text }: ExpandableExcerptProps) {
  const [expanded, setExpanded] = useState(false);
  const [clamped, setClamped] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) setClamped(el.scrollHeight > el.clientHeight);
  }, [text]);

  return (
    <div className="mt-4 relative">
      <p
        ref={ref}
        className={`text-[14px] leading-[1.7] text-zinc-500 dark:text-zinc-400 italic border-l-2 border-zinc-200 dark:border-zinc-700 pl-4 transition-all duration-300 ${expanded ? "" : "line-clamp-3"}`}
      >
        {text}
      </p>
      {clamped && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-1.5 pl-4 text-[12px] font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors cursor-pointer"
        >
          {expanded ? "收起 ↑" : "展开全文 ↓"}
        </button>
      )}
    </div>
  );
}
