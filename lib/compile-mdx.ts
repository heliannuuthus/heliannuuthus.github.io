import type { Element } from "hast";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkDirective from "remark-directive";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import {
  remarkAdmonition,
  remarkCollapse,
  remarkHint,
  remarkTerminology,
  remarkTabs,
  remarkMermaid,
  remarkMarkmap,
  remarkExternalLink,
  remarkText,
  remarkSteps
} from "@/lib/remark/directives";
import { rehypeProseClasses } from "@/lib/rehype/prose-classes";

import type { Properties } from "hast";

interface DirectiveNode {
  type: string;
  data?: { hName?: string; hProperties?: Properties };
  children?: DirectiveNode[];
}

function directiveHandler(state: { all: (node: DirectiveNode) => Element[] }, node: DirectiveNode): Element {
  const hName = node.data?.hName;
  const hProps: Properties = node.data?.hProperties ?? {};

  return {
    type: "element",
    tagName: hName || (node.type === "textDirective" ? "span" : "div"),
    properties: hProps,
    children: state.all(node),
  };
}

export interface CompileOptions {
  source?: string;
}

export async function compileToHtml(
  content: string,
  options: CompileOptions = {}
): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkDirective)
    .use(remarkAdmonition)
    .use(remarkCollapse)
    .use(remarkHint)
    .use(remarkTerminology, { source: options.source })
    .use(remarkTabs)
    .use(remarkMermaid)
    .use(remarkMarkmap)
    .use(remarkExternalLink)
    .use(remarkText)
    .use(remarkSteps)
    // @ts-expect-error directive handlers use custom node types not in mdast spec
    .use(remarkRehype, {
      allowDangerousHtml: true,
      handlers: {
        containerDirective: directiveHandler,
        textDirective: directiveHandler,
        leafDirective: directiveHandler,
      },
    })
    .use(rehypeSlug)
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
