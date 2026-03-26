"use client";

interface CommentTooltipProps {
  title?: string;
  children?: React.ReactNode;
}

export function CommentTooltip({ title, children }: CommentTooltipProps) {
  return (
    <abbr
      title={title || undefined}
      className="border-b border-dashed border-zinc-400 dark:border-zinc-500 cursor-help no-underline"
      style={{ textDecoration: "none" }}
    >
      {children}
    </abbr>
  );
}

export function Comment({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}
