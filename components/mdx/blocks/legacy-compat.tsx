"use client";

import type { CSSProperties, ReactNode } from "react";
import { Disclosure } from "@heroui/react/disclosure";

export function Center({ src, alt }: { src?: string; alt?: string }) {
  return (
    <figure className="my-6 flex justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt || ""}
        loading="lazy"
        className="rounded-2xl max-w-full"
      />
    </figure>
  );
}

export function LegacyImage({ src, alt }: { src?: string; alt?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt || ""}
      loading="lazy"
      className="rounded-2xl my-4 max-w-full"
    />
  );
}

export function Flex({
  children,
  vertical,
  justify,
  align,
  style
}: {
  children?: ReactNode;
  vertical?: boolean;
  justify?: string;
  align?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className="flex gap-2 my-2"
      style={{
        flexDirection: vertical ? "column" : "row",
        justifyContent: justify || "flex-start",
        alignItems: align || "stretch",
        ...style
      }}
    >
      {children}
    </div>
  );
}

export function Text({
  children,
  type,
  strong,
  style
}: {
  children?: ReactNode;
  type?: string;
  strong?: boolean;
  style?: CSSProperties;
}) {
  const colorMap: Record<string, string> = {
    danger: "text-red-500",
    warning: "text-amber-500",
    success: "text-emerald-500"
  };
  const cls = colorMap[type || ""] || "";
  const Tag = strong ? "strong" : "span";
  return <Tag className={cls} style={style}>{children}</Tag>;
}

export function DocusaurusLink({
  to,
  children,
  id
}: {
  to?: string;
  children?: ReactNode;
  id?: string;
}) {
  return (
    <a
      href={to || "#"}
      id={id}
      className="text-emerald-600 dark:text-emerald-400 hover:underline underline-offset-4"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

export function LegacyLink({
  href,
  to,
  children
}: {
  href?: string;
  to?: string;
  children?: ReactNode;
}) {
  return (
    <a
      href={href || to || "#"}
      className="text-emerald-600 dark:text-emerald-400 hover:underline underline-offset-4"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

interface CollapseItem {
  label: ReactNode;
  children: ReactNode;
}

export function Collapses({ items }: { items?: CollapseItem[] }) {
  if (!items?.length) return null;
  return (
    <div className="my-6 flex flex-col gap-2">
      {items.map((item, i) => (
        <Disclosure key={i}>
          <Disclosure.Heading>
            <Disclosure.Trigger>
              <Disclosure.Indicator />
              {item.label}
            </Disclosure.Trigger>
          </Disclosure.Heading>
          <Disclosure.Content>
            <Disclosure.Body>{item.children}</Disclosure.Body>
          </Disclosure.Content>
        </Disclosure>
      ))}
    </div>
  );
}
