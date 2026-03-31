"use client";

import { useRouter } from "next/navigation";
import { Card } from "@heroui/react/card";
import { ScrollShadow } from "@heroui/react/scroll-shadow";
import { cn } from "@/lib/cn";
import type { Author, PostMeta } from "@/lib/content";
import dayjs from "@/lib/dayjs";
import { tagColor } from "@/lib/tag-colors";
import Image from "next/image";
import Link from "next/link";

interface PostCardProps {
  post: PostMeta;
  authors?: Record<string, Author>;
  basePath: string;
}

export default function PostCard({ post, authors, basePath }: PostCardProps) {
  const router = useRouter();

  const monthDay = dayjs(post.date).format("M月D日");

  return (
    <div
      role="link"
      tabIndex={0}
      className="block w-full group cursor-pointer"
      onClick={() => router.push(`${basePath}/${post.slug}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter") router.push(`${basePath}/${post.slug}`);
      }}
    >
      <Card className={cn(
        "surface rounded-2xl px-6 py-5 transition-all duration-500 ease-[cubic-bezier(.23,1,.32,1)] group-hover:surface-raised group-hover:-translate-y-0.5",
        post.draft && "border-l-[3px] border-dashed border-amber-400/60 dark:border-amber-500/40 opacity-75 group-hover:opacity-100"
      )}>
        <Card.Content className="flex flex-col gap-3 p-0">
          <h3 className="text-[17px] font-semibold leading-snug tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
            {post.draft && (
              <span className="inline-flex items-center mr-2 px-2 py-0.5 rounded-md text-[11px] font-medium tracking-wide bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 align-middle">
                Draft
              </span>
            )}
            {post.title}
          </h3>

          {post.description && (
            <ScrollShadow className="max-h-[2.75rem]" hideScrollBar>
              <p className="text-[13.5px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                {post.description}
              </p>
            </ScrollShadow>
          )}

          <div className="flex items-center justify-between pt-1">
            {post.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`${basePath}?tag=${encodeURIComponent(tag)}`}
                    onClick={(e) => e.stopPropagation()}
                    className={cn(
                      "inline-flex items-center h-[22px] px-2.5 rounded-full text-[11px] font-medium tracking-wide transition-all duration-200 hover:scale-105 hover:brightness-110 hover:shadow-sm",
                      tagColor(tag)
                    )}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2 text-[12px] text-zinc-400 dark:text-zinc-500 shrink-0">
              <time dateTime={post.date}>{monthDay}</time>
              {post.authors.length > 0 && authors && (
                <>
                  <span className="text-zinc-300 dark:text-zinc-600">&middot;</span>
                  <div className="flex items-center gap-1.5">
                    <div className="flex -space-x-1.5">
                      {post.authors.map((key) => {
                        const author = authors[key];
                        return author?.image_url ? (
                          <Image
                            key={key}
                            src={author.image_url}
                            alt={author.name}
                            width={18}
                            height={18}
                            className="rounded-full ring-1 ring-white dark:ring-zinc-800"
                          />
                        ) : null;
                      })}
                    </div>
                    <span>
                      {post.authors.map((key, i) => (
                        <span key={key}>
                          {i > 0 && ", "}
                          <Link
                            href={`${basePath}?author=${encodeURIComponent(key)}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                          >
                            {authors[key]?.name ?? key}
                          </Link>
                        </span>
                      ))}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
