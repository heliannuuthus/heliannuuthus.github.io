import { Avatar } from "@heroui/react/avatar";
import Link from "next/link";
import ExpandableExcerpt from "@/components/ExpandableExcerpt";
import TagStamps from "@/components/TagStamps";
import type { Author, PostMeta } from "@/lib/content";

interface ArticleHeaderProps {
  meta: PostMeta;
  authors: Record<string, Author>;
  backHref: string;
  readingTime?: number;
}

export default function ArticleHeader({
  meta,
  authors,
  backHref,
  readingTime
}: ArticleHeaderProps) {
  const d = new Date(meta.date);
  const dateStr = d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const monthLabel = d.toLocaleDateString("zh-CN", { month: "short" });
  const dayNum = d.getDate();

  const authorNames = meta.authors
    .map((k) => authors[k]?.name ?? k)
    .join(", ");
  const firstAuthor = meta.authors[0] ? authors[meta.authors[0]] : null;

  return (
    <header className="relative z-10 py-6 article-enter" style={{ "--enter-delay": "0ms" } as React.CSSProperties}>
      {/* Envelope card */}
      <div className="relative surface rounded-2xl px-8 sm:px-12 py-10 sm:py-12 -rotate-[1.2deg] hover:rotate-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]">

        {/* Airmail stripe — top */}
        <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl bg-[repeating-linear-gradient(-45deg,transparent,transparent_5px,#ef444480_5px,#ef444480_10px,transparent_10px,transparent_15px,#3b82f680_15px,#3b82f680_20px)] opacity-40 dark:opacity-20" />

        {/* Top row: From + Stamp */}
        <div className="flex items-start justify-between mb-10 sm:mb-12">
          {/* From: author */}
          <div className="flex items-center gap-3">
            {firstAuthor?.image_url && (
              <Avatar size="sm" className="ring-2 ring-white dark:ring-zinc-800 shadow-sm">
                <Avatar.Image src={firstAuthor.image_url} alt={firstAuthor.name} />
                <Avatar.Fallback>{firstAuthor.name.charAt(0)}</Avatar.Fallback>
              </Avatar>
            )}
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500 leading-none mb-1">
                From
              </span>
              <span className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-100 leading-tight">
                {authorNames}
              </span>
            </div>
          </div>

          {/* Stamps: stacked tags, fan out on hover */}
          <TagStamps tags={meta.tags} backHref={backHref} />
        </div>

        {/* Title — the "address" */}
        <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-[-0.02em] leading-[1.12] text-zinc-950 dark:text-white">
          {meta.title}
        </h1>

        {/* Excerpt — letter body, click to expand */}
        {meta.description && (
          <ExpandableExcerpt text={meta.description} />
        )}

        {/* Bottom: Postmark + reading time */}
        <div className="mt-10 flex items-center gap-4">
          {/* Postmark circle */}
          <div className="flex items-center justify-center w-12 h-12 rounded-full border-[1.5px] border-zinc-300/60 dark:border-zinc-600/50 -rotate-[6deg]">
            <div className="text-center leading-none">
              <div className="text-[9px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase">
                {monthLabel}
              </div>
              <div className="text-[18px] font-black text-zinc-600 dark:text-zinc-300 mt-px">
                {dayNum}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <time dateTime={meta.date} className="text-[13px] text-zinc-400 dark:text-zinc-500">
              {dateStr}
            </time>
            {readingTime != null && (
              <span className="text-[12px] text-zinc-400/70 dark:text-zinc-500/70">
                {readingTime} min read
              </span>
            )}
          </div>
        </div>

        {/* Airmail stripe — bottom */}
        <div className="absolute inset-x-0 bottom-0 h-[3px] rounded-b-2xl bg-[repeating-linear-gradient(-45deg,transparent,transparent_5px,#ef444480_5px,#ef444480_10px,transparent_10px,transparent_15px,#3b82f680_15px,#3b82f680_20px)] opacity-40 dark:opacity-20" />
      </div>
    </header>
  );
}
