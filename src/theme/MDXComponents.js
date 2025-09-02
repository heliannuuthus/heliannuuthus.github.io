import Tooltip from "@components/Tooltip";
import { Collapse, CollapseHeading } from "@components/collapse";
import { Comment, CommentTooltip } from "@components/comment";
import { MDXRender, Markmap } from "@components/markdown";
import { Table } from "@components/table";
import { MarkdownTabs as Tabs } from "@components/tabs";
import TermPreview from "@components/terminology/TermPreview";
import MDXComponents from "@theme-original/MDXComponents";

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
  Markmap,
  Tabs,
  Collapse,
  Table
};
