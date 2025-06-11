// plugins/remark-collapse-headings.ts
import { Plugin } from "unified";
import { Root, RootContent, Heading } from "mdast";
import { toString } from "mdast-util-to-string";

export interface PluginOptions {
  component: string;
}

const plugin: Plugin<[PluginOptions], Root> = (
  options: PluginOptions = { component: "Collapse" },
) => {
  const { component = "Collapse" } = options;

  const toCollapse = (
    heading: Heading,
    children: RootContent[],
  ): RootContent => {
    let title = toString(heading);

    // 检查标题是否以 "-" 开头
    const isCollapsed = title.startsWith("-");
    title = isCollapsed ? title.slice(1).trim() : title;

    return {
      type: "mdxJsxTextElement",
      name: component,
      attributes: [
        {
          type: "mdxJsxAttribute",
          name: "title",
          value: title,
        },
        {
          type: "mdxJsxAttribute",
          name: "level",
          value: heading.depth,
        },
        isCollapsed && {
          type: "mdxJsxAttribute",
          name: "collapsed",
          value: null,
        },
      ],
      children: [...children],
    } as any;
  };

  return (tree: Root) => {
    const stack: { heading: Heading; children: RootContent[] }[] = [];

    const newChildren: RootContent[] = [];

    for (const node of tree.children) {
      if (node.type === "heading" && node.depth <= 6) {
        const headingNode = node as Heading;
        // 把之前堆栈中内容封装为 collapse
        while (
          stack.length > 0 &&
          stack[stack.length - 1].heading.depth >= headingNode.depth
        ) {
          const { heading, children } = stack.pop()!;
          const jsxNode = toCollapse(heading, children);
          if (stack.length > 0) {
            stack[stack.length - 1].children.push(jsxNode);
          } else {
            newChildren.push(jsxNode);
          }
        }

        stack.push({ heading: headingNode, children: [] });
      } else {
        if (stack.length > 0) {
          stack[stack.length - 1].children.push(node);
        } else {
          newChildren.push(node);
        }
      }
    }

    // 处理残留的 stack
    while (stack.length > 0) {
      const { heading, children } = stack.pop()!;
      const jsxNode = toCollapse(heading, children);
      if (stack.length > 0) {
        stack[stack.length - 1].children.push(jsxNode);
      } else {
        newChildren.push(jsxNode);
      }
    }

    tree.children = newChildren;
  };
};

export default plugin;
