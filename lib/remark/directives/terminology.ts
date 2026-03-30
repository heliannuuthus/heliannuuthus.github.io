import { visit, attr, toJsx, type MdxAttr } from "./utils";
import { getTermBySlug } from "@/lib/terms";

const extractText = (node: any): string => {
  if (node.type === "text") return node.value || "";
  if (Array.isArray(node.children)) return node.children.map(extractText).join("");
  return "";
};

/**
 * :term[display text]{#slug}  or  :term[display text]{slug=xxx}
 * → <TermPreview slug="..." title="..." definition="...">display text</TermPreview>
 *
 * title / definition are resolved at compile time from terminologies/*.yml
 *
 * Usage: remarkTerminology (no args) or [remarkTerminology, { source: "path/to/file.mdx" }]
 */
export const remarkTerminology = ({ source }: { source?: string } = {}) =>
  (tree: any, file: any) => {
    visit(tree, (node: any) => {
      if (node.type !== "textDirective" || node.name !== "term") return;
      const attrs = node.attributes || {};
      const slug = attrs.slug || attrs.id || attrs.class || "";

      const term = getTermBySlug(slug);

      if (!term) {
        const pos = node.position?.start;
        const loc = pos ? `:${pos.line}:${pos.column}` : "";
        const src = source || file?.path || file?.history?.[0] || "";
        const label = extractText(node);
        console.warn(
          `\x1b[33m⚠ [term]\x1b[0m slug \x1b[1m"${slug}"\x1b[0m not found in terminologies` +
          (label ? ` (text: "${label}")` : "") +
          (src ? ` — ${src}${loc}` : loc ? ` — at ${loc}` : "")
        );
      }

      const jsxAttrs: MdxAttr[] = [
        attr("slug", slug),
        attr("title", term?.title || ""),
        attr("definition", term?.definition || "")
      ];

      Object.assign(
        node,
        toJsx("mdxJsxTextElement", "TermPreview", jsxAttrs, node.children)
      );
    });
  };
