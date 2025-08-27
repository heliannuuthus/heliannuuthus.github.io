import MDXComponents from "@theme-original/MDXComponents";

import Tooltip from "@components/Tooltip";
import { CollapseHeading } from "@components/collapse";
import { Comment, CommentTooltip } from "@components/comment";
import { MDXRender, Markmap } from "@components/markdown";
import TermPreview from "@components/terminology/TermPreview";

import TermAdmonition from "@theme/Admonition";

export default {
  ...MDXComponents,
  Tooltip,
  Comment,
  CommentTooltip,
  TermAdmonition,
  Term: TermPreview,
  TermPreview,
  CollapseHeading,
  MDXRender,
  Markmap
};
