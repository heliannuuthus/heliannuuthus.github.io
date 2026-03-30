import { visit, attr, toJsx } from "./utils";

/**
 * :::steps             → <Steps>
 *   :::step{title="…"} → <Step title="…">children</Step>
 *   :::
 * :::
 */
export const remarkSteps = () => (tree: any) => {
  visit(tree, (node: any) => {
    if (node.type !== "containerDirective") return;

    if (node.name === "steps") {
      Object.assign(
        node,
        toJsx("mdxJsxFlowElement", "Steps", [], node.children)
      );
    }

    if (node.name === "step") {
      const title = node.attributes?.title || "";
      Object.assign(
        node,
        toJsx(
          "mdxJsxFlowElement",
          "Step",
          title ? [attr("title", title)] : [],
          node.children
        )
      );
    }
  });
};
