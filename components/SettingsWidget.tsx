"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@heroui/react/button";
import { cn } from "@/lib/cn";
import { usePreferences } from "@/lib/preferences";

function IceSunflower({ className }: { className?: string }) {
  const petals = Array.from({ length: 10 }, (_, i) => {
    const angle = (i * 360) / 10;
    return (
      <ellipse
        key={i}
        cx="24"
        cy="24"
        rx="4.5"
        ry="10"
        transform={`rotate(${angle} 24 24) translate(0 -9)`}
        fill="url(#iceGrad)"
        opacity="0.7"
        stroke="url(#edgeGrad)"
        strokeWidth="0.4"
      />
    );
  });

  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="iceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(186, 230, 253, 0.85)" />
          <stop offset="50%" stopColor="rgba(147, 197, 253, 0.7)" />
          <stop offset="100%" stopColor="rgba(196, 181, 253, 0.6)" />
        </linearGradient>
        <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="100%" stopColor="rgba(186,230,253,0.4)" />
        </linearGradient>
        <radialGradient id="centerGrad" cx="45%" cy="40%">
          <stop offset="0%" stopColor="rgba(253, 230, 138, 0.9)" />
          <stop offset="60%" stopColor="rgba(251, 191, 36, 0.8)" />
          <stop offset="100%" stopColor="rgba(217, 119, 6, 0.7)" />
        </radialGradient>
        <radialGradient id="shineGrad" cx="35%" cy="30%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <filter id="iceGlow">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feSpecularLighting
            in="blur"
            surfaceScale="3"
            specularConstant="0.8"
            specularExponent="20"
            result="specular"
          >
            <fePointLight x="20" y="14" z="30" />
          </feSpecularLighting>
          <feComposite
            in="specular"
            in2="SourceAlpha"
            operator="in"
            result="specOut"
          />
          <feComposite in="SourceGraphic" in2="specOut" operator="over" />
        </filter>
      </defs>
      <g filter="url(#iceGlow)">
        {petals}
        <circle
          cx="24"
          cy="24"
          r="7"
          fill="url(#centerGrad)"
          stroke="rgba(217, 119, 6, 0.3)"
          strokeWidth="0.5"
        />
        <circle cx="24" cy="24" r="7" fill="url(#shineGrad)" />
      </g>
    </svg>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer group/toggle">
      <span className="text-xs text-default-600">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200",
          checked
            ? "bg-emerald-500 dark:bg-emerald-600"
            : "bg-default-200 dark:bg-default-300"
        )}
      >
        <span
          className={cn(
            "inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200",
            checked ? "translate-x-4" : "translate-x-0.5"
          )}
        />
      </button>
    </label>
  );
}

function FontSizeStepper({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-default-600">{label}</span>
      <div className="flex items-center gap-1.5">
        <Button
          isIconOnly
          size="sm"
          variant="ghost"
          className="w-6 h-6 min-w-6 rounded-lg text-xs"
          isDisabled={value <= min}
          onPress={() => onChange(value - 1)}
          aria-label={`减小${label}`}
        >
          −
        </Button>
        <span className="text-xs font-mono w-6 text-center tabular-nums text-default-700">
          {value}
        </span>
        <Button
          isIconOnly
          size="sm"
          variant="ghost"
          className="w-6 h-6 min-w-6 rounded-lg text-xs"
          isDisabled={value >= max}
          onPress={() => onChange(value + 1)}
          aria-label={`增大${label}`}
        >
          +
        </Button>
      </div>
    </div>
  );
}

export default function SettingsWidget() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);

  const { theme, setTheme } = useTheme();

  const codeWrap = usePreferences((s) => s.codeWrap);
  const toggleCodeWrap = usePreferences((s) => s.toggleCodeWrap);
  const codeFontSize = usePreferences((s) => s.codeFontSize);
  const setCodeFontSize = usePreferences((s) => s.setCodeFontSize);
  const articleFontSize = usePreferences((s) => s.articleFontSize);
  const setArticleFontSize = usePreferences((s) => s.setArticleFontSize);
  const lineNumbers = usePreferences((s) => s.lineNumbers);
  const toggleLineNumbers = usePreferences((s) => s.toggleLineNumbers);
  const tocVisible = usePreferences((s) => s.tocVisible);
  const toggleTocVisible = usePreferences((s) => s.toggleTocVisible);

  useEffect(() => setMounted(true), []);

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (
        open &&
        panelRef.current &&
        fabRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        !fabRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    },
    [open],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }
  }, [open]);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          ref={panelRef}
          className="settings-panel surface-overlay rounded-2xl w-72 p-4 flex flex-col gap-4
            animate-[settings-panel-enter_0.25s_cubic-bezier(0.22,1,0.36,1)_both]"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-default-800">
              阅读偏好
            </span>
            <button
              onClick={() => setOpen(false)}
              className="w-5 h-5 flex items-center justify-center rounded-full
                text-default-400 hover:text-default-600 hover:bg-default-100 transition-colors"
              aria-label="关闭设置"
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M1 1l8 8M9 1l-8 8" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-default-600">主题</span>
              <div className="flex items-center gap-1 rounded-full bg-default-100 p-0.5">
                <button
                  onClick={() => setTheme("system")}
                  className={cn(
                    "flex items-center justify-center w-7 h-7 rounded-full transition-all text-xs",
                    theme === "system"
                      ? "bg-white dark:bg-default-200 shadow-sm text-indigo-500 dark:text-indigo-400"
                      : "text-default-400 hover:text-default-600"
                  )}
                  aria-label="跟随系统"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M8 21h8m-4-4v4" />
                  </svg>
                </button>
                <button
                  onClick={() => setTheme("light")}
                  className={cn(
                    "flex items-center justify-center w-7 h-7 rounded-full transition-all text-xs",
                    theme === "light"
                      ? "bg-white dark:bg-default-200 shadow-sm text-amber-500"
                      : "text-default-400 hover:text-default-600"
                  )}
                  aria-label="浅色主题"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
                  </svg>
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={cn(
                    "flex items-center justify-center w-7 h-7 rounded-full transition-all text-xs",
                    theme === "dark"
                      ? "bg-zinc-700 shadow-sm text-blue-300"
                      : "text-default-400 hover:text-default-600"
                  )}
                  aria-label="深色主题"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
                  </svg>
                </button>
              </div>
            </div>

            <ToggleRow
              label="目录面板"
              checked={tocVisible}
              onChange={toggleTocVisible}
            />
          </div>

          <div className="h-px bg-default-200/60" />

          <div className="flex flex-col gap-3">
            <FontSizeStepper
              label="正文字号"
              value={articleFontSize}
              onChange={setArticleFontSize}
              min={14}
              max={22}
            />
            <FontSizeStepper
              label="代码字号"
              value={codeFontSize}
              onChange={setCodeFontSize}
              min={12}
              max={20}
            />

            <ToggleRow
              label="代码换行"
              checked={codeWrap}
              onChange={toggleCodeWrap}
            />

            <ToggleRow
              label="代码行号"
              checked={lineNumbers}
              onChange={toggleLineNumbers}
            />
          </div>
        </div>
      )}

      <button
        ref={fabRef}
        onClick={() => setOpen((v) => !v)}
        className="settings-fab group relative w-12 h-12 rounded-full surface-overlay
          flex items-center justify-center cursor-pointer
          transition-transform duration-300 hover:scale-110 active:scale-95"
        aria-label="阅读设置"
        aria-expanded={open}
      >
        <IceSunflower className="w-8 h-8 drop-shadow-sm transition-transform duration-500 group-hover:rotate-45" />
      </button>
    </div>
  );
}
