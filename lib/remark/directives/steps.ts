import { visit, setHast } from "./utils";

export const remarkSteps = () => (tree: any) => {
  visit(tree, (node: any) => {
    if (node.type !== "containerDirective") return;

    if (node.name === "steps") {
      setHast(node, "div", { "data-island": "Steps" });
    }

    if (node.name === "step") {
      const title = node.attributes?.title || "";
      setHast(node, "div", { "data-step": title });
    }
  });
};
