import { visit, attr, toJsx } from "./utils";

/**
 * ```mermaid → <Mermaid value="..." />
 */
export const remarkMermaid = () => (tree: any) => {
  visit(tree, (node: any) => {
    if (node.type !== "code" || node.lang !== "mermaid") return;
    Object.assign(
      node,
      toJsx("mdxJsxFlowElement", "Mermaid", [attr("value", node.value)], [])
    );
  });
};
