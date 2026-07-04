"use client";

import { useState, useMemo } from "react";
import type { EssayEntry } from "@/lib/content";
import { cn } from "@/lib/cn";
import dayjs from "@/lib/dayjs";
import SpotlightCard from "@/components/react-bits/SpotlightCard";
import { ArrowUpRight, CalendarDays, Feather } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const PAGE_SIZE = 10;

interface YearGroup {
  year: number;
  entries: EssayEntry[];
}

function groupByYear(entries: EssayEntry[]): YearGroup[] {
  const map = new Map<number, EssayEntry[]>();

  for (const entry of entries) {
    const year = dayjs(entry.date).year();
    if (!map.has(year)) map.set(year, []);
    map.get(year)!.push(entry);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => b - a)
    .map(([year, entries]) => ({ year, entries }));
}

function formatDate(dateStr: string): string {
  return dayjs(dateStr).format("M月D日");
}

function formatWeekday(dateStr: string): string {
  return dayjs(dateStr).format("dd");
}

function formatLongDate(dateStr: string): string {
  return dayjs(dateStr).format("YYYY年M月D日");
}

function cleanExcerpt(content: string): string {
  const plain = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/:[a-zA-Z0-9_-]+\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*_~`>|[\]()-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!plain) return "这一天还留着一段空白，先把时间钉在这里。";
  return plain.length > 108 ? `${plain.slice(0, 108)}...` : plain;
}

export default function EssayJournal({
  entries,
}: {
  entries: EssayEntry[];
}) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(entries.length / PAGE_SIZE);
  const pagedEntries = useMemo(
    () => entries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [entries, page],
  );
  const groups = useMemo(() => groupByYear(pagedEntries), [pagedEntries]);

  if (entries.length === 0) {
    return (
      <div className="surface rounded-3xl p-12 text-center text-default-400">
        还没有随笔。
      </div>
    );
  }

  let globalIndex = 0;

  return (
    <div className="essay-ledger flex flex-col gap-14">
      {groups.map((group) => (
        <section key={group.year} className="relative grid gap-6 md:grid-cols-[112px_minmax(0,1fr)]">
          <div className="md:sticky md:top-24 md:self-start">
            <span className="inline-flex h-14 min-w-24 items-center justify-center rounded-full surface px-5 font-mono text-2xl font-bold tracking-tighter text-zinc-400 dark:text-zinc-500 select-none">
              {group.year}
            </span>
          </div>

          <div className="relative pl-8 md:pl-10">
            <div
              className="absolute left-2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-zinc-300 to-transparent dark:via-zinc-700"
              aria-hidden
            />

            <div className="flex flex-col gap-7">
              {group.entries.map((entry) => {
                const idx = globalIndex++;

                return (
                  <EssayTimelineCard
                    key={entry.slug}
                    entry={entry}
                    index={idx}
                  />
                );
              })}
            </div>
          </div>
        </section>
      ))}

      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <div className="flex items-center gap-1 rounded-full surface p-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={cn(
                  "h-8 min-w-8 rounded-full px-3 text-sm font-medium transition-colors",
                  p === page
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950"
                    : "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/[0.08]"
                )}
                aria-current={p === page ? "page" : undefined}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EssayTimelineCard({
  entry,
  index
}: {
  entry: EssayEntry;
  index: number;
}) {
  const empty = entry.content.trim().length === 0;
  const monthDay = formatDate(entry.date);
  const weekday = formatWeekday(entry.date);
  const longDate = formatLongDate(entry.date);
  const excerpt = cleanExcerpt(entry.content);

  return (
    <article
      className="relative article-enter"
      style={{ "--enter-delay": `${index * 90}ms` } as React.CSSProperties}
    >
      <div
        className="absolute -left-[35px] top-9 z-10 h-4 w-4 rounded-full bg-[#f5f5f7] ring-1 ring-zinc-300 dark:bg-[#1d1d1f] dark:ring-zinc-700"
        aria-hidden
      >
        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/70 shadow-[0_0_18px_rgba(16,185,129,0.45)]" />
      </div>

      <Link href={`/essay/${entry.slug}`} className="block group">
        <SpotlightCard className="essay-note-card overflow-hidden rounded-[22px]">
          <div className="relative grid min-h-[260px] overflow-hidden rounded-[22px] surface transition-all duration-500 ease-[cubic-bezier(.23,1,.32,1)] group-hover:surface-raised group-hover:-translate-y-1 md:grid-cols-[minmax(0,1.04fr)_minmax(260px,0.96fr)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

            <div className="relative flex flex-col justify-between gap-9 p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300">
                    <CalendarDays size={19} />
                  </div>
                  <div className="flex flex-col">
                    <time dateTime={entry.date} className="font-mono text-[13px] font-semibold tracking-wide text-zinc-500 dark:text-zinc-400">
                      {longDate}
                    </time>
                    <span className="text-[12px] text-zinc-400 dark:text-zinc-600">
                      {weekday} / field note
                    </span>
                  </div>
                </div>

                <span className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.13em]",
                  empty
                    ? "bg-zinc-100 text-zinc-400 dark:bg-white/[0.06] dark:text-zinc-500"
                    : "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300"
                )}>
                  <Feather size={12} />
                  {empty ? "blank" : "written"}
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-end gap-3">
                  <span className="font-mono text-5xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 sm:text-6xl">
                    {monthDay.replace("月", ".").replace("日", "")}
                  </span>
                  <span className="pb-2 text-sm font-medium text-zinc-400 dark:text-zinc-500">
                    {weekday}
                  </span>
                </div>
                <p className="max-w-xl text-[15px] leading-7 text-zinc-600 dark:text-zinc-300">
                  {excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-600">
                  #{entry.slug}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-emerald-600 transition-transform duration-300 group-hover:translate-x-0.5 dark:text-emerald-300">
                  读这一天
                  <ArrowUpRight size={15} />
                </span>
              </div>
            </div>

            <div className="relative min-h-[210px] overflow-hidden border-t border-black/[0.04] md:border-l md:border-t-0 dark:border-white/[0.06]">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),transparent_42%),radial-gradient(circle_at_20%_12%,rgba(16,185,129,0.18),transparent_36%)]" />
              <div className="relative h-full min-h-[210px] overflow-hidden">
                <div className="absolute inset-4 overflow-hidden rounded-[18px] shadow-[0_18px_50px_rgba(0,0,0,0.14)] transition-transform duration-700 ease-out group-hover:scale-[1.025] dark:shadow-[0_18px_50px_rgba(0,0,0,0.38)]">
                  <Image
                    src={`/covers/${entry.slug}.png`}
                    alt={monthDay}
                    fill
                    loading="lazy"
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 38vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </SpotlightCard>
      </Link>
    </article>
  );
}
