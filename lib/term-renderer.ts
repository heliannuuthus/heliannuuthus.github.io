import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkDirective from "remark-directive";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import type { Term } from "./terms";

function remarkDirectivesToHtml() {
  return (tree: any) => {
    visit(tree, (node: any) => {
      if (node.type === "textDirective") {
        const attrs = node.attributes || {};
        if (node.name === "hint") {
          const tip = attrs.id || attrs.title || attrs["#"] || "";
          const hast: any = {
            type: "textDirective",
            name: "hint",
            data: {
              hName: "span",
              hProperties: {
                className: "term-hint",
                title: tip,
              },
            },
            children: node.children,
          };
          Object.assign(node, hast);
        } else if (node.name === "term") {
          const slug = attrs.slug || attrs.id || attrs.class || "";
          const href = `/terms#${slug.split("#").pop() || slug}`;
          const hast: any = {
            type: "textDirective",
            name: "term",
            data: {
              hName: "a",
              hProperties: {
                href,
                className: "term-link",
              },
            },
            children: node.children,
          };
          Object.assign(node, hast);
        }
      }

      if (node.type === "containerDirective") {
        const ADMONITIONS = ["tip", "note", "warning", "danger", "info", "caution", "nerd"];
        if (ADMONITIONS.includes(node.name)) {
          const label =
            node.children.find(
              (c: any) => c.data?.directiveLabel && c.children?.[0]?.type === "text"
            )?.children?.[0]?.value || node.name;

          node.children = node.children.filter(
            (c: any) => !(c.data?.directiveLabel)
          );

          const hast: any = {
            type: "containerDirective",
            name: node.name,
            data: {
              hName: "div",
              hProperties: {
                className: `admonition admonition-${node.name}`,
                "data-label": label,
              },
            },
            children: node.children,
          };
          Object.assign(node, hast);
        } else if (node.name === "collapse") {
          const title = node.attributes?.title || "Details";
          const hast: any = {
            type: "containerDirective",
            name: "collapse",
            data: {
              hName: "details",
              hProperties: { className: "term-collapse" },
            },
            children: [
              {
                type: "paragraph",
                data: { hName: "summary" },
                children: [{ type: "text", value: title }],
              },
              ...node.children.filter((c: any) => !c.data?.directiveLabel),
            ],
          };
          Object.assign(node, hast);
        }
      }

      if (node.type === "leafDirective") {
        node.data = {
          hName: "span",
          hProperties: { className: "directive-leaf" },
        };
      }
    });
  };
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkDirective)
  .use(remarkDirectivesToHtml)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeKatex)
  .use(rehypeStringify, { allowDangerousHtml: true });

export async function renderTermContent(markdown: string): Promise<string> {
  const result = await processor.process(markdown);
  return String(result);
}

export async function renderInline(markdown: string): Promise<string> {
  const html = await renderTermContent(markdown);
  return html.replace(/^<p>/, "").replace(/<\/p>\s*$/, "");
}

export async function renderAllTerms(terms: Term[]): Promise<Term[]> {
  return Promise.all(
    terms.map(async (t) => {
      const result = { ...t };
      if (t.content) {
        result.contentHtml = await renderTermContent(t.content);
      }
      if (t.definition) {
        result.definition = await renderInline(t.definition);
      }
      return result;
    })
  );
}
