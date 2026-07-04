import { getAllSlugs, getPostBySlug, getAuthors } from "@/lib/content";
import { extractToc } from "@/lib/toc";
import { compileToHtml } from "@/lib/compile-mdx";
import TableOfContents from "@/components/Toc";
import ArticleHeader from "@/components/ArticleHeader";
import ProseWrapper from "@/components/ProseWrapper";
import HtmlContent from "@/components/mdx/html-content";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs("blog").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug("blog", slug);
  if (!post) return {};
  return {
    title: post.meta.title,
    description: post.meta.description
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug("blog", slug);
  if (!post) notFound();

  const authors = getAuthors();
  const toc = extractToc(post.content);

  const plainText = post.content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/[#*_~`>|[\]()-]/g, "")
    .replace(/\s+/g, "");
  const readingTime = Math.max(1, Math.ceil(plainText.length / 400));

  const html = await compileToHtml(post.content, { source: `blog/${slug}` });

  return (
    <div className="flex gap-8">
      <article className="flex flex-col gap-8 min-w-0 flex-1">
        <ArticleHeader
          meta={post.meta}
          authors={authors}
          backHref="/blog"
          readingTime={readingTime}
        />

        <ProseWrapper>
          <HtmlContent html={html} />
        </ProseWrapper>
      </article>

      <TableOfContents items={toc} />
    </div>
  );
}
