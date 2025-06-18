import { Code, Nodes, Paragraph, Text } from "mdast";
import { MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";

export interface Mermaid {
  mermaid: string;
}

export interface MermaidOptions {
  mermaid: string;
}

const remarkMermaid: Plugin<[MermaidOptions?], Nodes> =
  (options: MermaidOptions = { mermaid: "Mermaid" }) =>
  (tree: Nodes) => {
    visit(tree, (node) => {
      const { mermaid = "Mermaid" } = options;
      if (node.type === "code" && node.lang === "mermaid") {
        const codeNode = node as Code;
        const { value } = codeNode;
        const jsxNode = {
          type: "mdxJsxFlowElement",
          name: mermaid,
          attributes: [
            {
              type: "mdxJsxAttribute",
              name: "value",
              value
            }
          ],
          children: []
        };
        Object.assign(node, jsxNode);
      }
    });
  };

export default remarkMermaid;
