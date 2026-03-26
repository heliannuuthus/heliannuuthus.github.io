import { visit } from "unist-util-visit";
import { selectAll } from "unist-util-select";
import { getTermBySlug } from "@/lib/terms";

type MdxAttr = { type: "mdxJsxAttribute"; name: string; value: any };
type MdxExpr = { type: "mdxJsxExpression"; value: string };

function attr(name: string, value: any): MdxAttr {
  if (value === null || value === undefined || typeof value === "string") {
    return { type: "mdxJsxAttribute", name, value };
  }
  return {
    type: "mdxJsxAttribute",
    name,
    value: { type: "mdxJsxExpression", value: JSON.stringify(value) } as MdxExpr
  };
}

function toJsx(
  nodeType: "mdxJsxFlowElement" | "mdxJsxTextElement",
  name: string,
  attributes: MdxAttr[],
  children: any[]
) {
  return { type: nodeType, name, attributes, children };
}

const ADMONITION_TYPES = ["tip", "note", "warning", "danger", "info", "caution", "nerd"];

/**
 * :::note / :::tip / :::warning / :::danger / :::info / :::caution / :::nerd
 * → <Admonition type="..." title="...">
 */
export function remarkAdmonition() {
  return (tree: any) => {
    visit(tree, (node: any) => {
      if (node.type !== "containerDirective") return;
      if (!ADMONITION_TYPES.includes(node.name)) return;

      let title = node.name.charAt(0).toUpperCase() + node.name.slice(1);

      node.children = node.children.filter((child: any) => {
        if (
          child.data?.directiveLabel &&
          child.children?.[0]?.type === "text"
        ) {
          title = child.children[0].value;
          return false;
        }
        return true;
      });

      Object.assign(
        node,
        toJsx("mdxJsxFlowElement", "Admonition", [attr("type", node.name), attr("title", title)], node.children)
      );
    });
  };
}

/**
 * :::collapse{title="..."}
 * → <Collapse title="...">
 */
export function remarkCollapse() {
  return (tree: any) => {
    visit(tree, (node: any) => {
      if (node.type !== "containerDirective" || node.name !== "collapse") return;
      const attrs = node.attributes || {};
      Object.assign(
        node,
        toJsx(
          "mdxJsxFlowElement",
          "Collapse",
          Object.entries(attrs).map(([k, v]) => attr(k, v)),
          node.children
        )
      );
    });
  };
}

/**
 * :hint[text]{#annotation}  or  :hint[text]{title="annotation"}
 * → <Hint title="annotation">text</Hint>
 */
export function remarkHint() {
  return (tree: any) => {
    visit(tree, (node: any) => {
      if (node.type !== "textDirective" || node.name !== "hint") return;
      const attrs = node.attributes || {};
      const tipText = attrs.id || attrs.title || attrs["#"] || "";

      Object.assign(
        node,
        toJsx("mdxJsxTextElement", "Hint", [attr("title", tipText)], node.children)
      );
    });
  };
}

/**
 * :term[display text]{#slug}  or  :term[display text]{slug=xxx}
 * → <TermPreview slug="..." title="..." definition="...">display text</TermPreview>
 *
 * title / definition are resolved at compile time from terminologies/*.yml
 */
export function remarkTerminology() {
  return (tree: any) => {
    visit(tree, (node: any) => {
      if (node.type !== "textDirective" || node.name !== "term") return;
      const attrs = node.attributes || {};
      const slug = attrs.slug || attrs.id || attrs.class || "";

      const term = getTermBySlug(slug);
      const jsxAttrs: MdxAttr[] = [
        attr("slug", slug),
        attr("title", term?.title || ""),
        attr("definition", term?.definition || "")
      ];

      Object.assign(
        node,
        toJsx("mdxJsxTextElement", "TermPreview", jsxAttrs, node.children)
      );
    });
  };
}

/**
 * :::tabs / :::tab{label="..."}
 * → <Tabs><Tab label="...">...</Tab></Tabs>
 */
export function remarkTabs() {
  function renderTabs(node: any): any {
    return toJsx(
      "mdxJsxFlowElement",
      "Tabs",
      Object.entries(node.attributes || {})
        .filter(([k]) => k !== "items")
        .map(([k, v]) => attr(k, v)),
      node.children.map((child: any) => {
        if (child.type === "containerDirective") {
          if (child.name === "tab") return renderTab(child);
          if (child.name === "tabs") return renderTabs(child);
        }
        return child;
      })
    );
  }

  function renderTab(node: any): any {
    return toJsx(
      "mdxJsxFlowElement",
      "Tab",
      Object.entries(node.attributes || {}).map(([k, v]) => attr(k, v)),
      node.children.map((child: any) => {
        if (child.type === "containerDirective") {
          if (child.name === "tab") return renderTab(child);
          if (child.name === "tabs") return renderTabs(child);
        }
        return child;
      })
    );
  }

  return (tree: any) => {
    visit(tree, (node: any) => {
      if (node.type !== "containerDirective" || node.name !== "tabs") return;
      Object.assign(node, renderTabs(node));
    });
  };
}

/**
 * ```mermaid → <Mermaid value="..." />
 */
export function remarkMermaid() {
  return (tree: any) => {
    visit(tree, (node: any) => {
      if (node.type !== "code" || node.lang !== "mermaid") return;
      Object.assign(
        node,
        toJsx("mdxJsxFlowElement", "Mermaid", [attr("value", node.value)], [])
      );
    });
  };
}

/**
 * ```markmap → <Markmap markdown="..." />
 */
export function remarkMarkmap() {
  return (tree: any) => {
    visit(tree, (node: any) => {
      if (node.type !== "code" || node.lang !== "markmap") return;
      Object.assign(
        node,
        toJsx("mdxJsxFlowElement", "Markmap", [attr("markdown", node.value)], [])
      );
    });
  };
}

/**
 * External links: add target="_blank" rel="noopener noreferrer"
 */
export function remarkExternalLink() {
  return (tree: any) => {
    selectAll("link", tree).forEach((node: any) => {
      if (node.url && /^https?:\/\//.test(node.url)) {
        node.data = {
          ...node.data,
          hProperties: {
            ...(node.data?.hProperties || {}),
            target: "_blank",
            rel: "nofollow noopener noreferrer"
          }
        };
      }
    });
  };
}

/**
 * Markdown tables → <Table> JSX
 */
export function remarkTables() {
  return (tree: any) => {
    visit(tree, "table", (node: any) => {
      const header = node.children?.[0];
      if (header) {
        header.children?.forEach((cell: any, index: number) => {
          if (!cell.children?.length) {
            cell.children = [{ type: "text", value: `Column ${index + 1}` }];
          }
        });
      }

      Object.assign(
        node,
        toJsx(
          "mdxJsxFlowElement",
          "Table",
          node.align
            ? node.align.filter(Boolean).map((a: string) => attr("align", a))
            : [],
          node.children
        )
      );
    });
  };
}
