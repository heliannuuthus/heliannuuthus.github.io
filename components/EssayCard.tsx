"use client";

import { useRouter } from "next/navigation";
import type { PostMeta } from "@/lib/content";
import Image from "next/image";

interface EssayCardProps {
  post: PostMeta;
  basePath: string;
}

export default function EssayCard({ post, basePath }: EssayCardProps) {
  const router = useRouter();

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
      <div className="surface rounded-2xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(.23,1,.32,1)] group-hover:surface-raised group-hover:-translate-y-1">
        <div className="relative w-full overflow-hidden aspect-[1200/630]">
          <Image
            src={`/covers/${post.slug}.png`}
            alt={post.title}
            fill
            loading="eager"
            priority
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </div>
  );
}
