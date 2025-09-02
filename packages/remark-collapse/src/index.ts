import { Nodes } from "mdast";
import { ContainerDirective } from "mdast-util-directive";
import { MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";

export interface CollapseOptions {
  component: string;
}

const remarkCollapse: Plugin<[CollapseOptions?], Nodes> =
  (
    options: CollapseOptions = {
      component: "Collapse"
    }
  ) =>
  (tree: Nodes) => {
    const { component = "Collapse" } = options;
    visit(tree, (node) => {
      const directiveNode = node as ContainerDirective;
      if (
        directiveNode.type === "containerDirective" &&
        directiveNode.name === "collapse"
      ) {
        const jsxNode: MdxJsxFlowElement = {
          type: "mdxJsxFlowElement",
          name: component,
          attributes: directiveNode.attributes
            ? Object.entries(directiveNode.attributes).map(([name, value]) => ({
                type: "mdxJsxAttribute",
                name,
                value
              }))
            : [],
          children: (node as ContainerDirective).children
        };
        Object.assign(node, jsxNode);
      }
    });
  };

export default remarkCollapse;
