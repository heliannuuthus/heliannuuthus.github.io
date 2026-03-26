import { TextDirective } from "mdast-util-directive";
import { MdxJsxTextElement } from "mdast-util-mdx-jsx";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";

export interface HintOptions {
  component?: string;
}

interface Directive extends TextDirective {
  name: string;
}

const remarkHint: Plugin<[HintOptions?]> = (
  options: HintOptions = { component: "Hint" }
) => {
  const { component = "Hint" } = options;

  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === "textDirective" &&
        (node as Directive).name === "hint"
      ) {
        const directiveNode = node as Directive;
        const attributes = directiveNode.attributes || {};

        const jsxNode: MdxJsxTextElement = {
          type: "mdxJsxTextElement",
          name: component,
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
          children: directiveNode.children
        };

        Object.assign(node, jsxNode);
      }
    });
  };
};

export default remarkHint;
