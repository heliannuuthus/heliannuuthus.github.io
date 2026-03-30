import { visit } from "unist-util-visit";

export type MdxAttr = { type: "mdxJsxAttribute"; name: string; value: any };
export type MdxExpr = { type: "mdxJsxExpression"; value: string };

export const attr = (name: string, value: any): MdxAttr => {
  if (value === null || value === undefined || typeof value === "string") {
    return { type: "mdxJsxAttribute", name, value };
  }
  return {
    type: "mdxJsxAttribute",
    name,
    value: { type: "mdxJsxExpression", value: JSON.stringify(value) } as MdxExpr
  };
};

export const toJsx = (
  nodeType: "mdxJsxFlowElement" | "mdxJsxTextElement",
  name: string,
  attributes: MdxAttr[],
  children: any[]
) => ({ type: nodeType, name, attributes, children });

export { visit };
