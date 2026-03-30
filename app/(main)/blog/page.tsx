import { Suspense } from "react";
import { getAuthors, getBlogPosts } from "@/lib/content";
import PostList from "@/components/PostList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog"
};

export default function BlogPage() {
  const posts = getBlogPosts();
  const authors = getAuthors();

  return (
    <Suspense>
      <PostList
        posts={posts}
        authors={authors}
        basePath="/blog"
        title="Blog"
        description="Technical articles on backend, distributed systems, and more."
      />
    </Suspense>
  );
}
