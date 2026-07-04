import { visit } from "unist-util-visit";

export const escapeHtml = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const setHast = (
  node: any,
  tagName: string,
  properties: Record<string, any>,
  children?: any[]
) => {
  node.data = { hName: tagName, hProperties: properties };
  if (children !== undefined) node.children = children;
};

export const wrapChildren = (
  tagName: string,
  properties: Record<string, any>,
  children: any[]
): any => ({
  type: "containerDirective",
  name: "__wrapper",
  data: { hName: tagName, hProperties: properties },
  children,
});

export { visit };
