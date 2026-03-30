"use client";

import { useState, useMemo } from "react";
import type { EssayEntry } from "@/lib/content";
import { cn } from "@/lib/cn";
import dayjs from "@/lib/dayjs";
import { Card } from "@heroui/react/card";
import { Pagination } from "@heroui/react/pagination";
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

function pageRange(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "ellipsis")[] = [1];
  if (current > 3) pages.push("ellipsis");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push("ellipsis");
  pages.push(total);
  return pages;
}

export default function EssayJournal({
  entries,
}: {
  entries: EssayEntry[];
}) {
  const [page, setPage] = useState(1);

  const goToPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
    <div className="flex flex-col gap-12">
      {groups.map((group) => (
        <section key={group.year} className="flex flex-col gap-0">
          <div className="relative flex justify-center mb-8">
            <span className="relative z-10 px-5 py-1.5 rounded-full surface text-2xl font-bold tracking-tighter text-zinc-400 dark:text-zinc-500 select-none">
              {group.year}
            </span>
          </div>

          <div className="relative">
            <div
              className="absolute top-0 bottom-0 left-[15px] md:left-1/2 w-px bg-zinc-200 dark:bg-zinc-800 md:-translate-x-px"
              aria-hidden
            />

            <div className="flex flex-col gap-12">
              {group.entries.map((entry) => {
                const idx = globalIndex++;
                const isLeft = idx % 2 === 0;

                return (
                  <div key={entry.slug} className="relative article-enter" style={{ "--enter-delay": `${idx * 100}ms` } as React.CSSProperties}>
                    <div className="absolute left-[15px] md:left-1/2 top-8 z-10 -translate-x-1/2" aria-hidden>
                      <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-600 ring-[3px] ring-[#f5f5f7] dark:ring-[#1d1d1f]" />
                    </div>

                    <div className="hidden md:grid md:grid-cols-[1fr_48px_1fr] items-start">
                      {isLeft ? (
                        <>
                          <div>
                            <CoverCard entry={entry} />
                          </div>
                          <div />
                          <div className="flex items-center min-h-[60px] pt-5">
                            <DateLabel dateStr={entry.date} />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center justify-end min-h-[60px] pt-5">
                            <DateLabel dateStr={entry.date} align="right" />
                          </div>
                          <div />
                          <div>
                            <CoverCard entry={entry} />
                          </div>
                        </>
                      )}
                    </div>

                    <div className="md:hidden pl-10">
                      <CoverCard entry={entry} />
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="font-mono text-sm font-semibold text-zinc-400 dark:text-zinc-500">
                          {formatDate(entry.date)}
                        </span>
                        <span className="text-xs text-zinc-400 dark:text-zinc-600">
                          {formatWeekday(entry.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination>
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.Previous onPress={() => goToPage(Math.max(1, page - 1))}>
                  <Pagination.PreviousIcon />
                </Pagination.Previous>
              </Pagination.Item>
              {pageRange(page, totalPages).map((item, i) =>
                item === "ellipsis" ? (
                  <Pagination.Item key={`e${i}`}>
                    <Pagination.Ellipsis />
                  </Pagination.Item>
                ) : (
                  <Pagination.Item key={item}>
                    <Pagination.Link
                      isActive={item === page}
                      onPress={() => goToPage(item)}
                    >
                      {item}
                    </Pagination.Link>
                  </Pagination.Item>
                ),
              )}
              <Pagination.Item>
                <Pagination.Next onPress={() => goToPage(Math.min(totalPages, page + 1))}>
                  <Pagination.NextIcon />
                </Pagination.Next>
              </Pagination.Item>
            </Pagination.Content>
          </Pagination>
        </div>
      )}
    </div>
  );
}

function CoverCard({ entry }: { entry: EssayEntry }) {
  return (
    <Link href={`/essay/${entry.slug}`} className="block group">
      <Card className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(.23,1,.32,1)] group-hover:-translate-y-1 group-hover:shadow-lg">
        <div className="relative w-full overflow-hidden aspect-[1200/630]">
          <Image
            src={`/covers/${entry.slug}.png`}
            alt={formatDate(entry.date)}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 45vw"
          />
        </div>
      </Card>
    </Link>
  );
}

function DateLabel({ dateStr, align = "left" }: { dateStr: string; align?: "left" | "right" }) {
  return (
    <div className={cn("flex items-baseline gap-2", align === "right" && "flex-row-reverse")}>
      <span className="font-mono text-xl font-bold tracking-tight text-zinc-400 dark:text-zinc-500">
        {formatDate(dateStr)}
      </span>
      <span className="text-xs text-zinc-400 dark:text-zinc-600">
        {formatWeekday(dateStr)}
      </span>
    </div>
  );
}
