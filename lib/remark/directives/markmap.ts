import { visit } from "./utils";

export const remarkMarkmap = () => (tree: any) => {
  visit(tree, (node: any) => {
    if (node.type !== "code" || node.lang !== "markmap") return;
    const value = node.value;

    Object.assign(node, {
      type: "containerDirective",
      name: "__markmap",
      data: {
        hName: "div",
        hProperties: {
          "data-island": "Markmap",
          "data-value": value,
          class: "glass rounded-2xl my-4 overflow-hidden",
        },
      },
      children: [{ type: "text", value: "Loading mindmap..." }],
      lang: undefined,
      value: undefined,
      meta: undefined,
    });
  });
};
