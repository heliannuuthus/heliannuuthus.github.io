import { visit, setHast } from "./utils";

export const remarkTabs = () => {
  const renderTabs = (node: any) => {
    const tabChildren = node.children
      .map((child: any) => {
        if (child.type === "containerDirective") {
          if (child.name === "tab") return renderTab(child);
          if (child.name === "tabs") return renderTabs(child);
        }
        return child;
      });

    setHast(node, "div", { "data-island": "Tabs" }, tabChildren);
    return node;
  };

  const renderTab = (node: any) => {
    const attrs = node.attributes || {};
    const label = attrs.label || attrs.value || "Tab";

    node.children = node.children.map((child: any) => {
      if (child.type === "containerDirective") {
        if (child.name === "tab") return renderTab(child);
        if (child.name === "tabs") return renderTabs(child);
      }
      return child;
    });

    setHast(node, "div", { "data-tab": label });
    return node;
  };

  return (tree: any) => {
    visit(tree, (node: any) => {
      if (node.type !== "containerDirective" || node.name !== "tabs") return;
      renderTabs(node);
    });
  };
};
