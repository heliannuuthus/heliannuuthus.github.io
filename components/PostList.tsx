"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Author, PostMeta } from "@/lib/content";
import dayjs from "@/lib/dayjs";
import { Chip } from "@heroui/react/chip";
import { Separator } from "@heroui/react/separator";
import { X } from "lucide-react";
import Link from "next/link";
import PostCard from "@/components/PostCard";

const PAGE_SIZE = 10;

interface PostListProps {
  posts: PostMeta[];
  authors: Record<string, Author>;
  basePath: string;
  title: string;
  description?: string;
}

function groupByYear(posts: PostMeta[]): [string, PostMeta[]][] {
  const map = new Map<string, PostMeta[]>();
  for (const post of posts) {
    const year = dayjs(post.date).year().toString();
    const list = map.get(year) ?? [];
    list.push(post);
    map.set(year, list);
  }
  return Array.from(map.entries()).sort(([a], [b]) => Number(b) - Number(a));
}

export default function PostList({
  posts,
  authors,
  basePath,
  title,
  description
}: PostListProps) {
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag");
  const activeAuthor = searchParams.get("author");

  const filtered = useMemo(() => {
    let result = posts;

    if (activeAuthor) {
      result = result.filter((p) => p.authors.includes(activeAuthor));
    }

    if (activeTag) {
      result = result.filter((p) => p.tags.includes(activeTag));
    }

    return result;
  }, [posts, activeTag, activeAuthor]);

  const yearGroups = useMemo(() => groupByYear(filtered), [filtered]);

  const [visible, setVisible] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const totalVisible = Math.min(visible, filtered.length);

  const loadMore = useCallback(() => {
    setVisible((v) => Math.min(v + PAGE_SIZE, filtered.length));
  }, [filtered.length]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [activeTag, activeAuthor]);

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

  let rendered = 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-default-500 text-base">{description}</p>
        )}
      </div>

      {(activeTag || activeAuthor) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[13px] text-zinc-400 dark:text-zinc-500">
            Filtered by
          </span>
          {activeAuthor && (
            <Chip size="sm" variant="soft" color="accent">
              <Chip.Label>{activeAuthor}</Chip.Label>
            </Chip>
          )}
          {activeTag && (
            <Chip size="sm" variant="soft">
              <Chip.Label>{activeTag}</Chip.Label>
            </Chip>
          )}
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
          No posts found.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {yearGroups.map(([year, groupPosts]) => {
            if (rendered >= totalVisible) return null;

            const remaining = totalVisible - rendered;
            const slice = groupPosts.slice(0, remaining);
            rendered += slice.length;

            return (
              <section key={year} className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-[13px] font-semibold tracking-widest text-zinc-400 dark:text-zinc-500 shrink-0">
                    {year}
                  </span>
                  <Separator className="flex-1" />
                </div>
                <div className="flex flex-col gap-3">
                  {slice.map((post) => (
                    <PostCard
                      key={post.slug}
                      post={post}
                      authors={authors}
                      basePath={basePath}
                    />
                  ))}
                </div>
              </section>
            );
          })}

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
