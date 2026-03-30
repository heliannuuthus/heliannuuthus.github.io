import { selectAll } from "unist-util-select";

/**
 * External links: add target="_blank" rel="noopener noreferrer"
 */
export const remarkExternalLink = () => (tree: any) => {
  selectAll("link", tree).forEach((node: any) => {
    if (node.url && /^https?:\/\//.test(node.url)) {
      node.data = {
        ...node.data,
        hProperties: {
          ...(node.data?.hProperties || {}),
          target: "_blank",
          rel: "nofollow noopener noreferrer"
        }
      };
    }
  });
};
