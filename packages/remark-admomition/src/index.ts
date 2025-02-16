import { Plugin } from "unified";
import { Nodes, Paragraph, Text } from "mdast";
import { visit } from "unist-util-visit";
import { ContainerDirective } from "mdast-util-directive";
import { MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import { inspect } from "unist-util-inspect";
const origins = ["tip", "note", "warning", "danger", "info"];

export interface Admonition {
  type: string;
  title: string;
  icon: string;
}

export interface AdmonitionOptions {
  admonition: string;
  extension: Record<string, Admonition>;
}

interface Directive extends ContainerDirective {
  name: string;
  label: string;
}

const remarkAdmonition: Plugin<[AdmonitionOptions?], Nodes> =
  (
    options: AdmonitionOptions = {
      admonition: "Admonition",
      extension: {},
    },
  ) =>
  (tree: Nodes) => {
    visit(tree, (node) => {
      const { admonition = "Admonition", extension = {} } = options;
      if (
        node.type === "containerDirective" &&
        origins.includes((node as Directive).name)
      ) {
        const directiveNode = node as Directive;
        const attributes = directiveNode.attributes || {};
        directiveNode.data = directiveNode.data || {};

        const jsxNode: MdxJsxFlowElement = {
          type: "mdxJsxFlowElement",
          name: admonition,
          attributes: Object.entries(attributes).map(([name, value]) => ({
            type: "mdxJsxAttribute",
            name,
            value,
          })),
          children: directiveNode.children,
        };
        Object.assign(node, jsxNode);
      }

      const extend = extension[(node as Directive).name];
      if (node.type === "containerDirective" && extend) {
        const directiveNode = node as Directive;
        const attributes = directiveNode.attributes || {};
        directiveNode.data = directiveNode.data || {};
        let title = directiveNode.label || attributes.title || extend.title;
        directiveNode.children = directiveNode.children.filter((child) => {
          if (
            child.data &&
            Object.keys(child.data).includes("directiveLabel") &&
            (child as Paragraph).children[0] &&
            (child as Paragraph).children[0].type === "text"
          ) {
            title = ((child as Paragraph).children[0] as Text).value;
            return false;
          }
          return true;
        });

        const jsxNode: MdxJsxFlowElement = {
          type: "mdxJsxFlowElement",
          name: admonition,
          attributes: [
            {
              type: "mdxJsxAttribute",
              name: "icon",
              value: attributes.icon || extend.icon,
            },
            {
              type: "mdxJsxAttribute",
              name: "title",
              value: title,
            },
            {
              type: "mdxJsxAttribute",
              name: "type",
              value: attributes.type || extend.type,
            },
          ],
          children: directiveNode.children,
        };
        Object.assign(node, jsxNode);
      }
    });
  };

export default remarkAdmonition;
