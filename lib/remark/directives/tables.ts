import { visit, attr, toJsx } from "./utils";

/**
 * Markdown tables → HeroUI Table-compatible JSX structure:
 * <Table> → <TableHeader> + <TableColumn>... → <TableBody> + <TableRow> + <TableCell>...
 */
export const remarkTables = () => (tree: any) => {
  visit(tree, "table", (node: any) => {
    const [headerRow, ...bodyRows] = node.children ?? [];

    const columns = (headerRow?.children ?? []).map((cell: any, i: number) => {
      const content = cell.children?.length
        ? cell.children
        : [{ type: "text", value: `Column ${i + 1}` }];
      return toJsx("mdxJsxFlowElement", "TableColumn", [attr("id", String(i))], content);
    });

    const header = toJsx("mdxJsxFlowElement", "TableHeader", [], columns);

    const rows = bodyRows.map((row: any, ri: number) => {
      const cells = (row.children ?? []).map((cell: any) =>
        toJsx("mdxJsxFlowElement", "TableCell", [], cell.children ?? [])
      );
      return toJsx("mdxJsxFlowElement", "TableRow", [attr("id", String(ri))], cells);
    });

    const body = toJsx("mdxJsxFlowElement", "TableBody", [], rows);

    Object.assign(
      node,
      toJsx("mdxJsxFlowElement", "Table", [], [header, body])
    );
  });
};
