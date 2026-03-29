import type { EssayEntry } from "@/lib/content";
import { cn } from "@/lib/cn";
import dayjs from "@/lib/dayjs";
import { Card } from "@heroui/react/card";
import Image from "next/image";
import Link from "next/link";

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

export default function EssayJournal({
  entries,
}: {
  entries: EssayEntry[];
}) {
  const published = entries.filter((e) => !e.draft);
  const groups = groupByYear(published);
  let globalIndex = 0;

  if (published.length === 0) {
    return (
      <div className="surface rounded-3xl p-12 text-center text-default-400">
        还没有随笔。
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      {groups.map((group) => (
        <section key={group.year} className="flex flex-col gap-0">
          {/* Year marker */}
          <div className="relative flex justify-center mb-8">
            <span className="relative z-10 px-5 py-1.5 rounded-full surface text-2xl font-bold tracking-tighter text-zinc-400 dark:text-zinc-500 select-none">
              {group.year}
            </span>
          </div>

          {/* Timeline entries */}
          <div className="relative">
            {/* Central line: mobile left-aligned, desktop centered */}
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
                    {/* Dot on timeline */}
                    <div className="absolute left-[15px] md:left-1/2 top-8 z-10 -translate-x-1/2" aria-hidden>
                      <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-600 ring-[3px] ring-[#f5f5f7] dark:ring-[#1d1d1f]" />
                    </div>

                    {/* Desktop grid: 3 columns [content | gap | content] */}
                    <div className="hidden md:grid md:grid-cols-[1fr_48px_1fr] items-start">
                      {isLeft ? (
                        <>
                          {/* Left: card */}
                          <div>
                            <CoverCard entry={entry} />
                          </div>
                          {/* Center gap (timeline lives here) */}
                          <div />
                          {/* Right: date label */}
                          <div className="flex items-center min-h-[60px] pt-5">
                            <DateLabel dateStr={entry.date} />
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Left: date label */}
                          <div className="flex items-center justify-end min-h-[60px] pt-5">
                            <DateLabel dateStr={entry.date} align="right" />
                          </div>
                          {/* Center gap */}
                          <div />
                          {/* Right: card */}
                          <div>
                            <CoverCard entry={entry} />
                          </div>
                        </>
                      )}
                    </div>

                    {/* Mobile: single column, card to the right of timeline */}
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
