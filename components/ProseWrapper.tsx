"use client";

import { usePreferences } from "@/lib/preferences";

export default function ProseWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const articleFontSize = usePreferences((s) => s.articleFontSize);

  return (
    <div
      className="prose-custom"
      style={
        { "--article-font-size": `${articleFontSize}px` } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
