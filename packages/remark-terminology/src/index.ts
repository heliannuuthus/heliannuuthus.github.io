import { Nodes } from "mdast";
import { TextDirective } from "mdast-util-directive";
import { MdxJsxTextElement } from "mdast-util-mdx-jsx";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";

export interface TermAdmonition {
  type: string;
  title: string;
  icon: string;
}

export interface TermAdmonitionOptions {
  preview: string;
}

interface Directive extends TextDirective {
  name: string;
  label: string;
}

const remarkTerminology: Plugin<[TermAdmonitionOptions?], Nodes> =
  (
    options: TermAdmonitionOptions = {
      preview: "TermPreview"
    }
  ) =>
  (tree: Nodes) => {
    visit(tree, (node) => {
      const { preview = "TermPreview" } = options;
      if (
        node.type === "textDirective" &&
        (node as Directive).name === "term"
      ) {
        const directiveNode = node as Directive;
        const attributes = directiveNode.attributes || {};
        directiveNode.data = directiveNode.data || {};

        const jsxNode: MdxJsxTextElement = {
          type: "mdxJsxTextElement",
          name: preview,
          attributes: Object.entries(attributes).map(([name, value]) => {
            switch (name) {
              case "id":
              case "anchor":
                return {
                  type: "mdxJsxAttribute",
                  name: "anchor",
                  value: `#${value}`
                };
              case "class":
              case "path":
                return {
                  type: "mdxJsxAttribute",
                  name: "path",
                  value: value
                };
              default:
                return {
                  type: "mdxJsxAttribute",
                  name: name,
                  value: value
                };
            }
          }),
          children: directiveNode.children
        };
        Object.assign(node, jsxNode);
      }
    });
  };

export default remarkTerminology;
