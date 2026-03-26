"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PostMeta } from "@/lib/content";
import PostCard from "@/components/post-card";

const PAGE_SIZE = 10;

interface PostListProps {
  posts: PostMeta[];
  basePath: string;
  title: string;
  description?: string;
}

export default function PostList({
  posts,
  basePath,
  title,
  description
}: PostListProps) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasMore = visible < posts.length;

  const loadMore = useCallback(() => {
    setVisible((v) => Math.min(v + PAGE_SIZE, posts.length));
  }, [posts.length]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-default-500 text-base">{description}</p>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center text-default-400">
          No posts yet.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.slice(0, visible).map((post) => (
            <PostCard key={post.slug} post={post} basePath={basePath} />
          ))}

          {hasMore && (
            <div ref={sentinelRef} className="flex justify-center py-4">
              <span className="text-sm text-default-400">Loading...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
