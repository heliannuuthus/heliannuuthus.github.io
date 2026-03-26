import { getBlogPosts } from "@/lib/content";
import PostList from "@/components/post-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog"
};

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <PostList
      posts={posts}
      basePath="/blog"
      title="Blog"
      description="Technical articles on backend, distributed systems, and more."
    />
  );
}
