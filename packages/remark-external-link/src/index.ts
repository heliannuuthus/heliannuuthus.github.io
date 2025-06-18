import { Link, Nodes } from "mdast";
import { Plugin } from "unified";
import { selectAll } from "unist-util-select";

export interface ExternalLinkOptions {
  href: string;
  target?: string;
  rel?: string[];
  test?: (node: any) => boolean;
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

    selectAll("link", tree).forEach((value, _index, _array) => {
      if (!test || !test(value)) {
        return;
      }
      value.data = {
        hProperties: {
          ...(options.href && {
            href: `${options.href}?href=${(value as Link).url}`
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
