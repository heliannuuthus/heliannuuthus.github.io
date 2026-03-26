import { Suspense } from "react";
import { getEssayPosts } from "@/lib/content";
import EssayList from "@/components/EssayList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Essay"
};

export default function EssayPage() {
  const posts = getEssayPosts();

  return (
    <Suspense>
      <EssayList
        posts={posts}
        basePath="/essay"
        title="Essay"
        description="Thoughts and reflections beyond pure tech."
      />
    </Suspense>
  );
}
