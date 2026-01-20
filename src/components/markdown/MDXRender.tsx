// MDXRenderer.jsx
import Tooltip from "@components/Tooltip";
import { Comment } from "@components/Typography";
import { CollapseHeading } from "@components/collapse";
import { Collapse } from "@components/collapse";
import CommentTooltip from "@components/comment/Tooltip";
import { Markmap } from "@components/markdown";
import { Table } from "@components/table";
import { MarkdownTabs as Tabs } from "@components/tabs";
import TermPreview from "@components/terminology/TermPreview";
import { evaluate } from "@mdx-js/mdx";
import { MDXProvider } from "@mdx-js/react";
import { createStyles } from "antd-style";
import remarkAdmonition from "heliannuuthus-remark-admomition";
import remarkBreaks from "heliannuuthus-remark-breaks";
import remarkCollapse from "heliannuuthus-remark-collapse";
import {
  plugin as remarkCollapseHeading,
  preprocessorPlugin as remarkCollapseHeadingPreprocessor
} from "heliannuuthus-remark-collapse-heading";
import remarkCommentTooltip from "heliannuuthus-remark-comment-tooltip";
import remarkExternalLink from "heliannuuthus-remark-external-link";
import remarkMarkmap from "heliannuuthus-remark-markmap";
import remarkMermaid from "heliannuuthus-remark-mermaid";
import remarkTables from "heliannuuthus-remark-tables";
import remarkTabs from "heliannuuthus-remark-tabs";
import remarkTerminology from "heliannuuthus-remark-terminology";
import { Link } from "mdast";
import React, { Suspense, useEffect, useState } from "react";
import * as runtime from "react/jsx-runtime";
import rehypeKatex from "rehype-katex";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import TermAdmonition from "@theme/Admonition";
import MDXComponents from "@theme/MDXComponents";
import Mermaid from "@theme/Mermaid";

const MDXRender = ({
  content,
  components
}: {
  content: string;
  components?: Record<string, React.ComponentType<any>>;
}) => {
  const [Component, setComponent] = useState(() => () => null);
  const evaluateContent = async () => {
    await evaluate(content, {
      ...runtime,

      remarkPlugins: [
        remarkCollapseHeadingPreprocessor,
        remarkDirective,
        remarkMath,
        remarkCommentTooltip,
        remarkTerminology,
        remarkBreaks,
        remarkMermaid,
        remarkGfm,
        [
          remarkAdmonition,
          {
            admonition: "TermAdmonition",
            extension: {
              nerd: {
                type: "nerd"
              },
              thinking: {
                type: "thinking"
              }
            }
          }
        ],
        [
          remarkExternalLink,
          {
            href: "/external-link",
            target: "_blank",
            rel: ["noopener", "noreferrer"],
            test: (node: Link) => node.url.startsWith("http")
          }
        ],
        remarkCollapseHeading,
        remarkCollapse,
        remarkTables,
        remarkMarkmap,
        remarkTabs
      ],
      rehypePlugins: [
        [
          rehypeKatex,
          {
            output: "mathml"
          }
        ]
      ],
      useMDXComponents: () => {
        return {
          ...MDXComponents,
          ...components,
          Comment,
          Tooltip,
          CommentTooltip,
          TermPreview,
          TermAdmonition,
          Term: TermPreview,
          Mermaid: Mermaid,
          CollapseHeading,
          Markmap,
          Tabs,
          Collapse,
          Table
        };
      }
    }).then((exports) => {
      setComponent(() => exports.default);
    });
  };

  useEffect(() => {
    evaluateContent();
  }, [content]);

  if (!Component) {
    return (
      <MDXProvider components={components}>
        <div>unknown component</div>
      </MDXProvider>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MDXProvider components={components}>
        <Component />
      </MDXProvider>
    </Suspense>
  );
};

const useStyles = createStyles(({ css }) => ({
  container: css`
    p {
      margin: 0;
    }
  `
}));

export const InlineMDXRender = ({ content }: { content: string }) => {
  const { styles } = useStyles();
  return (
    <div className={styles.container}>
      <MDXRender content={content} />
    </div>
  );
};

export default MDXRender;
