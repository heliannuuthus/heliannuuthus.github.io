// Remark plugin to wrap headings and content for MDX (src/plugins/remark-collapse.js)
import { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { Heading, Node, Text } from "mdast";
import { MdxJsxTextElement } from "mdast-util-mdx-jsx";

export interface PluginOptions {
  component?: string;
}

interface HeadingNode {
  type: "heading";
  depth: number;
  children: HeadingNode[];
  content: Node[];
  title: string;
}

const remarkCollapseTitle: Plugin<[PluginOptions?]> = (
  options: PluginOptions = {}
) => {
  const { component = "Collapse" } = options;

  return (tree) => {
    const root: HeadingNode = {
      type: "heading",
      depth: 0,
      children: [],
      content: [],
      title: "",
    };

    let currentPath: HeadingNode[] = [root];
    let currentContent: Node[] = [];

    visit(tree, (node: Node) => {
      if (node.type === "heading") {
        const heading = node as Heading;
        const title = heading.children
          .filter((child) => child.type === "text")
          .map((child) => (child as Text).value)
          .join("");

        // 找到当前标题应该插入的父节点
        while (
          currentPath.length > 1 &&
          currentPath[currentPath.length - 1].depth >= heading.depth
        ) {
          const lastNode = currentPath.pop()!;
          if (currentContent.length > 0) {
            lastNode.content = [...currentContent];
            currentContent = [];
          }
        }

        const parent = currentPath[currentPath.length - 1];
        const headingNode: HeadingNode = {
          type: "heading",
          depth: heading.depth,
          children: [],
          content: [],
          title,
        };

        parent.children.push(headingNode);
        currentPath.push(headingNode);
      } else {
        // 创建节点的深拷贝
        const nodeCopy = JSON.parse(JSON.stringify(node));
        currentContent.push(nodeCopy);
      }
    });

    // 处理最后一个节点的内容
    if (currentContent.length > 0) {
      currentPath[currentPath.length - 1].content = [...currentContent];
    }

    // 将层级结构转换为 MDX 组件
    const convertToMdx = (node: HeadingNode): MdxJsxTextElement | Node => {
      if (node.depth === 0) {
        return {
          type: "root",
          children: node.children.map(convertToMdx),
        } as Node;
      }

      // 创建新的内容节点数组
      const contentNodes = node.content.map(
        (content: Node) =>
          ({
            ...content,
            children: content.children ? [...content.children] : undefined,
          } as Node)
      );

      return {
        type: "mdxJsxTextElement",
        name: component,
        attributes: [
          {
            type: "mdxJsxAttribute",
            name: "title",
            value: node.title,
          },
          {
            type: "mdxJsxAttribute",
            name: "level",
            value: String(node.depth),
          },
        ],
        children: [...contentNodes, ...node.children.map(convertToMdx)] as any,
      };
    };

    // 替换原始树的内容
    Object.assign(tree, {
      children: root.children.map(convertToMdx),
    });
  };
};

export default remarkCollapseTitle;
