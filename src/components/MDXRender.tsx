// MDXRenderer.jsx
import React, { useEffect, useState, Suspense } from "react";
import { MDXProvider } from "@mdx-js/react";
import * as runtime from "react/jsx-runtime";
import { evaluate } from "@mdx-js/mdx";
import remarkCommentTooltip from "heliannuuthus-remark-comment-tooltip";
import remarkDirective from "remark-directive";
import remarkExternalLink from "heliannuuthus-remark-external-link";
import remarkAdmonition from "heliannuuthus-remark-admomition";
import remarkMermaid from "heliannuuthus-remark-mermaid";
import remarkTerminology from "heliannuuthus-remark-terminology";
import MDXComponents from "@theme/MDXComponents";
import TermPreview from "@site/src/components/terms/TermPreview";
import { Comment } from "@site/src/components/Typography";
import Tooltip from "@site/src/components/Tooltip";
import TermAdmonition from "@theme/Admonition";
import Mermaid from "@theme/Mermaid";
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
        remarkDirective,
        remarkCommentTooltip,
        remarkTerminology,
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
      ],
      useMDXComponents: () => {
        return {
          ...MDXComponents,
          ...components,
          Comment,
          Tooltip,
          TermPreview,
          TermAdmonition,
          Term: TermPreview,
          Mermaid: Mermaid,
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
