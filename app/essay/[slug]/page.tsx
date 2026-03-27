import { getAllSlugs, getPostBySlug, getAuthors } from "@/lib/content";
import { extractToc } from "@/lib/toc";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx/mdx-components";
import TableOfContents from "@/components/Toc";
import { Chip } from "@heroui/react/chip";
import Link from "next/link";
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
  return getAllSlugs("essay").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug("essay", slug);
  if (!post) return {};
  return {
    title: post.meta.title,
    description: post.meta.description,
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      images: [`/covers/${slug}.png`]
    }
  };
}

export default async function EssayPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug("essay", slug);
  if (!post) notFound();

  const authors = getAuthors();
  const toc = extractToc(post.content);
  const dateStr = new Date(post.meta.date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="flex gap-8 max-w-5xl mx-auto">
      <article className="flex flex-col gap-8 min-w-0 flex-1">
        <header className="flex flex-col gap-4">
          <Link
            href="/essay"
            className="text-sm text-default-400 hover:text-accent transition-colors w-fit"
          >
            &larr; Back to Essays
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
            {post.meta.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-sm text-default-400">
            <time dateTime={post.meta.date}>{dateStr}</time>
            {post.meta.authors.map((authorId) => {
              const author = authors[authorId];
              return (
                <span key={authorId} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-default-300" />
                  {author?.name || authorId}
                </span>
              );
            })}
          </div>

          {post.meta.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.meta.tags.map((tag) => (
                <Chip key={tag} size="sm" variant="soft">
                  {tag}
                </Chip>
              ))}
            </div>
          )}
        </header>

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
