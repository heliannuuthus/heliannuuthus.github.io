import { visit, attr, toJsx } from "./utils";

/**
 * ```markmap → <Markmap markdown="..." />
 */
export const remarkMarkmap = () => (tree: any) => {
  visit(tree, (node: any) => {
    if (node.type !== "code" || node.lang !== "markmap") return;
    Object.assign(
      node,
      toJsx("mdxJsxFlowElement", "Markmap", [attr("markdown", node.value)], [])
    );
  });
};
