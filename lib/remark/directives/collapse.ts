import { visit, attr, toJsx } from "./utils";

/**
 * :::collapse{title="..."}
 * → <Collapse title="...">
 */
export const remarkCollapse = () => (tree: any) => {
  visit(tree, (node: any) => {
    if (node.type !== "containerDirective" || node.name !== "collapse") return;
    const attrs = node.attributes || {};
    Object.assign(
      node,
      toJsx(
        "mdxJsxFlowElement",
        "Collapse",
        Object.entries(attrs).map(([k, v]) => attr(k, v)),
        node.children
      )
    );
  });
};
