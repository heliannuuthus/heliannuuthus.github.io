"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import type { Term } from "@/lib/terms";

const categoryLabels: Record<string, string> = {
  auth:   "认证与授权",
  crypto: "密码学",
  dl:     "深度学习",
  java:   "Java",
  k8s:    "Kubernetes",
  math:   "数学",
  net:    "计算机网络",
  os:     "操作系统",
  web:    "Web 开发",
};

const categoryDots: Record<string, string> = {
  auth:   "bg-rose-500",
  crypto: "bg-amber-500",
  dl:     "bg-violet-500",
  java:   "bg-orange-500",
  k8s:    "bg-sky-500",
  math:   "bg-teal-500",
  net:    "bg-cyan-500",
  os:     "bg-emerald-500",
  web:    "bg-indigo-500",
};

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

/* ── Single card with 3D tilt ── */

function TermCard({
  term,
  index,
  ghosted,
  onFocus,
}: {
  term: Term;
  index: number;
  ghosted: boolean;
  onFocus: () => void;
}) {
  const tiltRef = useRef<HTMLDivElement>(null);
  const preview = term.definition ? stripTags(term.definition) : "";
  const dot = categoryDots[term.category] || "bg-zinc-400";

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (ghosted || !tiltRef.current) return;
      const rect = tiltRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      tiltRef.current.style.transform = `perspective(600px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) translateZ(8px)`;
    },
    [ghosted],
  );

  const handleMouseLeave = useCallback(() => {
    if (!tiltRef.current) return;
    tiltRef.current.style.transform = "";
  }, []);

  return (
    <div
      className="term-card-enter"
      style={{ "--enter-delay": `${index * 40}ms` } as React.CSSProperties}
    >
      <div
        ref={tiltRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="will-change-transform"
        style={{ transition: "transform 0.15s ease-out" }}
      >
        <div
          role="button"
          tabIndex={0}
          onClick={onFocus}
          onKeyDown={(e) => { if (e.key === "Enter") onFocus(); }}
          className={clsx(
            "surface rounded-2xl p-5 cursor-pointer select-none",
            "hover:surface-raised hover:-translate-y-0.5",
            "transition-[opacity,filter,box-shadow,transform] duration-300 ease-[cubic-bezier(.23,1,.32,1)]",
            ghosted && "!opacity-[0.12] blur-[2px] pointer-events-none",
          )}
        >
          <div className="flex flex-col min-h-[110px]">
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-50 leading-snug tracking-tight">
                {term.title}
              </h3>
              {term.aliases && term.aliases.length > 0 && (
                <p className="text-[10px] italic text-zinc-400 dark:text-zinc-500 mt-0.5 truncate">
                  {term.aliases.join(", ")}
                </p>
              )}
              {preview && (
                <p className="text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2">
                  {preview}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1.5 mt-auto pt-3">
              <span className={clsx("w-1.5 h-1.5 rounded-full shrink-0", dot)} />
              <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 truncate">
                {categoryLabels[term.category] || term.category}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Focus overlay ── */

function FocusOverlay({
  term,
  onClose,
}: {
  term: Term;
  onClose: () => void;
}) {
  const dot = categoryDots[term.category] || "bg-zinc-400";

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 focus-overlay-enter">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        role="button"
        tabIndex={-1}
        aria-label="关闭"
        onKeyDown={(e) => { if (e.key === "Enter") onClose(); }}
      />

      {/* Centered content */}
      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8 pointer-events-none">
        <div
          className="relative pointer-events-auto surface-overlay rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto focus-card-enter"
          id={term.slug}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-7 pt-5 pb-3 backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <span className={clsx("w-2 h-2 rounded-full", dot)} />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                {categoryLabels[term.category] || term.category}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="关闭"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-7 pb-7">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 leading-snug tracking-tight">
              {term.title}
            </h2>
            {term.aliases && term.aliases.length > 0 && (
              <p className="text-[12px] italic text-zinc-400 dark:text-zinc-500 mt-1">
                {term.aliases.join(", ")}
              </p>
            )}

            {term.definition && (
              <div className="mt-5 pl-3 border-l-2 border-emerald-500/30 dark:border-emerald-400/20">
                <div
                  className="text-[13.5px] leading-[1.8] text-zinc-600 dark:text-zinc-300 term-content"
                  dangerouslySetInnerHTML={{ __html: term.definition }}
                />
              </div>
            )}

            {term.contentHtml && (
              <div
                className="mt-4 term-content text-[13.5px] leading-[1.8] text-zinc-700 dark:text-zinc-300"
                dangerouslySetInnerHTML={{ __html: term.contentHtml }}
              />
            )}

            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-zinc-200/60 dark:border-zinc-700/40">
              <Link
                href="https://github.com/heliannuuthus/heliannuuthus.github.io/edit/main/terminologies"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[12px] font-medium text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
                编辑词条
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main layout ── */

export default function TermsContent({ terms }: { terms: Term[] }) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [focusedTerm, setFocusedTerm] = useState<Term | null>(null);
  const [generation, setGeneration] = useState(0);

  const allCategories = useMemo(
    () => [...new Set(terms.map((t) => t.category))].sort(),
    [terms],
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const t of terms) counts[t.category] = (counts[t.category] || 0) + 1;
    return counts;
  }, [terms]);

  const visibleTerms = useMemo(() => {
    const base = selectedCategory
      ? terms.filter((t) => t.category === selectedCategory)
      : terms;
    return [...base].sort((a, b) => a.title.localeCompare(b.title));
  }, [terms, selectedCategory]);

  const matchingSlugs = useMemo(() => {
    if (!query) return null;
    const q = query.toLowerCase();
    return new Set(
      terms
        .filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.definition.toLowerCase().includes(q) ||
            t.slug.toLowerCase().includes(q) ||
            (t.aliases?.some((a) => a.toLowerCase().includes(q)) ?? false),
        )
        .map((t) => t.slug),
    );
  }, [terms, query]);

  const changeCategory = useCallback((cat: string | null) => {
    setSelectedCategory(cat);
    setGeneration((g) => g + 1);
  }, []);

  const closeFocus = useCallback(() => setFocusedTerm(null), []);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const target = terms.find((t) => t.slug === hash);
      if (target) setFocusedTerm(target);
    }
  }, [terms]);

  const matchedCount =
    matchingSlugs !== null
      ? visibleTerms.filter((t) => matchingSlugs.has(t.slug)).length
      : null;

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6">
      {/* Search */}
      <div className="relative max-w-md mx-auto">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索术语..."
          className="w-full h-10 pl-10 pr-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/40 text-sm text-zinc-900 dark:text-zinc-100 outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 transition-all"
        />
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap justify-center gap-1.5 mt-5">
        <button
          onClick={() => changeCategory(null)}
          className={clsx(
            "px-3.5 py-1.5 rounded-xl text-[12px] font-medium transition-all duration-200",
            selectedCategory === null
              ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
              : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300",
          )}
        >
          全部
          <span className="ml-1 opacity-40 tabular-nums">{terms.length}</span>
        </button>
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => changeCategory(cat)}
            className={clsx(
              "px-3.5 py-1.5 rounded-xl text-[12px] font-medium transition-all duration-200",
              selectedCategory === cat
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300",
            )}
          >
            {categoryLabels[cat] || cat}
            <span className="ml-1 opacity-40 tabular-nums">{categoryCounts[cat] || 0}</span>
          </button>
        ))}
      </div>

      {/* Card grid */}
      {visibleTerms.length === 0 ? (
        <div className="py-20 text-center text-zinc-400 dark:text-zinc-500 text-sm">
          暂无术语条目
        </div>
      ) : (
        <div
          key={generation}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8"
        >
          {visibleTerms.map((term, i) => (
            <TermCard
              key={term.slug}
              term={term}
              index={i}
              ghosted={matchingSlugs !== null && !matchingSlugs.has(term.slug)}
              onFocus={() => setFocusedTerm(term)}
            />
          ))}
        </div>
      )}

      {/* Footer */}
      {visibleTerms.length > 0 && (
        <p className="text-center text-[11px] text-zinc-300 dark:text-zinc-600 mt-8">
          {matchedCount !== null ? `${matchedCount} / ` : ""}
          {visibleTerms.length} 条术语
        </p>
      )}

      {/* Focus overlay */}
      {focusedTerm && <FocusOverlay term={focusedTerm} onClose={closeFocus} />}
    </div>
  );
}
