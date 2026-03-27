"use client";

import { Button } from "@heroui/react/button";
import { Link as HeroLink } from "@heroui/react/link";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";

const navItems = [
  { label: "Blog", href: "/blog" },
  { label: "Essay", href: "/essay" },
  { label: "Terms", href: "/terms" }
];

function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

export default function GlassNavbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrolled = useScrolled();

  const tabsRef = useRef<HTMLUListElement>(null);
  const tabRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const [indicatorReady, setIndicatorReady] = useState(false);

  const activeHref = navItems.find((item) =>
    pathname.startsWith(item.href)
  )?.href;

  const measureIndicator = useCallback(() => {
    if (!activeHref || !tabsRef.current) return;
    const el = tabRefs.current.get(activeHref);
    if (!el) return;
    const containerRect = tabsRef.current.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setIndicator({
      left: elRect.left - containerRect.left,
      width: elRect.width
    });
    setIndicatorReady(true);
  }, [activeHref]);

  useLayoutEffect(() => {
    measureIndicator();
  }, [measureIndicator]);

  useEffect(() => {
    window.addEventListener("resize", measureIndicator);
    return () => window.removeEventListener("resize", measureIndicator);
  }, [measureIndicator]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const setTabRef = useCallback(
    (href: string) => (el: HTMLLIElement | null) => {
      if (el) tabRefs.current.set(href, el);
      else tabRefs.current.delete(href);
    },
    []
  );

  return (
    <div
      className={`sticky z-40 w-full transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
        scrolled ? "top-0 pt-0" : "top-0 pt-3"
      }`}
    >
      <nav
        className={`mx-auto bg-white/72 dark:bg-zinc-900/72 backdrop-saturate-[1.8] backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          scrolled
            ? "w-full max-w-none rounded-none shadow-[0_0.5px_0_rgba(0,0,0,0.06)] dark:shadow-[0_0.5px_0_rgba(255,255,255,0.06)]"
            : "max-w-3xl rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.08),0_0_0_0.5px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3),0_0_0_0.5px_rgba(255,255,255,0.06)]"
        }`}
      >
        <header className="flex h-14 items-center justify-between px-5 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/img/logo.svg"
              alt="heliannuuthus"
              width={28}
              height={28}
              className="rounded-lg"
            />
            <span className="font-semibold text-base tracking-tight hidden sm:inline">
              heliannuuthus
            </span>
          </Link>

          <ul
            ref={tabsRef}
            className="hidden sm:flex relative items-center rounded-full bg-zinc-100/60 dark:bg-white/[0.06] p-1 gap-0.5"
          >
            {indicatorReady && (
              <li
                aria-hidden
                className="absolute top-1 h-[calc(100%-8px)] rounded-full bg-white dark:bg-white/15 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_0_0_0.5px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)]"
                style={{
                  left: indicator.left,
                  width: indicator.width,
                  transition:
                    "left 0.4s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
              />
            )}
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <li
                  key={item.href}
                  ref={setTabRef(item.href)}
                >
                  <Link
                    href={item.href}
                    className={`relative z-10 block px-4 py-1.5 rounded-full text-[13px] font-medium tracking-wide transition-colors duration-300 ${
                      isActive
                        ? "text-zinc-900 dark:text-zinc-100"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1.5">
            {mounted && (
              <Button
                isIconOnly
                variant="ghost"
                size="sm"
                className="rounded-full w-8 h-8"
                onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <SunIcon className="w-[18px] h-[18px]" />
                ) : (
                  <MoonIcon className="w-[18px] h-[18px]" />
                )}
              </Button>
            )}
            <HeroLink
              href="https://github.com/heliannuuthus"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-default-100 transition-colors"
            >
              <GitHubIcon className="w-[18px] h-[18px] text-default-600 hover:text-default-900 dark:hover:text-default-300 transition-colors" />
            </HeroLink>
            <Button
              isIconOnly
              variant="ghost"
              size="sm"
              className="sm:hidden ml-0.5 rounded-full w-8 h-8"
              onPress={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </Button>
          </div>
        </header>

        {isMenuOpen && (
          <div className="border-t border-default-200/50 sm:hidden bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl backdrop-saturate-[1.8] rounded-b-3xl">
            <ul className="flex flex-col gap-2 p-4">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block py-2 text-lg transition-colors ${
                        isActive
                          ? "font-medium text-emerald-600 dark:text-emerald-400"
                          : "text-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
      />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
      />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}
