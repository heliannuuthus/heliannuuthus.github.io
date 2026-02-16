import type { Link, Nodes } from "mdast";
import type { Plugin } from "unified";
import { selectAll } from "unist-util-select";

export interface ExternalLinkOptions {
  href: string;
  target?: string;
  rel?: string[];
  test?: (node: Link) => boolean;
}

const remarkExternalLink: Plugin<[ExternalLinkOptions?], Nodes> =
  (
    options: ExternalLinkOptions = {
      href: "/external-link",
      target: "_blank",
      rel: ["nofollow", "noopener", "noreferrer"]
    }
  ) =>
  (tree: Nodes) => {
    const { test } = options;

    selectAll("link", tree).forEach((node) => {
      const value = node as Link;
      if (!test || !test(value)) {
        return;
      }
      value.data = {
        hProperties: {
          ...(options.href && {
            href: `${options.href}?href=${value.url}`
          }),
          ...(options.target && {
            target: options.target
          }),
          ...(options.rel && {
            rel: options.rel.join(" ")
          })
        }
      };
    });
  };

export default remarkExternalLink;
