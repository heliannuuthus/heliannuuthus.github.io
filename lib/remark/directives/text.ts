import { visit, attr, toJsx } from "./utils";

/**
 * :text[content]{type="danger" strong align="center"}
 * → <Text type="..." strong align="...">content</Text>
 *
 * Also supports container directive for block-level:
 * :::text{align="center"}
 * content
 * :::
 */
export const remarkText = () => (tree: any) => {
  visit(tree, (node: any) => {
    if (node.name !== "text") return;
    if (node.type !== "textDirective" && node.type !== "containerDirective")
      return;

    const raw = node.attributes || {};
    const attributes = [];

    if (raw.type) attributes.push(attr("type", raw.type));
    if (raw.strong !== undefined) attributes.push(attr("strong", true));
    if (raw.align) attributes.push(attr("align", raw.align));

    const nodeType =
      node.type === "containerDirective"
        ? "mdxJsxFlowElement"
        : "mdxJsxTextElement";

    Object.assign(
      node,
      toJsx(nodeType, "Text", attributes, node.children)
    );
  });
};
