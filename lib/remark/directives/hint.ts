import { visit, attr, toJsx } from "./utils";

/**
 * :hint[text]{#annotation}  or  :hint[text]{title="annotation"}
 * → <Hint title="annotation">text</Hint>
 */
export const remarkHint = () => (tree: any) => {
  visit(tree, (node: any) => {
    if (node.type !== "textDirective" || node.name !== "hint") return;
    const attrs = node.attributes || {};
    const tipText = attrs.id || attrs.title || attrs["#"] || "";

    Object.assign(
      node,
      toJsx("mdxJsxTextElement", "Hint", [attr("title", tipText)], node.children)
    );
  });
};
