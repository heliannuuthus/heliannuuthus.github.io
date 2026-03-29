import type { MDXComponents } from "mdx/types";
import { Separator } from "@heroui/react/separator";
import Admonition from "./blocks/Admonition";
import CodeBlock from "./blocks/CodeBlock";
import Collapse from "./blocks/Collapse";
import Hint from "./blocks/hint";
import TermPreview from "./blocks/term-preview";
import { Tabs, Tab } from "./blocks/Tabs";
import Mermaid from "./blocks/Mermaid";
import Markmap from "./blocks/Markmap";
import Steps from "./blocks/Steps";
import {
  MdxTable,
  MdxThead,
  MdxTbody,
  MdxTr,
  MdxTh,
  MdxTd,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell
} from "./blocks/Table";
import Timeline from "./blocks/Timeline";
import {
  Center,
  LegacyImage,
  Flex,
  Text,
  DocusaurusLink,
  LegacyLink,
  Collapses
} from "./blocks/legacy-compat";

export const mdxComponents: MDXComponents = {
  h1: (props) => (
    <h1
      className="text-3xl font-bold tracking-tight mt-10 mb-4 first:mt-0"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="text-2xl font-semibold tracking-tight mt-8 mb-3 pb-2 border-b border-default-200"
      {...props}
    />
  ),
  h3: (props) => (
    <h3 className="text-xl font-semibold mt-6 mb-2" {...props} />
  ),
  h4: (props) => (
    <h4 className="text-lg font-semibold mt-4 mb-2" {...props} />
  ),
  p: (props) => (
    <div
      className="leading-7 my-4 text-default-700 dark:text-default-300"
      {...props}
    />
  ),
  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith("http");
    return (
      <a
        href={href || "#"}
        className="text-emerald-600 dark:text-emerald-400 hover:underline underline-offset-4"
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        {...props}
      >
        {children}
      </a>
    );
  },
  ul: (props) => (
    <ul className="list-disc list-outside ml-6 my-4 space-y-1.5" {...props} />
  ),
  ol: (props) => (
    <ol
      className="list-decimal list-outside ml-6 my-4 space-y-1.5"
      {...props}
    />
  ),
  li: (props) => (
    <li
      className="leading-7 text-default-700 dark:text-default-300"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="border-l-4 border-emerald-500/40 pl-4 my-4 text-default-500 italic"
      {...props}
    />
  ),
  hr: () => <Separator className="my-8" />,
  
  pre: (props) => <CodeBlock {...props} />,
  code: ({ className, children, ...props }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code
          className="bg-default-100 dark:bg-default-100/10 rounded-lg px-1.5 py-0.5 text-sm font-mono text-emerald-600 dark:text-emerald-400"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="rounded-2xl my-4 max-w-full"
      loading="lazy"
      alt={props.alt || ""}
      {...props}
    />
  ),

  Admonition,
  Collapse,
  Hint,
  TermPreview,
  Tabs,
  Tab,
  Mermaid,
  Markmap,
  Steps,
  table: MdxTable,
  thead: MdxThead,
  tbody: MdxTbody,
  tr: MdxTr,
  th: MdxTh,
  td: MdxTd,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Timeline,
  Center,
  Image: LegacyImage,
  Flex,
  Text,
  DocusaurusLink,
  Link: LegacyLink,
  Collapses,
};
