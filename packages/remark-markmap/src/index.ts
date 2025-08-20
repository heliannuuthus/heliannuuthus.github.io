import { Code, Nodes } from "mdast";
import { MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";

export interface MarkmapOptions {
  /** 生成的组件名称，默认为 "Markmap" */
  markmap?: string;
}

const remarkMarkmap: Plugin<[MarkmapOptions?], Nodes> =
  (options: MarkmapOptions = { markmap: "Markmap" }) =>
  (tree: Nodes) => {
    const { markmap = "Markmap" } = options;
    visit(tree, (node) => {
      if (node.type === "code" && (node as Code).lang === "markmap") {
        const codeNode = node as Code;
        const { value } = codeNode;
        const jsxNode: MdxJsxFlowElement = {
          type: "mdxJsxFlowElement",
          name: markmap,
          attributes: [
            {
              type: "mdxJsxAttribute",
              name: "markdown",
              value
            }
          ],
          children: []
        };
        Object.assign(node, jsxNode);
      }
    });
  };

export default remarkMarkmap;
