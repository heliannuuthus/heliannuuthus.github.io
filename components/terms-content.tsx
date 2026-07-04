"use client";

import { useState, useMemo, useEffect } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import dynamic from "next/dynamic";
import type { Term } from "@/lib/terms";
import SpotlightCard from "@/components/SpotlightCard";
import SplitText from "@/components/SplitText";
import { BookOpen, ChevronDown, GitBranch, Search, Sparkles, X } from "lucide-react";

const TermsGalaxy = dynamic(() => import("./TermsGalaxy"), { ssr: false });

export interface RenderedTermMap {
  [slug: string]: { definition?: ReactNode; content?: ReactNode };
}

/* ── Category visuals (for overlay only) ── */

const categoryMeta: Record<string, { label: string; dot: string; gradient: string }> = {
  auth:   { label: "认证与授权", dot: "bg-rose-500",    gradient: "from-rose-500 to-pink-500" },
  crypto: { label: "密码学",     dot: "bg-amber-500",   gradient: "from-amber-500 to-orange-500" },
  dl:     { label: "深度学习",   dot: "bg-violet-500",  gradient: "from-violet-500 to-purple-500" },
  java:   { label: "Java",       dot: "bg-orange-500",  gradient: "from-orange-500 to-red-500" },
  k8s:    { label: "Kubernetes",  dot: "bg-sky-500",     gradient: "from-sky-500 to-blue-500" },
  math:   { label: "数学",       dot: "bg-teal-500",    gradient: "from-teal-500 to-cyan-500" },
  net:    { label: "计算机网络", dot: "bg-cyan-500",    gradient: "from-cyan-500 to-blue-500" },
  os:     { label: "操作系统",   dot: "bg-emerald-500", gradient: "from-emerald-500 to-green-500" },
  web:    { label: "Web 开发",   dot: "bg-indigo-500",  gradient: "from-indigo-500 to-blue-500" },
};

function cm(cat: string) {
  return categoryMeta[cat] || { label: cat, dot: "bg-zinc-400", gradient: "from-zinc-400 to-zinc-500" };
}

function stripInline(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/:[a-zA-Z0-9_-]+\[([^\]]+)\](?:\([^)]*\)|\{[^}]*\})?/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*_~`>|[\]()-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* ── Focus overlay ── */

function FocusOverlay({
  term, renderedContent, relatedTerms, onClose, onNavigate,
}: {
  term: Term;
  renderedContent?: { definition?: ReactNode; content?: ReactNode };
  relatedTerms: Term[];
  onClose: () => void;
  onNavigate: (t: Term) => void;
}) {
  const c = cm(term.category);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 focus-overlay-enter">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose} role="button" tabIndex={-1} aria-label="关闭"
        onKeyDown={(e) => { if (e.key === "Enter") onClose(); }}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8 pointer-events-none">
        <div className="relative pointer-events-auto surface-overlay rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden focus-card-enter" id={term.slug}>
          <div className={cn("h-1 bg-gradient-to-r", c.gradient)} />
          <div className="overflow-y-auto max-h-[calc(85vh-4px)]">
            <div className="sticky top-0 z-10 flex items-center justify-between px-7 pt-5 pb-3 backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80">
              <div className="flex items-center gap-2">
                <span className={cn("w-2 h-2 rounded-full", c.dot)} />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">{c.label}</span>
              </div>
              <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" aria-label="关闭">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-7 pb-7">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 leading-snug tracking-tight">{term.title}</h2>
              {term.aliases && term.aliases.length > 0 && (
                <p className="text-[12px] italic text-zinc-400 dark:text-zinc-500 mt-1">{term.aliases.join(", ")}</p>
              )}
              {renderedContent?.definition && (
                <div className="mt-5 pl-3 border-l-2 border-emerald-500/30 dark:border-emerald-400/20">
                  <div className="text-[13.5px] leading-[1.8] text-zinc-600 dark:text-zinc-300 [&>div]:my-0">
                    {renderedContent.definition}
                  </div>
                </div>
              )}
              {renderedContent?.content && (
                <div className="mt-4 text-[13.5px] leading-[1.8] text-zinc-700 dark:text-zinc-300">
                  {renderedContent.content}
                </div>
              )}
              {relatedTerms.length > 0 && (
                <div className="mt-6 pt-4 border-t border-zinc-200/60 dark:border-zinc-700/40">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">相关术语</p>
                  <div className="flex flex-wrap gap-2">
                    {relatedTerms.map((rt) => (
                      <button key={rt.slug} onClick={() => onNavigate(rt)} className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                        {rt.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-zinc-200/60 dark:border-zinc-700/40">
                <Link href="https://github.com/heliannuuthus/heliannuuthus.github.io/edit/main/terminologies" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[12px] font-medium text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                  编辑词条
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main ── */

export default function TermsContent({
  terms,
  rendered,
}: {
  terms: Term[];
  rendered: RenderedTermMap;
}) {
  const [focusedTerm, setFocusedTerm] = useState<Term | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [controlsOpen, setControlsOpen] = useState(false);

  const categories = useMemo(() => {
    return [...new Set(terms.map((t) => t.category))]
      .sort()
      .map((category) => {
        const meta = cm(category);
        const count = terms.filter((term) => term.category === category).length;
        return { category, ...meta, count };
      });
  }, [terms]);

  const filteredTerms = useMemo(() => {
    const q = query.trim().toLowerCase();
    return terms
      .filter((term) => !selectedCategory || term.category === selectedCategory)
      .filter((term) => {
        if (!q) return true;
        const haystack = [
          term.slug,
          term.title,
          term.definition,
          term.content,
          ...(term.aliases ?? [])
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      })
      .slice(0, 9);
  }, [terms, selectedCategory, query]);

  const matchingSlugs = useMemo(() => {
    if (!query.trim() && !selectedCategory) return null;
    return new Set(filteredTerms.map((term) => term.slug));
  }, [filteredTerms, query, selectedCategory]);

  const relatedTerms = useMemo(() => {
    if (!focusedTerm) return [];
    return terms
      .filter((t) => t.category === focusedTerm.category && t.slug !== focusedTerm.slug)
      .slice(0, 8);
  }, [focusedTerm, terms]);

  useEffect(() => {
    const main = document.querySelector("main");
    if (main) main.classList.add("galaxy-main");
    return () => {
      if (main) main.classList.remove("galaxy-main");
    };
  }, []);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const target = terms.find((t) => t.slug === hash);
      if (target) setFocusedTerm(target);
    }
  }, [terms]);

  return (
    <>
      <section className="pointer-events-none fixed inset-x-0 top-[88px] z-20 mx-auto flex w-full max-w-5xl flex-col items-end gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={() => setControlsOpen((open) => !open)}
          className="pointer-events-auto inline-flex h-11 items-center gap-2 rounded-full bg-white/74 px-4 text-[12px] font-semibold text-zinc-600 shadow-[0_12px_34px_rgba(15,23,42,0.10),0_0_0_1px_rgba(15,23,42,0.04)] backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:bg-white/92 dark:bg-zinc-950/58 dark:text-zinc-300 dark:shadow-[0_18px_45px_rgba(0,0,0,0.28),0_0_0_1px_rgba(255,255,255,0.08)] dark:hover:bg-zinc-900/80"
          aria-expanded={controlsOpen}
          aria-controls="terms-atlas-controls"
        >
          <Sparkles size={14} className="text-emerald-500" />
          <span>{selectedCategory ? cm(selectedCategory).label : "Atlas"}</span>
          {(query || selectedCategory) && (
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-600 dark:text-emerald-300">
              {filteredTerms.length}
            </span>
          )}
          <ChevronDown
            size={14}
            className={cn("transition-transform duration-300", controlsOpen && "rotate-180")}
          />
        </button>

        {controlsOpen && (
          <div
            id="terms-atlas-controls"
            className="pointer-events-auto grid w-full gap-3 lg:grid-cols-[minmax(0,1fr)_300px]"
          >
          <div className="surface-overlay overflow-hidden rounded-[20px]">
            <div className="flex flex-col gap-4 p-4 sm:p-5">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-300">
                  <Sparkles size={14} />
                  terminology atlas
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-3xl">
                  <SplitText text="Terms Galaxy" delayStep={22} />
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                  每种术语是一枚星系，先按分类进入，再从轨道上的词条继续放大。
                </p>
              </div>

              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="搜索术语、别名、定义..."
                  className="h-11 w-full rounded-2xl border border-black/[0.04] bg-white/70 pl-10 pr-10 text-sm text-zinc-800 outline-none transition-colors placeholder:text-zinc-400 focus:border-emerald-400/50 dark:border-white/[0.06] dark:bg-zinc-950/36 dark:text-zinc-100"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-white/[0.08] dark:hover:text-zinc-200"
                    aria-label="清空搜索"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[12px] font-semibold transition-colors",
                    selectedCategory === null
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950"
                      : "bg-zinc-100/80 text-zinc-500 hover:bg-zinc-200/70 dark:bg-white/[0.06] dark:text-zinc-400 dark:hover:bg-white/[0.1]"
                  )}
                >
                  <GitBranch size={13} />
                  All {terms.length}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.category}
                    type="button"
                    onClick={() => setSelectedCategory(cat.category)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[12px] font-semibold transition-colors",
                      selectedCategory === cat.category
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950"
                        : "bg-zinc-100/80 text-zinc-500 hover:bg-zinc-200/70 dark:bg-white/[0.06] dark:text-zinc-400 dark:hover:bg-white/[0.1]"
                    )}
                  >
                    <span className={cn("h-2 w-2 rounded-full", cat.dot)} />
                    {cat.label} {cat.count}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="surface-overlay hidden overflow-hidden rounded-[20px] lg:block">
            <div className="flex h-full flex-col gap-3 p-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-[12px] font-semibold text-zinc-500 dark:text-zinc-400">
                  <BookOpen size={15} />
                  {filteredTerms.length} matches
                </div>
                {(query || selectedCategory) && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setSelectedCategory(null);
                    }}
                    className="text-[12px] font-semibold text-zinc-400 transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                  >
                    reset
                  </button>
                )}
              </div>

              <div className="flex max-h-[360px] flex-col gap-2 overflow-y-auto pr-1">
                {filteredTerms.map((term) => {
                  const c = cm(term.category);
                  const preview = stripInline(term.definition || term.content || "");
                  return (
                    <SpotlightCard key={term.slug} className="rounded-[18px]">
                      <button
                        type="button"
                        onClick={() => setFocusedTerm(term)}
                        className="group w-full rounded-[18px] bg-white/68 p-3 text-left ring-1 ring-black/[0.04] transition-colors hover:bg-white/90 dark:bg-zinc-950/32 dark:ring-white/[0.06] dark:hover:bg-zinc-900/70"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={cn("h-2 w-2 rounded-full", c.dot)} />
                              <span className="truncate text-[14px] font-semibold text-zinc-900 dark:text-zinc-100">
                                {term.title}
                              </span>
                            </div>
                            {preview && (
                              <p className="mt-1.5 line-clamp-2 text-[12px] leading-5 text-zinc-500 dark:text-zinc-400">
                                {preview}
                              </p>
                            )}
                          </div>
                          <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-1 font-mono text-[10px] text-zinc-400 dark:bg-white/[0.06] dark:text-zinc-500">
                            {term.category}
                          </span>
                        </div>
                      </button>
                    </SpotlightCard>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        )}
      </section>

      <TermsGalaxy
        terms={terms}
        matchingSlugs={matchingSlugs}
        selectedCategory={selectedCategory}
        onSelectTerm={setFocusedTerm}
        onSelectCategory={setSelectedCategory}
      />

      {focusedTerm && (
        <FocusOverlay
          term={focusedTerm}
          renderedContent={rendered[focusedTerm.slug]}
          relatedTerms={relatedTerms}
          onClose={() => setFocusedTerm(null)}
          onNavigate={setFocusedTerm}
        />
      )}
    </>
  );
}
