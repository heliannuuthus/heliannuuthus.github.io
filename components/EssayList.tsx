"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { PostMeta } from "@/lib/content";
import { Chip } from "@heroui/react/chip";
import { X } from "lucide-react";
import Link from "next/link";
import EssayCard from "@/components/EssayCard";

const PAGE_SIZE = 8;

interface EssayListProps {
  posts: PostMeta[];
  basePath: string;
  title: string;
  description?: string;
}

export default function EssayList({
  posts,
  basePath,
  title,
  description
}: EssayListProps) {
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag");

  const filtered = useMemo(
    () =>
      activeTag ? posts.filter((p) => p.tags.includes(activeTag)) : posts,
    [posts, activeTag]
  );

  const [visible, setVisible] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const totalVisible = Math.min(visible, filtered.length);

  const loadMore = useCallback(() => {
    setVisible((v) => Math.min(v + PAGE_SIZE, filtered.length));
  }, [filtered.length]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [activeTag]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || totalVisible >= filtered.length) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [totalVisible, filtered.length, loadMore]);

  const visiblePosts = filtered.slice(0, totalVisible);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-default-500 text-base">{description}</p>
        )}
      </div>

      {activeTag && (
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-zinc-400 dark:text-zinc-500">
            Filtered by
          </span>
          <Chip size="sm" variant="soft">
            <Chip.Label>{activeTag}</Chip.Label>
          </Chip>
          <Link
            href={basePath}
            className="inline-flex items-center justify-center w-5 h-5 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X size={14} />
          </Link>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="surface rounded-3xl p-12 text-center text-default-400">
          No essays found.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {visiblePosts.map((post) => (
              <EssayCard
                key={post.slug}
                post={post}
                basePath={basePath}
              />
            ))}
          </div>

          {totalVisible < filtered.length && (
            <div ref={sentinelRef} className="flex justify-center py-4">
              <span className="text-sm text-default-400">Loading...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
