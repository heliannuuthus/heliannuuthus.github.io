import { Plugin } from "unified";
import { Nodes, PhrasingContent } from "mdast";
import { findAndReplace } from "mdast-util-find-and-replace";
import { MdxJsxTextElement } from "mdast-util-mdx-jsx";
export interface TooltipOptions {
  tooltip?: string;
  comment?: string;
}

const remarkTooltip: Plugin<[TooltipOptions?], Nodes> =
  (
    options: TooltipOptions = {
      tooltip: "Tooltip",
      comment: "Comment",
    },
  ) =>
  (tree: Nodes) => {
    const { tooltip, comment } = options;
    findAndReplace(tree, [
      /\[\[(.*?)(?<!\\)\|(.*?)\]\]/gs,
      (_match: string, content: string, title: string): PhrasingContent => {
        return {
          type: "mdxJsxTextElement",
          name: tooltip,
          attributes: [
            {
              type: "mdxJsxAttribute",
              name: "title",
              value: title.replace(/\\\|/g, "|"),
            },
          ],
          children: [
            {
              type: "mdxJsxTextElement",
              name: comment,
              attributes: [
                {
                  type: "mdxJsxAttribute",
                  name: "type",
                  value: "secondary",
                },
              ],
              children: [
                {
                  type: "text",
                  value: content.replace(/\\\|/g, "|"),
                },
              ],
            },
          ],
        } as MdxJsxTextElement;
      },
    ]);
  };

export default remarkTooltip;
