import { BlockContent, DefinitionContent, Nodes, RootContent } from "mdast";
import { ContainerDirective } from "mdast-util-directive";
import { MdxJsxAttribute, MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";

export interface TabsOptions {
  component?: string;
}

// 将任意值转为 mdxJsxAttribute 支持的 value
function toMdxAttributeValue(value: any): any {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") return value;
  return {
    type: "mdxJsxExpression" as const,
    value: JSON.stringify(value)
  };
}

const remarkTabs: Plugin<[TabsOptions?], Nodes> = (
  options: TabsOptions = { component: "Tabs" }
) => {
  const component = options.component || "Tabs";

  const renderTabsNode = (node: ContainerDirective): MdxJsxFlowElement => {
    return {
      type: "mdxJsxFlowElement",
      name: component,
      attributes: Object.entries(node.attributes || {})
        .filter(([name]) => name !== "items")
        .map(([name, value]) => ({
          type: "mdxJsxAttribute",
          name,
          value: toMdxAttributeValue(value)
        })),
      children: node.children.map((child) => {
        if (child.type === "containerDirective") {
          switch (child.name) {
            case "tab":
              return renderTabNode(child);
            case "tabs":
              return renderTabsNode(child);
          }
        }
        return child;
      })
    };
  };

  const renderTabNode = (node: ContainerDirective): MdxJsxFlowElement => {
    return {
      type: "mdxJsxFlowElement",
      name: "tab",
      attributes: Object.entries(node.attributes || {}).map(
        ([name, value]) => ({
          type: "mdxJsxAttribute",
          name,
          value: toMdxAttributeValue(value)
        })
      ),
      children: node.children.map((child) => {
        if (child.type === "containerDirective") {
          switch (child.name) {
            case "tab":
              return renderTabNode(child);
            case "tabs":
              return renderTabsNode(child);
          }
        }
        return child;
      })
    };
  };

  return (tree: Nodes) => {
    visit(tree, (node) => {
      if (
        node.type === "containerDirective" &&
        (node as ContainerDirective).name === "tabs"
      ) {
        Object.assign(node, renderTabsNode(node as ContainerDirective));
      }
    });
  };
};

export default remarkTabs;
