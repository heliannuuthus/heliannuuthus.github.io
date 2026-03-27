"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
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

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function TermEntry({
  term,
  expanded,
  onToggle,
}: {
  term: Term;
  expanded: boolean;
  onToggle: () => void;
}) {
  const canExpand = !!(term.contentHtml || term.definition);
  const preview = term.definition ? stripTags(term.definition) : "";

  return (
    <div
      id={term.slug}
      className="scroll-mt-28 border-b border-zinc-100 dark:border-zinc-800/50 last:border-b-0"
    >
      <button onClick={onToggle} className="w-full text-left py-4 group/btn">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-50 group-hover/btn:text-emerald-600 dark:group-hover/btn:text-emerald-400 transition-colors">
              {term.title}
              {term.aliases && term.aliases.length > 0 && (
                <span className="ml-2 text-[11px] font-normal italic text-zinc-400 dark:text-zinc-500">
                  {term.aliases.join(", ")}
                </span>
              )}
            </h3>
            {!expanded && preview && (
              <p className="text-[13px] text-zinc-400 dark:text-zinc-500 mt-1 line-clamp-1">
                {preview}
              </p>
            )}
          </div>
          {canExpand && (
            <svg
              className={`w-4 h-4 mt-0.5 shrink-0 text-zinc-300 dark:text-zinc-600 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      </button>

      {canExpand && (
        <div
          className="overflow-hidden transition-all duration-300 ease-out"
          style={{ maxHeight: expanded ? "3000px" : "0", opacity: expanded ? 1 : 0 }}
        >
          <div className="pb-5">
            {term.definition && (
              <div className="mb-3 pl-3 border-l-2 border-emerald-500/30 dark:border-emerald-400/20">
                <div
                  className="text-[13px] leading-[1.8] text-zinc-600 dark:text-zinc-300 term-content"
                  dangerouslySetInnerHTML={{ __html: term.definition }}
                />
              </div>
            )}

            {term.contentHtml && (
              <div
                className="term-content text-[13px] leading-[1.8] text-zinc-700 dark:text-zinc-300"
                dangerouslySetInnerHTML={{ __html: term.contentHtml }}
              />
            )}

            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-dashed border-zinc-200/60 dark:border-zinc-700/40">
              <Link
                href="https://github.com/heliannuuthus/heliannuuthus.github.io/edit/main/terminologies"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
      )}
    </div>
  );
}

export default function TermsContent({ terms }: { terms: Term[] }) {
  const [query, setQuery] = useState("");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const filtered = useMemo(() => {
    if (!query) return terms;
    const q = query.toLowerCase();
    return terms.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q) ||
        t.slug.toLowerCase().includes(q) ||
        (t.aliases?.some((a) => a.toLowerCase().includes(q)) ?? false),
    );
  }, [terms, query]);

  const grouped = useMemo(() => {
    const map: Record<string, Term[]> = {};
    for (const t of filtered) (map[t.category] ||= []).push(t);
    return map;
  }, [filtered]);

  const categories = useMemo(
    () => Object.keys(grouped).sort((a, b) => a.localeCompare(b)),
    [grouped],
  );

  useEffect(() => {
    if (categories.length > 0 && !categories.includes(activeCategory || "")) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  useEffect(() => {
    if (categories.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const cat = entry.target.getAttribute("data-category");
            if (cat) setActiveCategory(cat);
          }
        }
      },
      { rootMargin: "-15% 0px -65% 0px" },
    );

    for (const cat of categories) {
      const el = sectionRefs.current[cat];
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [categories]);

  const scrollToCategory = useCallback((cat: string) => {
    sectionRefs.current[cat]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const toggleExpand = useCallback((slug: string) => {
    setExpandedSlug((prev) => (prev === slug ? null : slug));
  }, []);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const target = terms.find((t) => t.slug === hash);
      if (target) {
        setExpandedSlug(hash);
        requestAnimationFrame(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "center" });
        });
      }
    }
  }, [terms]);

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 sm:px-0">
      {/* Search */}
      <div className="relative">
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

      {/* Category nav */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-1 mt-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => scrollToCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                  : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              {categoryLabels[cat] || cat}
              <span
                className={`ml-1 tabular-nums ${
                  activeCategory === cat
                    ? "text-zinc-400 dark:text-zinc-500"
                    : "text-zinc-300 dark:text-zinc-600"
                }`}
              >
                {grouped[cat].length}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center text-zinc-400 dark:text-zinc-500 text-sm">
          {query ? `未找到与「${query}」相关的术语` : "暂无术语条目"}
        </div>
      ) : (
        <div className="mt-6">
          {categories.map((cat) => (
            <section
              key={cat}
              ref={(el) => { sectionRefs.current[cat] = el; }}
              data-category={cat}
              className="scroll-mt-24"
            >
              <div className="flex items-center gap-3 pt-8 pb-3 first:pt-0">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
                  {categoryLabels[cat] || cat}
                </h2>
                <div className="flex-1 h-px bg-zinc-200/70 dark:bg-zinc-700/50" />
                <span className="text-[10px] tabular-nums text-zinc-300 dark:text-zinc-600">
                  {grouped[cat].length}
                </span>
              </div>

              {grouped[cat].map((t) => (
                <TermEntry
                  key={t.slug}
                  term={t}
                  expanded={expandedSlug === t.slug}
                  onToggle={() => toggleExpand(t.slug)}
                />
              ))}
            </section>
          ))}

          <p className="pt-10 pb-4 text-center text-[11px] text-zinc-300 dark:text-zinc-600">
            共 {filtered.length} 条术语
          </p>
        </div>
      )}
    </div>
  );
}
