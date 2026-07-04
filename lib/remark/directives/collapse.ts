import { visit, setHast, escapeHtml } from "./utils";

export const remarkCollapse = () => (tree: any) => {
  visit(tree, (node: any) => {
    if (node.type !== "containerDirective" || node.name !== "collapse") return;
    const title = node.attributes?.title || "Details";

    const summary = {
      type: "html",
      value: `<summary class="cursor-pointer select-none font-medium text-sm text-default-700 dark:text-default-300 py-2">${escapeHtml(title)}</summary>`,
    };

    setHast(
      node,
      "details",
      { className: "my-6 glass rounded-2xl px-5 py-2 group open:pb-4" },
      [summary, ...node.children]
    );
  });
};
