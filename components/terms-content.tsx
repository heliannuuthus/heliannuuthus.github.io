"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import type { Term } from "@/lib/terms";

const TERMS_PER_PAGE = 5;

const categoryMeta: Record<string, { label: string; color: string; activeBg: string; hoverBg: string }> = {
  auth:   { label: "Auth",          color: "bg-rose-500",    activeBg: "bg-rose-500",    hoverBg: "hover:bg-rose-50 dark:hover:bg-rose-950/30" },
  crypto: { label: "Crypto",        color: "bg-amber-500",   activeBg: "bg-amber-500",   hoverBg: "hover:bg-amber-50 dark:hover:bg-amber-950/30" },
  dl:     { label: "Deep Learning", color: "bg-violet-500",  activeBg: "bg-violet-500",  hoverBg: "hover:bg-violet-50 dark:hover:bg-violet-950/30" },
  java:   { label: "Java",          color: "bg-orange-500",  activeBg: "bg-orange-500",  hoverBg: "hover:bg-orange-50 dark:hover:bg-orange-950/30" },
  k8s:    { label: "K8s",           color: "bg-sky-500",     activeBg: "bg-sky-500",     hoverBg: "hover:bg-sky-50 dark:hover:bg-sky-950/30" },
  math:   { label: "Math",          color: "bg-teal-500",    activeBg: "bg-teal-500",    hoverBg: "hover:bg-teal-50 dark:hover:bg-teal-950/30" },
  net:    { label: "Network",       color: "bg-cyan-500",    activeBg: "bg-cyan-500",    hoverBg: "hover:bg-cyan-50 dark:hover:bg-cyan-950/30" },
  os:     { label: "OS",            color: "bg-emerald-500", activeBg: "bg-emerald-500", hoverBg: "hover:bg-emerald-50 dark:hover:bg-emerald-950/30" },
  web:    { label: "Web",           color: "bg-indigo-500",  activeBg: "bg-indigo-500",  hoverBg: "hover:bg-indigo-50 dark:hover:bg-indigo-950/30" },
};

const fallbackColors = [
  { color: "bg-pink-500", activeBg: "bg-pink-500", hoverBg: "hover:bg-pink-50 dark:hover:bg-pink-950/30" },
  { color: "bg-lime-500", activeBg: "bg-lime-500", hoverBg: "hover:bg-lime-50 dark:hover:bg-lime-950/30" },
];

function catMeta(key: string, idx: number) {
  const m = categoryMeta[key];
  if (m) return m;
  const fb = fallbackColors[idx % fallbackColors.length];
  return { label: key.charAt(0).toUpperCase() + key.slice(1), ...fb };
}

function chunk<T>(arr: T[], size: number): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < arr.length; i += size) pages.push(arr.slice(i, i + size));
  return pages;
}

interface PageData {
  category: string;
  terms: Term[];
  pageNum: number;
}

function buildPages(terms: Term[]): PageData[] {
  const grouped: Record<string, Term[]> = {};
  for (const t of terms) (grouped[t.category] ||= []).push(t);
  const pages: PageData[] = [];
  let pageNum = 1;
  for (const [category, items] of Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b))) {
    for (const ch of chunk(items, TERMS_PER_PAGE)) {
      pages.push({ category, terms: ch, pageNum: pageNum++ });
    }
  }
  return pages;
}

function TermEntry({ term, expanded, onToggle }: { term: Term; expanded: boolean; onToggle: () => void }) {
  const meta = catMeta(term.category, 0);
  const hasDetail = !!(term.contentHtml || term.definition);

  return (
    <div id={term.slug} className="scroll-mt-24">
      <button
        onClick={onToggle}
        className="w-full text-left py-2.5 group/entry"
      >
        <div className="flex items-baseline gap-2">
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${meta.color} shrink-0 translate-y-[-1px]`} />
          <h3 className="font-bold text-[14px] text-zinc-900 dark:text-zinc-50 group-hover/entry:text-emerald-600 dark:group-hover/entry:text-emerald-400 transition-colors">
            {term.title}
          </h3>
          {term.aliases && term.aliases.length > 0 && (
            <span className="text-[10px] italic text-zinc-400 dark:text-zinc-500">
              {term.aliases.join(", ")}
            </span>
          )}
          {hasDetail && (
            <svg
              className={`w-3 h-3 ml-auto shrink-0 text-zinc-300 dark:text-zinc-600 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
        <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 mt-0.5 ml-3.5">
          /{term.slug}/
        </p>
      </button>

      {hasDetail && (
        <div
          className="overflow-hidden transition-all duration-300 ease-out"
          style={{ maxHeight: expanded ? "2000px" : "0", opacity: expanded ? 1 : 0 }}
        >
          <div className="ml-3.5 pb-4 pt-1">
            {/* Definition — 释义摘要 */}
            {term.definition && (
              <div className="mb-3 pl-3 border-l-2 border-emerald-400/60 dark:border-emerald-500/40">
                <p
                  className="text-[12px] leading-[1.75] text-zinc-600 dark:text-zinc-300 term-content"
                  dangerouslySetInnerHTML={{ __html: term.definition }}
                />
              </div>
            )}

            {/* Full content — 词条正文 */}
            {term.contentHtml && (
              <div
                className="term-content text-[12px] leading-[1.75] text-zinc-700 dark:text-zinc-300"
                dangerouslySetInnerHTML={{ __html: term.contentHtml }}
              />
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 mt-3 pt-2 border-t border-dashed border-zinc-200/60 dark:border-zinc-700/40">
              <Link
                href={`https://github.com/heliannuuthus/heliannuuthus.github.io/edit/main/terminologies`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
                编辑词条
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="border-b border-zinc-200/40 dark:border-zinc-700/30" />
    </div>
  );
}

function PageContent({
  page,
  totalPages,
  expandedSlug,
  onToggle,
}: {
  page: PageData;
  totalPages: number;
  expandedSlug: string | null;
  onToggle: (slug: string) => void;
}) {
  const meta = catMeta(page.category, 0);
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2 pb-2 border-b-2 border-zinc-300/50 dark:border-zinc-600/40">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${meta.color}`} />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
            {catMeta(page.category, 0).label}
          </span>
        </div>
        <span className="text-[10px] tabular-nums text-zinc-400 dark:text-zinc-500">
          {page.pageNum}
        </span>
      </div>

      <div className="flex-1">
        {page.terms.map((t) => (
          <TermEntry
            key={t.slug}
            term={t}
            expanded={expandedSlug === t.slug}
            onToggle={() => onToggle(t.slug)}
          />
        ))}
      </div>

      <div className="pt-2 mt-auto">
        <p className="text-[9px] text-center text-zinc-300 dark:text-zinc-600 tabular-nums">
          — {page.pageNum} / {totalPages} —
        </p>
      </div>
    </div>
  );
}

export default function TermsContent({ terms }: { terms: Term[] }) {
  const [query, setQuery] = useState("");
  const [spread, setSpread] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [flipDir, setFlipDir] = useState<"next" | "prev">("next");
  const [prevSpread, setPrevSpread] = useState(0);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!query) return terms;
    const q = query.toLowerCase();
    return terms.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q) ||
        t.slug.toLowerCase().includes(q) ||
        (t.aliases?.some((a) => a.toLowerCase().includes(q)) ?? false)
    );
  }, [terms, query]);

  const pages = useMemo(() => buildPages(filtered), [filtered]);
  const totalSpreads = Math.max(1, Math.ceil(pages.length / 2));

  const categories = useMemo(() => {
    const cats: { key: string; spreadIdx: number; idx: number }[] = [];
    const seen = new Set<string>();
    let idx = 0;
    for (let i = 0; i < pages.length; i++) {
      if (!seen.has(pages[i].category)) {
        seen.add(pages[i].category);
        cats.push({ key: pages[i].category, spreadIdx: Math.floor(i / 2), idx: idx++ });
      }
    }
    return cats;
  }, [pages]);

  const currentCategories = useMemo(() => {
    const cats = new Set<string>();
    const l = pages[spread * 2];
    const r = pages[spread * 2 + 1];
    if (l) cats.add(l.category);
    if (r) cats.add(r.category);
    return cats;
  }, [pages, spread]);

  const flipTo = useCallback(
    (target: number) => {
      if (flipping) return;
      const clamped = Math.max(0, Math.min(target, totalSpreads - 1));
      if (clamped === spread) return;
      setFlipDir(clamped > spread ? "next" : "prev");
      setPrevSpread(spread);
      setSpread(clamped);
      setFlipping(true);
      setExpandedSlug(null);
      setTimeout(() => {
        setFlipping(false);
      }, 600);
    },
    [spread, totalSpreads, flipping]
  );

  const leftPage = pages[spread * 2] || null;
  const rightPage = pages[spread * 2 + 1] || null;

  const flipLeftPage = pages[prevSpread * 2] || null;
  const flipRightPage = pages[prevSpread * 2 + 1] || null;

  useEffect(() => {
    setSpread(0);
    setExpandedSlug(null);
  }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") flipTo(spread - 1);
      if (e.key === "ArrowRight") flipTo(spread + 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [spread, flipTo]);

  const toggleExpand = useCallback((slug: string) => {
    setExpandedSlug((prev) => (prev === slug ? null : slug));
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="w-full max-w-2xl">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索术语..."
          className="w-full h-10 px-4 rounded-xl bg-default-100 dark:bg-default-100/10 text-sm outline-none placeholder:text-default-400 focus:ring-2 focus:ring-emerald-500/30 transition-shadow"
        />
      </div>

      {pages.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center text-default-400 w-full max-w-2xl">
          {query ? `未找到与「${query}」相关的术语` : "暂无术语条目"}
        </div>
      ) : (
        <>
          <div className="relative" style={{ perspective: "2000px" }}>
            <div
              className="relative flex shadow-2xl shadow-black/20 dark:shadow-black/50 rounded-sm"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Spine */}
              <div className="absolute -left-4 top-0 bottom-0 w-4 rounded-l-md overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-900/90 via-amber-800 to-amber-900/70 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-700" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/10" />
                <div className="absolute inset-y-0 right-0 w-px bg-black/20" />
              </div>

              {/* Left page */}
              <div className="relative w-[340px] sm:w-[380px] h-[540px] bg-[#faf8f4] dark:bg-[#1e1e20] p-6 border-r border-zinc-200/50 dark:border-zinc-700/40 overflow-y-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/[0.04] via-transparent to-transparent dark:from-white/[0.02] pointer-events-none" />
                {leftPage ? (
                  <PageContent page={leftPage} totalPages={pages.length} expandedSlug={expandedSlug} onToggle={toggleExpand} />
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-300 dark:text-zinc-600 text-sm italic">空白页</div>
                )}
              </div>

              {/* Right page */}
              <div className="relative w-[340px] sm:w-[380px] h-[540px] bg-[#fdfcf9] dark:bg-[#222224] p-6 overflow-y-auto">
                <div className="absolute inset-0 bg-gradient-to-l from-zinc-900/[0.04] via-transparent to-transparent dark:from-white/[0.02] pointer-events-none" />
                {rightPage ? (
                  <PageContent page={rightPage} totalPages={pages.length} expandedSlug={expandedSlug} onToggle={toggleExpand} />
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-300 dark:text-zinc-600 text-sm italic">空白页</div>
                )}
              </div>

              {/* Flip page — front has old content, back is paper texture */}
              {flipping && (
                <>
                  <div
                    className="absolute top-0 h-full z-10 pointer-events-none"
                    style={{
                      left: flipDir === "next" ? "50%" : "0",
                      width: "50%",
                      animation: `shadowSlide${flipDir === "next" ? "Next" : "Prev"} 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards`,
                    }}
                  />

                  <div
                    className="absolute top-0 w-[340px] sm:w-[380px] h-full z-20 pointer-events-none"
                    style={{
                      transformStyle: "preserve-3d",
                      transformOrigin: flipDir === "next" ? "left center" : "right center",
                      left: flipDir === "next" ? "50%" : "0",
                      animation: `pageFlip${flipDir === "next" ? "Next" : "Prev"} 600ms cubic-bezier(0.35, 0, 0.15, 1) forwards`,
                    }}
                  >
                    {/* Front face — old page content */}
                    <div
                      className="absolute inset-0 bg-[#fdfcf9] dark:bg-[#222224] p-6 overflow-hidden"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      {flipDir === "next" && flipRightPage && (
                        <PageContent page={flipRightPage} totalPages={pages.length} expandedSlug={null} onToggle={() => {}} />
                      )}
                      {flipDir === "prev" && flipLeftPage && (
                        <PageContent page={flipLeftPage} totalPages={pages.length} expandedSlug={null} onToggle={() => {}} />
                      )}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: flipDir === "next"
                            ? "linear-gradient(to left, transparent 60%, rgba(0,0,0,0.05))"
                            : "linear-gradient(to right, transparent 60%, rgba(0,0,0,0.05))",
                        }}
                      />
                    </div>
                    {/* Back face — paper texture */}
                    <div
                      className="absolute inset-0 bg-[#f5f3ef] dark:bg-[#1a1a1c]"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: flipDir === "next"
                            ? "linear-gradient(to right, rgba(0,0,0,0.06) 0%, transparent 40%)"
                            : "linear-gradient(to left, rgba(0,0,0,0.06) 0%, transparent 40%)",
                        }}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Category tabs — colored ribbon bookmarks */}
              <div className="absolute -right-11 top-3 bottom-3 flex flex-col gap-1 w-9">
                {categories.map(({ key, spreadIdx, idx }) => {
                  const m = catMeta(key, idx);
                  const active = currentCategories.has(key);
                  return (
                    <button
                      key={key}
                      onClick={() => flipTo(spreadIdx)}
                      className={`
                        relative flex items-center justify-center flex-1 min-h-0
                        rounded-r-lg text-[7px] font-bold uppercase tracking-wider writing-vertical
                        transition-all duration-200 overflow-hidden
                        ${active
                          ? `${m.activeBg} text-white shadow-md scale-x-110 origin-left`
                          : `bg-white/90 dark:bg-zinc-800/90 text-zinc-500 dark:text-zinc-400 ${m.hoverBg} shadow-sm`
                        }
                      `}
                      title={m.label}
                    >
                      {!active && (
                        <span className={`absolute left-0 top-0 bottom-0 w-[3px] ${m.color}`} />
                      )}
                      <span className="relative z-10">{m.label.length > 5 ? m.label.slice(0, 5) : m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => flipTo(spread - 1)}
              disabled={spread === 0 || flipping}
              className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-default-100 dark:bg-default-100/10 hover:bg-default-200 dark:hover:bg-default-100/20 text-zinc-700 dark:text-zinc-300"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              上一页
            </button>
            <span className="text-xs tabular-nums text-zinc-400 dark:text-zinc-500 min-w-[4rem] text-center">
              {spread + 1} / {totalSpreads}
            </span>
            <button
              onClick={() => flipTo(spread + 1)}
              disabled={spread >= totalSpreads - 1 || flipping}
              className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-default-100 dark:bg-default-100/10 hover:bg-default-200 dark:hover:bg-default-100/20 text-zinc-700 dark:text-zinc-300"
            >
              下一页
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </>
      )}

      <style>{`
        @keyframes pageFlipNext {
          0%   { transform: rotateY(0deg); }
          40%  { transform: rotateY(-90deg); }
          100% { transform: rotateY(-180deg); }
        }
        @keyframes pageFlipPrev {
          0%   { transform: rotateY(0deg); }
          40%  { transform: rotateY(90deg); }
          100% { transform: rotateY(180deg); }
        }
        @keyframes shadowSlideNext {
          0%   { box-shadow: -4px 0 16px -4px rgba(0,0,0,0); }
          30%  { box-shadow: -20px 0 40px -8px rgba(0,0,0,0.25); }
          70%  { box-shadow: -30px 0 50px -10px rgba(0,0,0,0.2); }
          100% { box-shadow: -4px 0 16px -4px rgba(0,0,0,0); }
        }
        @keyframes shadowSlidePrev {
          0%   { box-shadow: 4px 0 16px -4px rgba(0,0,0,0); }
          30%  { box-shadow: 20px 0 40px -8px rgba(0,0,0,0.25); }
          70%  { box-shadow: 30px 0 50px -10px rgba(0,0,0,0.2); }
          100% { box-shadow: 4px 0 16px -4px rgba(0,0,0,0); }
        }
        .writing-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </div>
  );
}
