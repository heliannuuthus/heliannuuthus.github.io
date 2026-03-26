import type { MDXComponents } from "mdx/types";
import Admonition from "./blocks/Admonition";
import Collapse from "./blocks/Collapse";
import Hint from "./blocks/hint";
import TermPreview from "./blocks/term-preview";
import { Tabs, Tab } from "./blocks/Tabs";
import Mermaid from "./blocks/Mermaid";
import Markmap from "./blocks/Markmap";
import Table from "./blocks/Table";

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
    <p
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
  hr: () => <hr className="my-8 border-default-200" />,
  table: (props) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-sm border-collapse" {...props} />
    </div>
  ),
  th: (props) => (
    <th
      className="border border-default-200 px-4 py-2 text-left font-semibold bg-default-50 dark:bg-default-100/5"
      {...props}
    />
  ),
  td: (props) => (
    <td className="border border-default-200 px-4 py-2" {...props} />
  ),
  pre: (props) => (
    <pre
      className="glass rounded-2xl p-4 overflow-x-auto my-4 text-sm leading-6"
      {...props}
    />
  ),
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
  Table,
};
