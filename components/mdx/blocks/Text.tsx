import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

const colorMap: Record<string, string> = {
  danger: "text-danger",
  warning: "text-warning",
  success: "text-success",
};

interface TextProps {
  children?: ReactNode;
  type?: string;
  strong?: boolean;
  align?: string;
  style?: CSSProperties;
}

export default function Text({
  children,
  type,
  strong,
  align,
  style,
}: TextProps) {
  const isBlock = !!align;
  const Tag = strong ? "strong" : isBlock ? "div" : "span";

  return (
    <Tag
      className={cn(
        colorMap[type || ""],
        align === "center" && "text-center w-full my-2"
      )}
      style={style}
    >
      {children}
    </Tag>
  );
}
