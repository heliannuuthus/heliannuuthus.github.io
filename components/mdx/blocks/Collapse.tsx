"use client";

import { useState, useId } from "react";
import { ChevronUp } from "lucide-react";

interface CollapseProps {
  title?: string;
  children?: React.ReactNode;
}

export default function Collapse({
  title = "Details",
  children,
}: CollapseProps) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className="my-5 flex flex-col items-center">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer select-none transition-all duration-300 ${
          open
            ? "bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400"
            : "bg-default-100/80 dark:bg-default-100/8 text-default-500 dark:text-default-400 hover:bg-default-200/60 dark:hover:bg-default-100/12 hover:text-default-600 dark:hover:text-default-300"
        }`}
      >
        {title}
        <ChevronUp
          size={12}
          strokeWidth={2.5}
          className={`shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            open ? "" : "rotate-180"
          }`}
        />
      </button>

      <div
        id={`${id}-panel`}
        role="region"
        className={`w-full grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          open ? "opacity-100" : "opacity-0"
        }`}
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div
            data-collapse-content=""
            className="mt-2 surface rounded-xl text-sm leading-relaxed"
          >
            <div className="p-4 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
