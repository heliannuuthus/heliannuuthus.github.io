import { visit, attr, toJsx } from "./utils";

const ADMONITION_TYPES = ["tip", "note", "warning", "danger", "info", "caution", "nerd"];

/**
 * :::note / :::tip / :::warning / :::danger / :::info / :::caution / :::nerd
 * → <Admonition type="..." title="...">
 */
export const remarkAdmonition = () => (tree: any) => {
  visit(tree, (node: any) => {
    if (node.type !== "containerDirective") return;
    if (!ADMONITION_TYPES.includes(node.name)) return;

    let title = node.name.charAt(0).toUpperCase() + node.name.slice(1);

    node.children = node.children.filter((child: any) => {
      if (
        child.data?.directiveLabel &&
        child.children?.[0]?.type === "text"
      ) {
        title = child.children[0].value;
        return false;
      }
      return true;
    });

    Object.assign(
      node,
      toJsx("mdxJsxFlowElement", "Admonition", [attr("type", node.name), attr("title", title)], node.children)
    );
  });
};
