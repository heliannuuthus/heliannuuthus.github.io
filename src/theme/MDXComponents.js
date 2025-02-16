import MDXComponents from "@theme-original/MDXComponents";
import Tooltip from "@site/src/components/Tooltip";
import { Comment } from "@site/src/components/Typography";
import TermPreview from "@site/src/components/terms/TermPreview";
import TermAdmonition from "@theme/Admonition";
export default {
  ...MDXComponents,
  Tooltip,
  Comment,
  TermAdmonition,
  Term: TermPreview,
  TermPreview,
};
