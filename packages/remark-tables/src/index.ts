import { BlockContent, Table as MdastTable, Nodes, TableRow } from "mdast";
import { MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";

export interface TablesOptions {
  component?: string;
}

const remarkTables: Plugin<[TablesOptions?], Nodes> =
  (
    options: TablesOptions = {
      component: "Table"
    }
  ) =>
  (tree: Nodes) => {
    const { component = "Table" } = options;
    visit(tree, "table", (node) => {
      const table = node as MdastTable;
      const header = table.children[0] as TableRow;

      header.children.forEach((cell, index) => {
        if (cell.children.length === 0) {
          cell.children = [{ type: "text", value: "Column " + (index + 1) }];
        }
      });

      const jsxNode: MdxJsxFlowElement = {
        type: "mdxJsxFlowElement",
        name: component,
        attributes: table.align
          ? table.align
              .filter((align) => align)
              .map((align) => ({
                type: "mdxJsxAttribute",
                name: "align",
                value: align as "left" | "center" | "right"
              }))
          : [],
        children: table.children as any
      };

      Object.assign(node, jsxNode);
    });
  };

export default remarkTables;
