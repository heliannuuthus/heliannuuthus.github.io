"use client";

import { cn } from "@/lib/cn";
import {
  StickyNote,
  Lightbulb,
  TriangleAlert,
  ShieldAlert,
  Info,
  CircleAlert,
  Sparkles,
  type LucideIcon
} from "lucide-react";

const config: Record<string, { accent: string; bg: string; Icon: LucideIcon }> = {
  note:    { accent: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/5 dark:bg-blue-400/5", Icon: StickyNote },
  tip:     { accent: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/5 dark:bg-emerald-400/5", Icon: Lightbulb },
  warning: { accent: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/5 dark:bg-amber-400/5", Icon: TriangleAlert },
  danger:  { accent: "text-red-600 dark:text-red-400", bg: "bg-red-500/5 dark:bg-red-400/5", Icon: ShieldAlert },
  info:    { accent: "text-sky-600 dark:text-sky-400", bg: "bg-sky-500/5 dark:bg-sky-400/5", Icon: Info },
  caution: { accent: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500/5 dark:bg-orange-400/5", Icon: CircleAlert },
  nerd:    { accent: "text-violet-600 dark:text-violet-400", bg: "bg-violet-500/5 dark:bg-violet-400/5", Icon: Sparkles }
};

interface AdmonitionProps {
  type?: string;
  title?: string;
  children?: React.ReactNode;
}

export default function Admonition({
  type = "note",
  title,
  children
}: AdmonitionProps) {
  const style = config[type] || config.note;
  const displayTitle = title || type.charAt(0).toUpperCase() + type.slice(1);
  const { Icon } = style;

  return (
    <div className={cn("rounded-2xl px-5 py-4 my-5", style.bg)}>
      <div className={cn("flex items-center gap-2 mb-2 text-[13px] font-semibold tracking-wide", style.accent)}>
        <Icon size={15} strokeWidth={2} />
        <span>{displayTitle}</span>
      </div>
      <div className="text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-300 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}
