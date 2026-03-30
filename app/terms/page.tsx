import { getAllTerms } from "@/lib/terms";
import { compileMDX } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx/mdx-components";
import TermsContent from "@/components/terms-content";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import type { MDXComponents } from "mdx/types";
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

export const metadata: Metadata = {
  title: "Terminology"
};

const inlineComponents: MDXComponents = {
  ...mdxComponents,
  p: (props: React.ComponentProps<"div">) => <div {...props} />,
};

function mdxOptions(source: string) {
  return {
    mdxOptions: {
      remarkPlugins: [
        remarkGfm,
        remarkMath,
        remarkDirective,
        remarkAdmonition,
        remarkCollapse,
        remarkHint,
        [remarkTerminology, { source }] as any,
        remarkTabs,
        remarkMermaid,
        remarkMarkmap,
        remarkExternalLink,
        remarkTables
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
  } as const;
}

async function renderBlock(markdown: string, src: string): Promise<ReactNode> {
  try {
    const { content } = await compileMDX({
      source: markdown,
      components: mdxComponents,
      options: mdxOptions(src)
    });
    return content;
  } catch (e) {
    console.warn(`\x1b[33m⚠ [term]\x1b[0m Failed to compile content — ${src}`, e);
    return null;
  }
}

async function renderInline(markdown: string, src: string): Promise<ReactNode> {
  try {
    const { content } = await compileMDX({
      source: markdown,
      components: inlineComponents,
      options: mdxOptions(src)
    });
    return content;
  } catch (e) {
    console.warn(`\x1b[33m⚠ [term]\x1b[0m Failed to compile definition — ${src}`, e);
    return null;
  }
}

export default async function TermsPage() {
  const terms = getAllTerms();

  const rendered: Record<string, { definition?: ReactNode; content?: ReactNode }> = {};

  await Promise.all(
    terms.map(async (term) => {
      const src = `terminologies/${term.category}#${term.slug}`;
      const [definition, content] = await Promise.all([
        term.definition ? renderInline(term.definition, src) : undefined,
        term.content ? renderBlock(term.content, src) : undefined,
      ]);
      rendered[term.slug] = { definition, content };
    })
  );

  return <TermsContent terms={terms} rendered={rendered} />;
}
