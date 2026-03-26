import GithubSlugger from "github-slugger";

export interface TocItem {
  depth: number; // 2-6
  text: string;
  id: string;
  children: TocItem[];
}

export function extractToc(markdown: string): TocItem[] {
  const slugger = new GithubSlugger();
  const headingRegex = /^(#{2,6})\s+(.+)$/gm;
  const flat: { depth: number; text: string; id: string }[] = [];

  let match;
  while ((match = headingRegex.exec(markdown)) !== null) {
    const depth = match[1].length;
    const raw = match[2]
      .replace(/\[([^\]]*?)]\([^)]*\)/g, "$1")
      .replace(/:(?:term|ctip)\[([^\]]*?)]\{[^}]*\}/g, "$1")
      .replace(/`([^`]*)`/g, "$1")
      .replace(/[*_~]/g, "")
      .trim();

    flat.push({ depth, text: raw, id: slugger.slug(raw) });
  }

  return buildTree(flat);
}

function buildTree(
  items: { depth: number; text: string; id: string }[]
): TocItem[] {
  const root: TocItem[] = [];
  const stack: TocItem[] = [];

  for (const item of items) {
    const node: TocItem = { ...item, children: [] };

    while (stack.length > 0 && stack[stack.length - 1].depth >= item.depth) {
      stack.pop();
    }

    if (stack.length === 0) {
      root.push(node);
    } else {
      stack[stack.length - 1].children.push(node);
    }

    stack.push(node);
  }

  return root;
}
