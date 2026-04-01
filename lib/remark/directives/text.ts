import { visit, setHast } from "./utils";

const COLOR_MAP: Record<string, string> = {
  danger: "text-danger",
  warning: "text-warning",
  success: "text-success",
};

export const remarkText = () => (tree: any) => {
  visit(tree, (node: any) => {
    if (node.name !== "text") return;
    if (node.type !== "textDirective" && node.type !== "containerDirective") return;

    const raw = node.attributes || {};
    const classes: string[] = [];

    if (raw.type && COLOR_MAP[raw.type]) classes.push(COLOR_MAP[raw.type]);
    if (raw.align === "center") classes.push("text-center", "w-full", "my-2");

    const isBlock = node.type === "containerDirective" || !!raw.align;
    const tagName = raw.strong ? "strong" : isBlock ? "div" : "span";

    setHast(node, tagName, { className: classes.join(" ") || undefined });
  });
};
