// plugins/remark-collapse-headings.ts
import { Heading, Root, RootContent } from "mdast";
import { toString } from "mdast-util-to-string";
import { Plugin } from "unified";

// 扩展 HeadingData 类型
declare module "mdast" {
  interface HeadingData {
    collapsed?: boolean;
  }
}

export interface CollapseHeadingOptions {
  component: string;
}

// 预处理插件：处理标题中的折叠标记
const preprocessorPlugin: Plugin<[], Root> = () => {
  return (tree: Root) => {
    for (const node of tree.children) {
      if (node.type === "heading") {
        const heading = node as Heading;
        const title = toString(heading);

        if (title.startsWith("-")) {
          // 添加折叠标记
          if (!heading.data) {
            heading.data = {};
          }
          heading.data.collapsed = true;

          // 移除标题中的 "-" 前缀
          const firstChild = heading.children[0];
          if (firstChild && firstChild.type === "text") {
            firstChild.value = firstChild.value.slice(1).trim();
          }
        }
      }
    }
  };
};

// 转换插件：将标题转换为折叠组件
const plugin: Plugin<[CollapseHeadingOptions], Root> = (
  options: CollapseHeadingOptions = { component: "Collapse" }
) => {
  const { component = "Collapse" } = options;

  const toCollapse = (
    heading: Heading,
    children: RootContent[]
  ): RootContent => {
    const title = toString(heading);
    const isCollapsed = heading.data?.collapsed === true;

    return {
      type: "mdxJsxTextElement",
      name: component,
      attributes: [
        {
          type: "mdxJsxAttribute",
          name: "title",
          value: title
        },
        {
          type: "mdxJsxAttribute",
          name: "level",
          value: heading.depth
        },
        isCollapsed && {
          type: "mdxJsxAttribute",
          name: "collapsed",
          value: null
        }
      ],
      children: [...children]
    } as any;
  };

  return (tree: Root) => {
    const stack: { heading: Heading; children: RootContent[] }[] = [];
    const newChildren: RootContent[] = [];

    for (const node of tree.children) {
      if (node.type === "heading" && node.depth <= 6) {
        const headingNode = node as Heading;
        // 处理堆栈中的内容
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

    // 处理剩余的堆栈内容
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

export { preprocessorPlugin, plugin };

export default { preprocessorPlugin, plugin };
