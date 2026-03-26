import { Card } from "@heroui/react/card";
import type { PostMeta } from "@/lib/content";
import Link from "next/link";

interface PostCardProps {
  post: PostMeta;
  basePath: string;
}

export default function PostCard({ post, basePath }: PostCardProps) {
  const dateStr = new Date(post.date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <Link href={`${basePath}/${post.slug}`} className="block w-full group">
      <Card className="surface rounded-2xl px-6 py-5 transition-all duration-500 ease-[cubic-bezier(.23,1,.32,1)] group-hover:surface-raised group-hover:-translate-y-0.5">
        <Card.Content className="flex flex-col gap-2 p-0">
          <h3 className="text-[17px] font-semibold leading-snug tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
            {post.title}
          </h3>

          {post.description && (
            <p className="text-[13.5px] leading-relaxed text-zinc-500 dark:text-zinc-400 line-clamp-2">
              {post.description}
            </p>
          )}

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center h-[20px] px-2 text-[11px] font-medium tracking-wide rounded-full bg-zinc-500/8 text-zinc-500 dark:bg-zinc-400/10 dark:text-zinc-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 text-[12px] text-zinc-400 dark:text-zinc-500 pt-0.5">
            <time dateTime={post.date}>{dateStr}</time>
            {post.authors.length > 0 && (
              <>
                <span className="text-zinc-300 dark:text-zinc-600">&middot;</span>
                <span>{post.authors.join(", ")}</span>
              </>
            )}
          </div>
        </Card.Content>
      </Card>
    </Link>
  );
}
