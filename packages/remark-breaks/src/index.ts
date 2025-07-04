import { Nodes } from "mdast";
import { findAndReplace } from "mdast-util-find-and-replace";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { Test } from "unist-util-visit";

export interface BreaksOptions {
  ignore?: Test;
}

const remarkRevertBreaks: Plugin<[BreaksOptions?], Nodes> =
  (
    options: BreaksOptions = {
      ignore: []
    }
  ) =>
  (tree: Nodes) => {
    visit(tree, "break", (_, index, parent) => {
      if (parent && typeof index === "number") {
        parent.children.splice(index, 1);
      }
    });
    findAndReplace(
      tree,
      [
        /\r?\n|\r/g,
        (_) => {
          return { type: "break" };
        }
      ],
      {
        ignore: options.ignore
      }
    );
  };

export default remarkRevertBreaks;
