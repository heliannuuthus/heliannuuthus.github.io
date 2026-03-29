"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Button } from "@heroui/react/button";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import type { TocItem } from "@/lib/toc";
import { usePreferences } from "@/lib/preferences";

interface TableOfContentsProps {
  items: TocItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const tocVisible = usePreferences((s) => s.tocVisible);
  const [activeId, setActiveId] = useState<string>("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const ids = flattenIds(items);
    const headings = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (headings.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    headings.forEach((h) => observerRef.current?.observe(h));
    return () => observerRef.current?.disconnect();
  }, [items]);

  const toggle = useCallback((id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  if (items.length === 0 || !tocVisible) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="hidden xl:block w-56 shrink-0"
    >
      <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto overscroll-contain toc-scroll">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
          On this page
        </p>
        <ul className="space-y-0.5">
          {items.map((item) => (
            <TocNode
              key={item.id}
              item={item}
              activeId={activeId}
              collapsed={collapsed}
              toggle={toggle}
            />
          ))}
        </ul>
      </div>
    </nav>
  );
}

function TocNode({
  item,
  activeId,
  collapsed,
  toggle
}: {
  item: TocItem;
  activeId: string;
  collapsed: Record<string, boolean>;
  toggle: (id: string) => void;
}) {
  const isActive = activeId === item.id;
  const isCollapsed = collapsed[item.id] ?? false;
  const hasChildren = item.children.length > 0;
  const indent = (item.depth - 2) * 12;

  return (
    <li>
      <div
        className="flex items-center group"
        style={{ paddingLeft: `${indent}px` }}
      >
        {hasChildren && (
          <Button
            isIconOnly
            size="sm"
            variant="ghost"
            className="shrink-0 w-4 h-4 min-w-4 mr-0.5 text-zinc-400 dark:text-zinc-500"
            onPress={() => toggle(item.id)}
            aria-label={isCollapsed ? "Expand" : "Collapse"}
          >
            <ChevronRight
              size={11}
              className={cn("transition-transform duration-200", !isCollapsed && "rotate-90")}
            />
          </Button>
        )}
        <a
          href={`#${item.id}`}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
            window.history.replaceState(null, "", `#${item.id}`);
          }}
          className={cn(
            "block py-1 text-[12.5px] leading-snug truncate transition-colors duration-200",
            !hasChildren && "pl-[18px]",
            isActive
              ? "text-emerald-600 dark:text-emerald-400 font-medium"
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
          )}
          title={item.text}
        >
          {item.text}
        </a>
      </div>
      {hasChildren && !isCollapsed && (
        <ul className="space-y-0.5">
          {item.children.map((child) => (
            <TocNode
              key={child.id}
              item={child}
              activeId={activeId}
              collapsed={collapsed}
              toggle={toggle}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function flattenIds(items: TocItem[]): string[] {
  const ids: string[] = [];
  for (const item of items) {
    ids.push(item.id);
    if (item.children.length > 0) {
      ids.push(...flattenIds(item.children));
    }
  }
  return ids;
}
