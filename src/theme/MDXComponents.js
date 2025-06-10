import MDXComponents from "@theme-original/MDXComponents";
import Tooltip from "@site/src/components/Tooltip";
import { NowrapTooltip } from "@site/src/components/Tooltip";
import { Comment } from "@site/src/components/Typography";
import TermPreview from "@site/src/components/terms/TermPreview";
import TermAdmonition from "@theme/Admonition";
import { CollapseTitle } from "@site/src/components/Collapse";

export default {
  ...MDXComponents,
  NowrapTooltip,
  Tooltip,
  Comment,
  TermAdmonition,
  Term: TermPreview,
  TermPreview,
  Collapse: CollapseTitle,
};
