"use client";

import { useState, useMemo, useEffect } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { Term } from "@/lib/terms";
import type { CategoryMeta } from "@/lib/category-meta";

const TermsGalaxy = dynamic(() => import("./TermsGalaxy"), { ssr: false });

export interface RenderedTermMap {
  [slug: string]: { definition?: ReactNode; content?: ReactNode };
}

/* ── Category visuals (for overlay only) ── */

const FALLBACK_COLOR: [number, number, number] = [161, 161, 170];

function rgba([r, g, b]: [number, number, number], a = 1) {
  return `rgba(${r},${g},${b},${a})`;
}

function brighten([r, g, b]: [number, number, number], k = 0.3): [number, number, number] {
  return [
    Math.min(255, Math.round(r + (255 - r) * k)),
    Math.min(255, Math.round(g + (255 - g) * k)),
    Math.min(255, Math.round(b + (255 - b) * k)),
  ];
}

function cm(cat: string, meta: Record<string, CategoryMeta>) {
  const m = meta[cat];
  if (!m) return { label: cat, color: FALLBACK_COLOR };
  return m;
}

/* ── Focus overlay ── */

function FocusOverlay({
  term, renderedContent, relatedTerms, onClose, onNavigate, categoryMeta,
}: {
  term: Term;
  renderedContent?: { definition?: ReactNode; content?: ReactNode };
  relatedTerms: Term[];
  onClose: () => void;
  onNavigate: (t: Term) => void;
  categoryMeta: Record<string, CategoryMeta>;
}) {
  const c = cm(term.category, categoryMeta);

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
          <div className="h-1" style={{ background: `linear-gradient(to right, ${rgba(c.color)}, ${rgba(brighten(c.color))})` }} />
          <div className="overflow-y-auto max-h-[calc(85vh-4px)]">
            <div className="sticky top-0 z-10 flex items-center justify-between px-7 pt-5 pb-3 backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: rgba(c.color) }} />
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
  categoryMeta,
}: {
  terms: Term[];
  rendered: RenderedTermMap;
  categoryMeta: Record<string, CategoryMeta>;
}) {
  const [focusedTerm, setFocusedTerm] = useState<Term | null>(null);

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
      <TermsGalaxy
        terms={terms}
        categoryMeta={categoryMeta}
        matchingSlugs={null}
        selectedCategory={null}
        onSelectTerm={setFocusedTerm}
        onSelectCategory={() => {}}
      />

      {focusedTerm && (
        <FocusOverlay
          term={focusedTerm}
          renderedContent={rendered[focusedTerm.slug]}
          relatedTerms={relatedTerms}
          categoryMeta={categoryMeta}
          onClose={() => setFocusedTerm(null)}
          onNavigate={setFocusedTerm}
        />
      )}
    </>
  );
}
