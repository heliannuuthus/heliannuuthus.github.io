import { visit, setHast } from "./utils";

export const remarkHint = () => (tree: any) => {
  visit(tree, (node: any) => {
    if (node.type !== "textDirective" || node.name !== "hint") return;
    const attrs = node.attributes || {};
    const tipText = attrs.id || attrs.title || attrs["#"] || "";

    setHast(node, "span", {
      className: "text-sky-500 dark:text-sky-400 border-b border-dashed border-sky-400/40 cursor-help",
      title: tipText,
    });
  });
};
