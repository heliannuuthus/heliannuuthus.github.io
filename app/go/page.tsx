"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { ExternalLink as ExternalLinkIcon, Globe, ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { faviconUrl } from "@/lib/external-link";

const COUNTDOWN_SECONDS = 5;
const CIRCLE_RADIUS = 36;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

function isValidTarget(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function RedirectContent() {
  const searchParams = useSearchParams();
  const target = searchParams.get("target") ?? "";
  const valid = isValidTarget(target);

  const [remaining, setRemaining] = useState(COUNTDOWN_SECONDS);
  const [paused, setPaused] = useState(false);
  const [faviconError, setFaviconError] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  let domain = "";
  if (valid) {
    try {
      domain = new URL(target).hostname;
    } catch { /* noop */ }
  }

  function redirect() {
    if (valid) window.location.href = target;
  }

  useEffect(() => {
    if (!valid || paused) return;
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [valid, paused]);

  useEffect(() => {
    if (remaining === 0 && valid) redirect();
  });

  const progress = valid
    ? ((COUNTDOWN_SECONDS - remaining) / COUNTDOWN_SECONDS) * CIRCLE_CIRCUMFERENCE
    : 0;

  if (!valid) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="surface-overlay rounded-2xl p-8 max-w-md w-full text-center flex flex-col items-center gap-4">
          <ShieldAlert className="w-12 h-12 text-red-500/80" />
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            无效的链接
          </h1>
          <p className="text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
            目标地址为空或格式不正确，无法跳转。
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 mt-2 text-[13px] font-medium text-sky-600 dark:text-sky-400 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="surface-overlay rounded-2xl max-w-md w-full overflow-hidden">
        <div className="flex flex-col items-center gap-5 px-8 pt-8 pb-6">
          <div className="flex items-center gap-3">
            {faviconError ? (
              <Globe className="w-10 h-10 text-zinc-400" />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={faviconUrl(domain)}
                alt=""
                width={40}
                height={40}
                className="rounded-lg"
                onError={() => setFaviconError(true)}
              />
            )}
            <div>
              <p className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-50">
                {domain}
              </p>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500">外部网站</p>
            </div>
          </div>

          <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            即将离开 heliannuuthus
          </h1>

          <div className="w-full rounded-xl bg-zinc-100 dark:bg-zinc-800/60 px-4 py-3 overflow-hidden">
            <p className="text-[12px] font-mono text-zinc-600 dark:text-zinc-300 leading-relaxed select-all truncate" title={target}>
              {target}
            </p>
          </div>

          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r={CIRCLE_RADIUS}
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-zinc-200 dark:text-zinc-700"
              />
              <circle
                cx="40"
                cy="40"
                r={CIRCLE_RADIUS}
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={CIRCLE_CIRCUMFERENCE}
                strokeDashoffset={CIRCLE_CIRCUMFERENCE - progress}
                strokeLinecap="round"
                className="text-sky-500 transition-[stroke-dashoffset] duration-1000 ease-linear"
              />
            </svg>
            <span className="text-2xl font-bold text-zinc-700 dark:text-zinc-200 tabular-nums">
              {remaining}
            </span>
          </div>
        </div>

        <div className="flex items-center border-t border-zinc-200/60 dark:border-zinc-700/60">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 text-[13px] font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100/60 dark:hover:bg-zinc-700/40 transition-colors"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            返回上一页
          </button>
          <span className="w-px h-6 bg-zinc-200/60 dark:bg-zinc-700/60" />
          <button
            type="button"
            onClick={redirect}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 text-[13px] font-medium text-sky-600 dark:text-sky-400 hover:bg-zinc-100/60 dark:hover:bg-zinc-700/40 transition-colors"
          >
            <ExternalLinkIcon className="w-3.5 h-3.5" />
            继续前往
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="surface-overlay rounded-2xl p-8 text-center text-zinc-400">
            加载中…
          </div>
        </div>
      }
    >
      <RedirectContent />
    </Suspense>
  );
}
