import { getEssayPosts } from "@/lib/content";
import PostList from "@/components/post-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Essay"
};

export default function EssayPage() {
  const posts = getEssayPosts();

  return (
    <PostList
      posts={posts}
      basePath="/essay"
      title="Essay"
      description="Thoughts and reflections beyond pure tech."
    />
  );
}
