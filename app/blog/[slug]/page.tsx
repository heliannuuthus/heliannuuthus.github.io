import { getAllSlugs, getPostBySlug, getAuthors } from "@/lib/content";
import { extractToc } from "@/lib/toc";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx/mdx-components";
import TableOfContents from "@/components/Toc";
import ArticleHeader from "@/components/ArticleHeader";
import { notFound } from "next/navigation";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkDirective from "remark-directive";
import {
  remarkAdmonition,
  remarkCollapse,
  remarkHint,
  remarkTerminology,
  remarkTabs,
  remarkMermaid,
  remarkMarkmap,
  remarkExternalLink,
  remarkTables
} from "@/lib/remark/directives";
import rehypeSlug from "rehype-slug";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
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

  return (
    <div className="flex gap-8 max-w-5xl mx-auto">
      <article className="flex flex-col gap-8 min-w-0 flex-1">
        <ArticleHeader
          meta={post.meta}
          authors={authors}
          backHref="/blog"
          readingTime={readingTime}
        />

        <div className="prose-custom">
          <MDXRemote
            source={post.content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [
                  remarkGfm,
                  remarkMath,
                  remarkDirective,
                  remarkAdmonition,
                  remarkCollapse,
                  remarkHint,
                  remarkTerminology,
                  remarkTabs,
                  remarkMermaid,
                  remarkMarkmap,
                  remarkExternalLink,
                  remarkTables
                ],
                rehypePlugins: [
                  rehypeSlug,
                  rehypeKatex,
                  [rehypePrettyCode, { theme: { dark: "github-dark-default", light: "github-light-default" }, keepBackground: false }]
                ]
              }
            }}
          />
        </div>
      </article>

      <TableOfContents items={toc} />
    </div>
  );
}
