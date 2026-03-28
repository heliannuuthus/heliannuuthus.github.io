"use client";

import { useCallback, useRef, useState } from "react";
import { Button } from "@heroui/react/button";
import { Tooltip } from "@heroui/react/tooltip";
import { usePreferences } from "@/lib/preferences";

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  "data-language"?: string;
}

export default function CodeBlock({
  children,
  className,
  ...props
}: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const wrapped = usePreferences((s) => s.codeWrap);
  const codeFontSize = usePreferences((s) => s.codeFontSize);
  const lineNumbers = usePreferences((s) => s.lineNumbers);

  const language = props["data-language"];

  const copy = useCallback(() => {
    const text = preRef.current?.textContent ?? "";
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      const id = window.setTimeout(() => setCopied(false), 2000);
      return () => window.clearTimeout(id);
    });
  }, []);

  return (
    <div className="group/code relative my-4 code-block rounded-2xl overflow-hidden">
      {language && (
        <span className="absolute top-2.5 left-4 text-[11px] font-mono text-default-300 dark:text-default-400 select-none pointer-events-none">
          {language}
        </span>
      )}

      <div className="absolute top-2 right-2 flex items-center gap-0.5 opacity-0 group-hover/code:opacity-100 transition-opacity z-10">
        <Tooltip>
          <Tooltip.Trigger>
            <Button
              isIconOnly
              size="sm"
              variant="ghost"
              className="min-w-7 h-7 backdrop-blur-md bg-white/60 dark:bg-white/10"
              onPress={copy}
              aria-label="复制代码"
            >
              {copied ? (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-emerald-500"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-default-500"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>
            {copied ? "已复制" : "复制"}
          </Tooltip.Content>
        </Tooltip>
      </div>

      <pre
        ref={preRef}
        className={[
          "p-4 pt-9 leading-6",
          wrapped ? "whitespace-pre-wrap break-words" : "overflow-x-auto",
          lineNumbers ? "show-line-numbers" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ fontSize: `${codeFontSize}px` }}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}
