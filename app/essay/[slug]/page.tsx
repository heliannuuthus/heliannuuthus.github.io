import { getAllEssaySlugs, getEssayBySlug } from "@/lib/content";
import dayjs from "@/lib/dayjs";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx/mdx-components";
import ProseWrapper from "@/components/ProseWrapper";
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
  remarkTables,
  remarkText,
  remarkSteps
} from "@/lib/remark/directives";
import rehypeSlug from "rehype-slug";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllEssaySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEssayBySlug(slug);
  if (!entry) return {};

  const dateStr = dayjs(entry.date).format("YYYY年M月D日");

  return {
    title: dateStr,
    description: `${dateStr} 的随笔`
  };
}

export default async function EssayDetailPage({ params }: Props) {
  const { slug } = await params;
  const entry = getEssayBySlug(slug);
  if (!entry) notFound();

  const d = dayjs(entry.date);
  const dateStr = d.format("YYYY年M月D日");
  const weekday = d.format("dddd");

  return (
    <article className="flex flex-col gap-8 max-w-3xl mx-auto">
      <header className="flex flex-col gap-4">
        <Link
          href="/essay"
          className="text-sm text-default-400 hover:text-accent transition-colors w-fit"
        >
          &larr; 返回随笔
        </Link>

        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
            {dateStr}
          </h1>
          <span className="text-sm text-default-400">{weekday}</span>
        </div>
      </header>

      <ProseWrapper>
        <MDXRemote
          source={entry.content}
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
                [remarkTerminology, { source: `essay/${slug}` }],
                remarkTabs,
                remarkMermaid,
                remarkMarkmap,
                remarkExternalLink,
                remarkTables,
                remarkText,
                remarkSteps
              ],
              rehypePlugins: [
                rehypeSlug,
                [rehypeKatex, { strict: "ignore" }],
                [
                  rehypePrettyCode,
                  {
                    theme: {
                      dark: "github-dark-default",
                      light: "github-light-default"
                    },
                    keepBackground: false
                  }
                ]
              ]
            }
          }}
        />
      </ProseWrapper>
    </article>
  );
}
