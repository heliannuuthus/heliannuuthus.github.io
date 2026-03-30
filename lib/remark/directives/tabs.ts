import { visit, attr, toJsx } from "./utils";

/**
 * :::tabs / :::tab{label="..."}
 * → <Tabs><Tab label="...">...</Tab></Tabs>
 */
export const remarkTabs = () => {
  const renderTabs = (node: any): any =>
    toJsx(
      "mdxJsxFlowElement",
      "Tabs",
      Object.entries(node.attributes || {})
        .filter(([k]) => k !== "items")
        .map(([k, v]) => attr(k, v)),
      node.children.map((child: any) => {
        if (child.type === "containerDirective") {
          if (child.name === "tab") return renderTab(child);
          if (child.name === "tabs") return renderTabs(child);
        }
        return child;
      })
    );

  const renderTab = (node: any): any =>
    toJsx(
      "mdxJsxFlowElement",
      "Tab",
      Object.entries(node.attributes || {}).map(([k, v]) => attr(k, v)),
      node.children.map((child: any) => {
        if (child.type === "containerDirective") {
          if (child.name === "tab") return renderTab(child);
          if (child.name === "tabs") return renderTabs(child);
        }
        return child;
      })
    );

  return (tree: any) => {
    visit(tree, (node: any) => {
      if (node.type !== "containerDirective" || node.name !== "tabs") return;
      Object.assign(node, renderTabs(node));
    });
  };
};
