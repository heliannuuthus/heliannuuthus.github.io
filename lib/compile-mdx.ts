import { createMarkdownProcessor } from "@heliannuuthus/npm";
import { rehypeProseClasses } from "@heliannuuthus/npm/rehype-prose-classes";
import { remarkMermaid } from "@heliannuuthus/npm/remark-mermaid";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import { getTermBySlug } from "./terms";

export interface CompileOptions {
  source?: string;
}

export async function compileToHtml(
  content: string,
  options: CompileOptions = {}
): Promise<string> {
  const result = await createMarkdownProcessor({
    source: options.source,
    resolveTerm: getTermBySlug,
    mermaid: remarkMermaid
  })
    .use(rehypeKatex, { strict: "ignore" })
    .use(rehypePrettyCode, {
      theme: { dark: "github-dark-default", light: "github-light-default" },
      keepBackground: false,
    })
    .use(rehypeProseClasses)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  return String(result);
}
