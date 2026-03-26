"use client";

import { Popover } from "@heroui/react/popover";
import Link from "next/link";

interface TermPreviewProps {
  slug: string;
  title?: string;
  definition?: string;
  children?: React.ReactNode;
}

export default function TermPreview({
  slug,
  title,
  definition,
  children
}: TermPreviewProps) {
  const preview = title || definition;

  const trigger = (
    <span className="text-emerald-600 dark:text-emerald-400 border-b border-dotted border-emerald-400/50 hover:border-emerald-400 transition-colors cursor-pointer">
      {children}
    </span>
  );

  if (!preview) {
    return (
      <Link href={`/terms#${slug}`} className="inline">
        {trigger}
      </Link>
    );
  }

  return (
    <Popover>
      <Popover.Trigger className="!inline">{trigger}</Popover.Trigger>
      <Popover.Content placement="bottom" shouldFlip className="rounded-2xl overflow-hidden p-0 border-none shadow-none bg-transparent">
        <Popover.Dialog className="outline-none w-80 surface-overlay rounded-2xl overflow-hidden">
          <div className="px-5 pt-5 pb-4">
            <h4 className="text-[15px] font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {title || slug}
            </h4>
            <p className="text-[10px] font-medium tracking-widest uppercase text-zinc-400 dark:text-zinc-500 mt-0.5">
              {slug}
            </p>
            {definition && (
              <p className="mt-3 text-[13px] leading-[1.6] text-zinc-600 dark:text-zinc-300">
                {definition}
              </p>
            )}
          </div>
          <div className="flex items-center border-t border-zinc-200/60 dark:border-zinc-700/60">
            <Link
              href={`/terms#${slug}`}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-[12px] font-medium text-emerald-600 dark:text-emerald-400 hover:bg-zinc-100/60 dark:hover:bg-zinc-700/40 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              在词典中查看
            </Link>
            <span className="w-px h-5 bg-zinc-200/60 dark:bg-zinc-700/60" />
            <Link
              href={`https://github.com/heliannuuthus/heliannuuthus.github.io/edit/main/terminologies`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-[12px] font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100/60 dark:hover:bg-zinc-700/40 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              编辑词条
            </Link>
          </div>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}
