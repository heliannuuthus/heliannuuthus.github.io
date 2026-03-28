"use client";

import { Button } from "@heroui/react/button";
import { Link as HeroLink } from "@heroui/react/link";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const mottos = [
  "正在某个角落写代码 ⌨️",
  "可能在调试，也可能在发呆 🤔",
  "咖啡驱动开发中 ☕",
  "git push --force 然后跑路 🏃",
  "在 Stack Overflow 上找到了答案 🎉",
  "segfault 和我，总有一个先崩溃 💥",
  "今天的 bug 是昨天的 feature 🐛",
  "正在和编译器吵架 🗣️"
];

export default function GlassFooter() {
  const [mottoIndex, setMottoIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const footerRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMottoIndex(Math.floor(Math.random() * mottos.length));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      const timer = setTimeout(() => {
        setMottoIndex((i) => (i + 1) % mottos.length);
        setIsFading(false);
      }, 400);
      return () => clearTimeout(timer);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTopBtn(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!footerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <footer ref={footerRef} className="w-full mt-auto">
      <div className="surface rounded-t-[24px] overflow-hidden relative">
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 60%, #2e8555 0%, transparent 50%), radial-gradient(circle at 70% 40%, #e6a817 0%, transparent 50%)"
          }}
        />

        <div className="max-w-5xl mx-auto px-6 pt-10 pb-6 relative">
          <div
            className={`flex flex-col items-center gap-4 transition-all duration-700 ${
              visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <Link
              href="/"
              className="group flex flex-col items-center gap-3 transition-transform duration-500 ease-[cubic-bezier(.23,1,.32,1)] hover:-translate-y-0.5"
            >
              <div className="relative">
                <Image
                  src="https://github.com/heliannuuthus.png"
                  alt="heliannuuthus"
                  width={64}
                  height={64}
                  className="rounded-full ring-2 ring-default-200/50 dark:ring-default-100/20 transition-all duration-700 ease-[cubic-bezier(.23,1,.32,1)] group-hover:ring-emerald-500/30 group-hover:scale-105"
                />
                <div className="absolute -inset-1.5 rounded-full bg-emerald-500/0 group-hover:bg-emerald-500/8 transition-colors duration-500" />
              </div>
              <div className="text-center">
                <span className="text-base font-semibold tracking-tight block">
                  heliannuuthus
                </span>
                <span className="text-xs text-default-400 font-mono tracking-wider">
                  AI Infra Engineer
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-3 mt-1">
              <HeroLink
                href="https://github.com/heliannuuthus"
                target="_blank"
                rel="noopener noreferrer"
                className="text-default-400 hover:text-default-600 dark:hover:text-default-200 transition-colors"
                aria-label="GitHub"
              >
                <GitHubIcon className="w-[18px] h-[18px]" />
              </HeroLink>
            </div>

            <div
              className={`text-[13px] text-default-400 italic h-5 transition-all duration-400 mt-1 ${
                isFading
                  ? "opacity-0 translate-y-1"
                  : "opacity-100 translate-y-0"
              }`}
            >
              {mottos[mottoIndex]}
            </div>
          </div>

          <div
            className={`mt-8 pt-5 border-t border-default-200/30 dark:border-default-100/10 flex items-center justify-between transition-all duration-700 delay-200 ${
              visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <p className="text-xs text-default-400">
              &copy; {new Date().getFullYear()} heliannuuthus
              <span className="mx-1.5 text-default-300">&middot;</span>
              Built with{" "}
              <HeroLink
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-default-400 hover:text-emerald-500 transition-colors underline-offset-2 hover:underline"
              >
                Next.js
              </HeroLink>
              {" & "}
              <HeroLink
                href="https://heroui.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-default-400 hover:text-emerald-500 transition-colors underline-offset-2 hover:underline"
              >
                HeroUI
              </HeroLink>
            </p>

            <Button
              variant="ghost"
              size="sm"
              onPress={scrollToTop}
              className={`text-xs text-default-400 hover:text-emerald-500 transition-all duration-500 ${
                showTopBtn
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2 pointer-events-none"
              }`}
              aria-label="回到顶部"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 15.75l7.5-7.5 7.5 7.5"
                />
              </svg>
              回到顶部
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}
