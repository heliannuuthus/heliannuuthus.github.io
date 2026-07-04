import type { Root, Element, ElementContent } from "hast";
import { visit } from "unist-util-visit";

function wrapElements(tree: Root, tagName: string, createWrapper: (node: Element) => Element) {
  const toWrap: { parent: Element | Root; index: number }[] = [];

  visit(tree, "element", (node: Element, index, parent) => {
    if (node.tagName === tagName && parent && typeof index === "number") {
      toWrap.push({ parent: parent as Element | Root, index });
    }
  });

  for (let i = toWrap.length - 1; i >= 0; i--) {
    const { parent, index } = toWrap[i];
    const children = "children" in parent ? parent.children : [];
    const node = children[index] as Element;
    children[index] = createWrapper(node) as ElementContent;
  }
}

const addClass = (node: Element, ...classes: string[]) => {
  const existing = (node.properties?.className ?? []) as string | string[];
  const arr = Array.isArray(existing) ? existing : existing ? [existing] : [];
  node.properties = { ...node.properties, className: [...arr, ...classes] };
};

const ELEMENT_CLASSES: Record<string, string[]> = {
  h1: ["text-3xl", "font-bold", "tracking-tight", "mt-10", "mb-4", "first:mt-0"],
  h2: ["text-2xl", "font-semibold", "tracking-tight", "mt-8", "mb-3", "pb-2", "border-b", "border-default-200"],
  h3: ["text-xl", "font-semibold", "mt-6", "mb-2"],
  h4: ["text-lg", "font-semibold", "mt-4", "mb-2"],
  p: ["leading-7", "my-4", "text-default-700", "dark:text-default-300"],
  ul: ["list-disc", "list-outside", "ml-6", "my-4", "space-y-1.5"],
  ol: ["list-decimal", "list-outside", "ml-6", "my-4", "space-y-1.5"],
  li: ["leading-7", "text-default-700", "dark:text-default-300"],
  blockquote: ["border-l-4", "border-emerald-500/40", "pl-4", "my-4", "text-default-500", "italic"],
  hr: ["my-8"],
  table: ["w-full", "text-sm"],
  thead: ["bg-default-100/60", "dark:bg-default-100/20", "text-[13px]", "font-semibold", "text-default-600"],
  tbody: ["divide-y", "divide-default-100"],
  tr: ["transition-colors", "hover:bg-default-50", "dark:hover:bg-default-100/10"],
  th: ["px-4", "py-2.5", "text-left", "font-semibold", "whitespace-nowrap"],
  td: ["px-4", "py-2.5", "text-default-700", "dark:text-default-300"],
};

export const rehypeProseClasses = () => (tree: Root) => {
  visit(tree, "element", (node: Element, _index, parent) => {
    const classes = ELEMENT_CLASSES[node.tagName];
    if (classes) addClass(node, ...classes);

    if (node.tagName === "code" && (parent as Element)?.tagName !== "pre") {
      addClass(
        node,
        "bg-default-100", "dark:bg-default-100/10",
        "rounded-lg", "px-1.5", "py-0.5",
        "text-sm", "font-mono",
        "text-emerald-600", "dark:text-emerald-400"
      );
    }

    if (node.tagName === "a") {
      const href = String(node.properties?.href ?? "");
      if (/^https?:\/\//.test(href)) {
        addClass(node, "text-sky-600", "dark:text-sky-400", "hover:text-sky-700", "dark:hover:text-sky-300", "hover:underline", "underline-offset-4");
      } else {
        addClass(node, "text-violet-600", "dark:text-violet-400", "hover:text-violet-700", "dark:hover:text-violet-300", "hover:underline", "underline-offset-4");
      }
    }

    if (node.tagName === "img") {
      addClass(node, "rounded-2xl", "max-w-full");
      node.properties.loading = "lazy";
      if (!node.properties.alt) node.properties.alt = "";
    }
  });

  wrapElements(tree, "img", (node) => ({
    type: "element",
    tagName: "figure",
    properties: { className: ["my-6", "flex", "justify-center"] },
    children: [node],
  }));

  wrapElements(tree, "table", (node) => ({
    type: "element",
    tagName: "div",
    properties: { className: ["my-6", "overflow-x-auto", "rounded-xl", "border", "border-default-200"] },
    children: [node],
  }));
};
