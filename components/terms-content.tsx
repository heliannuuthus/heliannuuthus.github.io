"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import dynamic from "next/dynamic";
import type { Term } from "@/lib/terms";

const TermsGalaxy = dynamic(() => import("./TermsGalaxy"), { ssr: false });

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

/* ── Focus overlay ── */

function FocusOverlay({
  term, relatedTerms, onClose, onNavigate,
}: {
  term: Term; relatedTerms: Term[]; onClose: () => void; onNavigate: (t: Term) => void;
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
          <div className={clsx("h-1 bg-gradient-to-r", c.gradient)} />
          <div className="overflow-y-auto max-h-[calc(85vh-4px)]">
            <div className="sticky top-0 z-10 flex items-center justify-between px-7 pt-5 pb-3 backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80">
              <div className="flex items-center gap-2">
                <span className={clsx("w-2 h-2 rounded-full", c.dot)} />
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
              {term.definition && (
                <div className="mt-5 pl-3 border-l-2 border-emerald-500/30 dark:border-emerald-400/20">
                  <div className="text-[13.5px] leading-[1.8] text-zinc-600 dark:text-zinc-300 term-content" dangerouslySetInnerHTML={{ __html: term.definition }} />
                </div>
              )}
              {term.contentHtml && (
                <div className="mt-4 term-content text-[13.5px] leading-[1.8] text-zinc-700 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: term.contentHtml }} />
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

export default function TermsContent({ terms }: { terms: Term[] }) {
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
        matchingSlugs={null}
        selectedCategory={null}
        onSelectTerm={setFocusedTerm}
        onSelectCategory={() => {}}
      />

      {focusedTerm && (
        <FocusOverlay
          term={focusedTerm}
          relatedTerms={relatedTerms}
          onClose={() => setFocusedTerm(null)}
          onNavigate={setFocusedTerm}
        />
      )}
    </>
  );
}
