// MDXRenderer.jsx
import React, { useEffect, useState, Suspense } from "react";
import { MDXProvider } from "@mdx-js/react";
import * as runtime from "react/jsx-runtime";
import { evaluate } from "@mdx-js/mdx";
import remarkParse from "remark-parse";
import remarkCommentTooltip from "heliannuuthus-remark-comment-tooltip";
import remarkDirective from "remark-directive";
import remarkExternalLink from "heliannuuthus-remark-external-link";
import remarkAdmonition from "heliannuuthus-remark-admomition";
import remarkMermaid from "heliannuuthus-remark-mermaid";
import remarkTerminology from "heliannuuthus-remark-terminology";
import remarkBreaks from "heliannuuthus-remark-breaks";
import remarkCollapseTitle from "heliannuuthus-remark-collapse-title";
import MDXComponents from "@theme/MDXComponents";
import TermPreview from "@site/src/components/terms/TermPreview";
import { Comment } from "@site/src/components/Typography";
import Tooltip from "@site/src/components/Tooltip";
import { NowrapTooltip } from "@site/src/components/Tooltip";
import TermAdmonition from "@theme/Admonition";
import Mermaid from "@theme/Mermaid";
import { Collapse } from "@site/src/components/Collapse";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const MDXRender = ({
  content,
  components,
}: {
  content: string;
  components?: Record<string, React.ComponentType<any>>;
}) => {
  const [Component, setComponent] = useState(() => () => null);
  const evaluateContent = async () => {
    await evaluate(content, {
      ...runtime,
      remarkPlugins: [
        remarkParse,
        remarkMath,
        remarkDirective,
        [
          remarkCommentTooltip,
          {
            tooltip: "NowrapTooltip",
            comment: "Comment",
          },
        ],
        remarkTerminology,
        remarkBreaks,
        remarkMermaid,
        [
          remarkAdmonition,
          {
            admonition: "TermAdmonition",
          },
        ],
        [
          remarkExternalLink,
          {
            href: "/external-link",
            target: "_blank",
            rel: ["noopener", "noreferrer"],
            test: (node: any) => node.url.startsWith("http"),
          },
        ],
        remarkCollapseTitle,
      ],
      rehypePlugins: [
        [
          rehypeKatex,
          {
            output: "mathml",
          },
        ],
      ],
      useMDXComponents: () => {
        return {
          ...MDXComponents,
          ...components,
          Comment,
          Tooltip,
          NowrapTooltip,
          TermPreview,
          TermAdmonition,
          Term: TermPreview,
          Mermaid: Mermaid,
          Collapse: Collapse,
        };
      },
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

export default MDXRender;
