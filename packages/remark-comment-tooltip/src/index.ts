import { TextDirective } from "mdast-util-directive";
import { MdxJsxTextElement } from "mdast-util-mdx-jsx";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";

export interface TooltipOptions {
  tooltip?: string;
  comment?: string;
}

interface Directive extends TextDirective {
  name: string;
}

const remarkCtip: Plugin<[TooltipOptions?]> = (
  options: TooltipOptions = {
    tooltip: "CommentTooltip",
    comment: "Comment"
  }
) => {
  const { tooltip = "CommentTooltip", comment = "Comment" } = options;

  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === "textDirective" &&
        (node as Directive).name === "ctip"
      ) {
        const directiveNode = node as Directive;
        const attributes = directiveNode.attributes || {};
        directiveNode.data = directiveNode.data || {};

        const jsxNode: MdxJsxTextElement = {
          type: "mdxJsxTextElement",
          name: tooltip,
          attributes: Object.entries(attributes).map(([name, value]) => {
            if (name === "id" || name === "title") {
              return {
                type: "mdxJsxAttribute",
                name: "title",
                value
              };
            }
            return {
              type: "mdxJsxAttribute",
              name,
              value
            };
          }),
          children: [
            {
              type: "mdxJsxTextElement",
              name: comment,
              attributes: [],
              children: directiveNode.children
            }
          ]
        };

        // 将转换后的 JSX 节点赋值回原节点
        Object.assign(node, jsxNode);
      }
    });
  };
};

export default remarkCtip;
