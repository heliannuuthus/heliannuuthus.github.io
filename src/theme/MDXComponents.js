import MDXComponents from "@theme-original/MDXComponents";

import Tooltip from "@site/src/components/Tooltip";
import { CollapseHeading } from "@site/src/components/collapse";
import { Comment, CommentTooltip } from "@site/src/components/comment";
import MDXRender from "@site/src/components/markdown/MDXRender";
import Markmap from "@site/src/components/markdown/markmap";
import TermPreview from "@site/src/components/terminology/TermPreview";

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
