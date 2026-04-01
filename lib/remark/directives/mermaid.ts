import { visit, setHast } from "./utils";

const isProduction = process.env.NODE_ENV === "production";

let mermaidReady: Promise<any> | null = null;

function getMermaid() {
  if (!mermaidReady) {
    mermaidReady = import("isomorphic-mermaid").then((m) => {
      const mermaid = m.default;
      if (globalThis.window && !(globalThis.window as any).location) {
        (globalThis.window as any).location = new URL("http://localhost");
      }
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        htmlLabels: false,
        theme: "neutral",
      });
      return mermaid;
    });
  }
  return mermaidReady;
}

let rendering = Promise.resolve<unknown>(undefined);

function serialize<T>(fn: () => Promise<T>): Promise<T> {
  const p = rendering.then(fn, fn) as Promise<T>;
  rendering = p.then(
    () => {},
    () => {},
  );
  return p;
}

function toClientIsland(node: any, value: string) {
  setHast(node, "div", {
    "data-island": "Mermaid",
    "data-value": value,
    class:
      "glass rounded-2xl p-8 my-4 flex items-center justify-center text-default-400 text-sm",
  });
  node.children = [{ type: "text", value: "Loading diagram..." }];
  node.type = "containerDirective";
  node.name = "__mermaid";
  node.lang = undefined;
  node.value = undefined;
  node.meta = undefined;
}

export const remarkMermaid = () => async (tree: any) => {
  const nodes: { node: any; value: string }[] = [];

  visit(tree, (node: any) => {
    if (node.type === "code" && node.lang === "mermaid") {
      nodes.push({ node, value: node.value });
    }
  });

  if (nodes.length === 0) return;

  if (!isProduction) {
    for (const { node, value } of nodes) toClientIsland(node, value);
    return;
  }

  const mermaid = await getMermaid();

  for (const { node, value } of nodes) {
    try {
      const svg = await serialize(async () => {
        const id = `m-${Math.random().toString(36).slice(2, 9)}`;
        const { svg } = await mermaid.render(id, value);
        return svg;
      });
      Object.assign(node, {
        type: "html",
        value: `<div class="glass rounded-2xl p-4 my-4 overflow-x-auto [&>svg]:mx-auto">${svg}</div>`,
        lang: undefined,
        meta: undefined,
      });
    } catch (e: any) {
      console.warn(
        `\x1b[33m⚠ [mermaid]\x1b[0m SSR failed, client fallback: ${e.message}`,
      );
      toClientIsland(node, value);
    }
  }
};
