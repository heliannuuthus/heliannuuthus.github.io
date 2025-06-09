// Remark plugin to wrap headings and content for MDX (src/plugins/remark-collapse.js)
import { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { Heading, Node, Parent, RootContent } from "mdast";
import {
  MdxJsxFlowElement,
  MdxJsxTextElement,
  MdxJsxAttributeValueExpression,
} from "mdast-util-mdx-jsx";

export interface PluginOptions {
  depth?: Array<number>;
  component?: string;
}

const remarkCollapseTitle: Plugin<[PluginOptions?]> = (
  options: PluginOptions = {},
) => {
  const { depth = [2, 3], component = "Collapse" } = options;

  return (tree) => {
    visit(tree, "heading", (node: Heading) => {
      if (depth?.includes(node.depth)) {
        const collapsibleNode: MdxJsxTextElement = {
          type: "mdxJsxTextElement",
          name: component,
          attributes: [
            {
              type: "mdxJsxAttribute",
              name: "title",
              value: node.children
                .filter((child) => child.type === "text")
                .map((child) => child.value)
                .join(""),
            },
            {
              type: "mdxJsxAttribute",
              name: "level",
              value: node.depth,
            },
          ],
          children: node.children,
        } as MdxJsxTextElement;
        Object.assign(node, collapsibleNode);
      }
    });
  };
};

export default remarkCollapseTitle;
