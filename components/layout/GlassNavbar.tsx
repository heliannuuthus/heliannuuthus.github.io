"use client";

import { Button } from "@heroui/react/button";
import { Link as HeroLink } from "@heroui/react/link";
import { cn } from "@/lib/cn";
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

function useScrolled(downAt = 8, upAt = 2) {
  const [scrolled, setScrolled] = useState(false);
  const ref = useRef(false);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const next = ref.current ? y > upAt : y > downAt;
      if (next !== ref.current) {
        ref.current = next;
        setScrolled(next);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [downAt, upAt]);
  return scrolled;
}

export default function GlassNavbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrolled = useScrolled();

  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const tabRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  const [indicator, setIndicator] = useState({ left: 0, width: 0, top: 0, height: 0 });
  const [indicatorReady, setIndicatorReady] = useState(false);

  const isHome = pathname === "/";
  const activeHref = navItems.find((item) =>
    pathname.startsWith(item.href)
  )?.href;

  const measureIndicator = useCallback(() => {
    if (!headerRef.current) return;

    let targetEl: HTMLElement | null = null;
    if (isHome) {
      targetEl = logoRef.current;
    } else if (activeHref) {
      targetEl = tabRefs.current.get(activeHref) ?? null;
    }

    if (!targetEl) {
      setIndicatorReady(false);
      return;
    }

    const headerRect = headerRef.current.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    setIndicator({
      left: targetRect.left - headerRect.left,
      width: targetRect.width,
      top: targetRect.top - headerRect.top,
      height: targetRect.height
    });
    setIndicatorReady(true);
  }, [isHome, activeHref, scrolled]);

  useLayoutEffect(() => {
    measureIndicator();
  }, [measureIndicator]);

  useEffect(() => {
    window.addEventListener("resize", measureIndicator);
    return () => window.removeEventListener("resize", measureIndicator);
  }, [measureIndicator]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const onTransitionEnd = (e: TransitionEvent) => {
      if (e.target === nav) measureIndicator();
    };
    nav.addEventListener("transitionend", onTransitionEnd);
    return () => nav.removeEventListener("transitionend", onTransitionEnd);
  }, [measureIndicator]);

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
      className={cn(
        "sticky z-40 w-full transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
        scrolled ? "top-0 pt-0" : "top-0 pt-3"
      )}
    >
      <nav
        ref={navRef}
        className={cn(
          "mx-auto bg-white/72 dark:bg-zinc-900/72 backdrop-saturate-[1.8] backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
          scrolled
            ? "w-full max-w-none rounded-none shadow-[0_0.5px_0_rgba(0,0,0,0.06)] dark:shadow-[0_0.5px_0_rgba(255,255,255,0.06)]"
            : "max-w-3xl rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.08),0_0_0_0.5px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3),0_0_0_0.5px_rgba(255,255,255,0.06)]"
        )}
      >
        <header ref={headerRef} className="relative flex h-14 items-center justify-between px-5 sm:px-6">
          {indicatorReady && (
            <div
              aria-hidden
              className="absolute z-[1] rounded-full bg-white/90 dark:bg-white/[0.1] shadow-[0_1px_3px_rgba(0,0,0,0.08),0_0_0_0.5px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.2)]"
              style={{
                left: indicator.left,
                top: indicator.top,
                width: indicator.width,
                height: indicator.height,
                transition:
                  "left 0.45s cubic-bezier(0.4, 0, 0.2, 1), width 0.35s cubic-bezier(0.4, 0, 0.2, 1), top 0.35s cubic-bezier(0.4, 0, 0.2, 1), height 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
            />
          )}

          <Link
            ref={logoRef}
            href="/"
            className="relative z-10 flex items-center gap-2.5 rounded-full px-2.5 py-1.5 -ml-2.5 transition-colors duration-300"
          >
            <Image
              src="/img/logo.svg"
              alt="heliannuuthus"
              width={28}
              height={28}
              className="rounded-lg"
            />
            <span
              className={cn(
                "font-semibold text-base tracking-tight hidden sm:inline transition-colors duration-300",
                isHome
                  ? "text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 dark:text-zinc-400"
              )}
            >
              heliannuuthus
            </span>
          </Link>

          <ul className="hidden sm:flex relative items-center rounded-full bg-zinc-100/60 dark:bg-white/[0.06] p-1 gap-0.5">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <li
                  key={item.href}
                  ref={setTabRef(item.href)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "relative z-10 block px-4 py-1.5 rounded-full text-[13px] font-medium tracking-wide transition-colors duration-300",
                      isActive
                        ? "text-zinc-900 dark:text-zinc-100"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1.5">
            <Button
              isIconOnly
              variant="ghost"
              size="sm"
              className="rounded-full w-8 h-8"
              aria-label="搜索"
            >
              <SearchIcon className="w-[18px] h-[18px]" />
            </Button>
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
                      className={cn(
                        "block py-2 text-lg transition-colors",
                        isActive
                          ? "font-medium text-emerald-600 dark:text-emerald-400"
                          : "text-foreground"
                      )}
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

function SearchIcon({ className }: { className?: string }) {
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
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
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
