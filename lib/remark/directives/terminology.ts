import { visit, setHast } from "./utils";
import { getTermBySlug } from "@/lib/terms";

const extractText = (node: any): string => {
  if (node.type === "text") return node.value || "";
  if (Array.isArray(node.children)) return node.children.map(extractText).join("");
  return "";
};

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

      setHast(node, "span", {
        className: "text-emerald-600 dark:text-emerald-400 border-b border-dotted border-emerald-400/50 hover:border-emerald-400 transition-colors cursor-pointer",
        "data-island": "TermPreview",
        "data-slug": slug,
        "data-term-title": term?.title || "",
        "data-definition": term?.definition || "",
      });
    });
  };
