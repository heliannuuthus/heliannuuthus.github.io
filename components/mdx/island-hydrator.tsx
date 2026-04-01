"use client";

import { useEffect, useRef } from "react";

const ACTIVE_TAB = "px-4 py-2 text-sm font-medium border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400";
const IDLE_TAB = "px-4 py-2 text-sm font-medium text-default-500 hover:text-default-700 dark:hover:text-default-300 border-b-2 border-transparent";

function hydrateTabs(el: HTMLElement) {
  const panels = [...el.querySelectorAll<HTMLElement>(":scope > [data-tab]")];
  if (!panels.length) return;

  const header = document.createElement("div");
  header.className = "flex border-b border-default-200/50 bg-default-50/50 dark:bg-default-100/5";

  panels.forEach(({ dataset }, i) => {
    const btn = Object.assign(document.createElement("button"), {
      textContent: dataset.tab || "Tab",
      className: i === 0 ? ACTIVE_TAB : IDLE_TAB,
    });
    btn.addEventListener("click", () => {
      panels.forEach((p, j) => { p.style.display = j === i ? "block" : "none"; });
      [...header.children].forEach((b, j) => { (b as HTMLElement).className = j === i ? ACTIVE_TAB : IDLE_TAB; });
    });
    header.append(btn);
  });

  el.prepend(header);
  el.className = "glass rounded-2xl my-4 overflow-hidden";
  panels.forEach((p, i) => {
    p.style.display = i === 0 ? "block" : "none";
    p.className = "p-4 text-sm leading-relaxed [&>p:first-child]:mt-0 [&>p:last-child]:mb-0";
  });
}

const CHECK_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

function hydrateSteps(el: HTMLElement) {
  const steps = [...el.querySelectorAll<HTMLElement>(":scope > [data-step]")];
  if (!steps.length) return;

  let current = 0;
  el.className = "my-4 flex flex-col";

  const render = () => {
    steps.forEach((step, i) => {
      const isActive = i === current;
      const isDone = i < current;

      let wrapper = step.querySelector<HTMLElement>(".step-wrapper");
      if (!wrapper) {
        wrapper = Object.assign(document.createElement("div"), {
          className: "step-wrapper flex gap-3 cursor-pointer group",
        });

        const indicator = Object.assign(document.createElement("div"), {
          className: "step-indicator flex flex-col items-center pt-0.5",
          innerHTML: `<div class="step-dot w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors"></div>${i < steps.length - 1 ? '<div class="step-line w-px flex-1 min-h-[24px] my-1"></div>' : ""}`,
        });

        const titleEl = Object.assign(document.createElement("div"), {
          className: "step-title text-[14px] font-medium leading-snug transition-colors",
          textContent: step.dataset.step || `Step ${i + 1}`,
        });

        const bodyEl = Object.assign(document.createElement("div"), {
          className: "step-body mt-2 text-[13px] leading-relaxed text-default-600 dark:text-default-400",
        });
        while (step.firstChild) bodyEl.append(step.firstChild);

        const content = Object.assign(document.createElement("div"), { className: "pb-4 min-w-0" });
        content.append(titleEl, bodyEl);
        wrapper.append(indicator, content);
        step.append(wrapper);

        wrapper.addEventListener("click", () => { current = i; render(); });
      }

      const dot = wrapper.querySelector<HTMLElement>(".step-dot")!;
      const line = wrapper.querySelector<HTMLElement>(".step-line");
      const body = wrapper.querySelector<HTMLElement>(".step-body")!;
      const title = wrapper.querySelector<HTMLElement>(".step-title")!;

      dot.className = `step-dot w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors ${
        isActive ? "bg-emerald-500 text-white"
        : isDone ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
        : "bg-default-200 dark:bg-default-100/10 text-default-400"
      }`;
      dot.innerHTML = isDone ? CHECK_SVG : String(i + 1);

      if (line) {
        line.className = `step-line w-px flex-1 min-h-[24px] my-1 ${isDone ? "bg-emerald-300 dark:bg-emerald-700" : "bg-default-200 dark:bg-default-100/10"}`;
      }
      title.className = `step-title text-[14px] font-medium leading-snug transition-colors ${
        isActive ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-500 dark:text-zinc-400"
      }`;
      body.style.display = isActive ? "block" : "none";
    });
  };

  render();
}

async function hydrateMermaid(el: HTMLElement) {
  const { value } = el.dataset;
  if (!value) return;

  try {
    const { default: mermaid } = await import("mermaid");
    mermaid.initialize({ startOnLoad: false, theme: "neutral", securityLevel: "loose" });
    const { svg } = await mermaid.render(`mermaid-${crypto.randomUUID().slice(0, 8)}`, value);
    el.className = "glass rounded-2xl p-4 my-4 overflow-x-auto [&>svg]:mx-auto";
    el.innerHTML = svg;
  } catch (e) {
    el.className = "glass rounded-2xl p-4 my-4 text-sm text-red-500";
    el.innerHTML = `<p class="font-medium mb-1">Mermaid Error</p><pre class="text-xs overflow-auto">${e instanceof Error ? e.message : "Failed to render"}</pre>`;
  }
}

interface PathCmd { type: string; params: number[] }

const PATH_TOKEN_RE = /[MmLlHhVvCcSsQqTtAaZz]|-?[\d.]+/g;

function parsePathD(d: string): PathCmd[] {
  const cmds: PathCmd[] = [];
  for (const [tok] of d.matchAll(PATH_TOKEN_RE)) {
    if (/^[A-Za-z]$/.test(tok)) {
      cmds.push({ type: tok, params: [] });
    } else {
      const n = Number(tok);
      if (cmds.length && !Number.isNaN(n)) cmds.at(-1)!.params.push(n);
    }
  }
  return cmds;
}

function adjustPath(svgEl: SVGSVGElement, pathEl: SVGPathElement) {
  const dataPath = pathEl.getAttribute("data-path");
  if (!dataPath) return;

  const parentPath = dataPath.split(".").slice(0, -1).join(".");
  const foHeight = (sel: string) => {
    const fo = svgEl.querySelector(`.markmap-node[data-path="${sel}"] foreignObject`);
    return fo ? Number(fo.getAttribute("height")) / 2 : 0;
  };
  const parentCy = foHeight(parentPath);
  const currentCy = foHeight(dataPath) || parentCy;

  const d = pathEl.getAttribute("d");
  if (!d) return;

  const parsed = parsePathD(d);
  if (parsed.length >= 2 && parsed[0].type === "M" && parsed[1].type === "C") {
    const [m, c] = parsed;
    const delta = currentCy - parentCy;
    m.params[1] -= parentCy;
    c.params[5] -= currentCy;
    c.params[1] -= parentCy + delta / 3;
    c.params[3] -= parentCy + (delta * 2) / 3;
    pathEl.style.setProperty("d", `path("${parsed.map(({ type, params }) => type + params).join("")}")`);
  }
}

function customizeMarkmap(svgEl: SVGSVGElement) {
  let styleEl = svgEl.querySelector("style.markmap-center");
  if (!styleEl) {
    styleEl = Object.assign(document.createElement("style"), { className: "markmap-center" });
    svgEl.prepend(styleEl);
  }
  styleEl.textContent = ".markmap-node line { display: none; }";

  for (const node of svgEl.querySelectorAll(".markmap-node")) {
    const fo = node.querySelector("foreignObject");
    const circle = node.querySelector("circle");
    if (fo && circle) {
      (circle as SVGCircleElement).style.setProperty("cy", `${Number(fo.getAttribute("height")) / 2}px`);
    }
  }
  svgEl.querySelectorAll<SVGPathElement>("path[data-path]").forEach((p) => adjustPath(svgEl, p));
}

function observeMarkmap(svgEl: SVGSVGElement, g: Element) {
  const observer = new MutationObserver((mutations) => {
    const needsFull = mutations.some(
      (m) => m.type === "childList" || (m.type === "attributes" && m.attributeName === "height" && m.target instanceof SVGForeignObjectElement),
    );
    if (needsFull) { customizeMarkmap(svgEl); return; }
    for (const m of mutations) {
      if (m.type === "attributes" && m.attributeName === "d" && m.target instanceof SVGPathElement) {
        adjustPath(svgEl, m.target);
      }
    }
  });
  observer.observe(g, { childList: true, subtree: true, attributes: true, attributeFilter: ["d", "height"] });
  return observer;
}

function djb2(s: string): number {
  let h = 5381;
  for (const ch of s) h = ((h << 5) + h + ch.charCodeAt(0)) | 0;
  return h;
}

async function hydrateMarkmap(el: HTMLElement) {
  const { value } = el.dataset;
  if (!value) return;

  try {
    const [{ Transformer }, { Markmap: MarkmapView, deriveOptions }, d3sc] = await Promise.all([
      import("markmap-lib"),
      import("markmap-view"),
      import("d3-scale-chromatic"),
    ]);

    el.replaceChildren();
    el.className = "glass rounded-2xl my-4 overflow-hidden";

    const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    Object.assign(svgEl.style, { minHeight: "340px", maxHeight: "340px", width: "100%" });
    el.append(svgEl);

    const { root } = new Transformer().transform(value);
    const palette = [
      ...d3sc.schemeTableau10, ...d3sc.schemePaired,
      ...d3sc.schemeSet1, ...d3sc.schemeDark2, ...d3sc.schemeAccent,
    ];

    MarkmapView.create(
      svgEl,
      {
        ...deriveOptions({}),
        color: (node: { state?: { path?: string } }) => {
          const pp = (node.state?.path ?? "0").split(".").slice(0, -1).join(".");
          return palette[Math.abs(djb2(pp)) % palette.length];
        },
      },
      root,
    );

    customizeMarkmap(svgEl);
    const g = svgEl.querySelector("g");
    if (g) observeMarkmap(svgEl, g);
  } catch (e) {
    el.className = "glass rounded-2xl p-4 my-4 text-sm text-red-500";
    el.textContent = `Markmap Error: ${e instanceof Error ? e.message : "Failed to render"}`;
  }
}

const COPY_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
const COPIED_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><polyline points="20 6 9 17 4 12"/></svg>';

function hydrateCodeBlocks(container: HTMLElement) {
  for (const pre of container.querySelectorAll<HTMLElement>("pre")) {
    if (pre.querySelector(".code-copy-btn")) continue;

    const wrapper = Object.assign(document.createElement("div"), {
      className: "group/code relative my-4 code-block rounded-2xl overflow-hidden",
    });

    const { language } = pre.dataset;
    if (language) {
      wrapper.append(Object.assign(document.createElement("span"), {
        className: "absolute top-2.5 left-4 text-[11px] font-mono text-default-300 dark:text-default-400 select-none pointer-events-none",
        textContent: language,
      }));
    }

    const btn = Object.assign(document.createElement("button"), {
      className: "code-copy-btn min-w-7 h-7 rounded-lg flex items-center justify-center backdrop-blur-md bg-white/60 dark:bg-white/10 text-default-500 hover:text-default-700 transition-colors",
      innerHTML: COPY_ICON,
    });
    btn.addEventListener("click", () => {
      navigator.clipboard.writeText(pre.textContent ?? "").then(() => {
        btn.innerHTML = COPIED_ICON;
        setTimeout(() => { btn.innerHTML = COPY_ICON; }, 2000);
      });
    });

    const btnWrap = Object.assign(document.createElement("div"), {
      className: "absolute top-2 right-2 opacity-0 group-hover/code:opacity-100 transition-opacity z-10",
    });
    btnWrap.append(btn);
    wrapper.append(btnWrap);

    pre.classList.add("p-4", "pt-9", "leading-6", "overflow-x-auto");
    pre.parentNode!.insertBefore(wrapper, pre);
    wrapper.append(pre);
  }
}

function hydrateIslands(container: HTMLElement) {
  container.querySelectorAll<HTMLElement>('[data-island="Tabs"]').forEach(hydrateTabs);
  container.querySelectorAll<HTMLElement>('[data-island="Steps"]').forEach(hydrateSteps);
  container.querySelectorAll<HTMLElement>('[data-island="Mermaid"]').forEach(hydrateMermaid);
  container.querySelectorAll<HTMLElement>('[data-island="Markmap"]').forEach(hydrateMarkmap);
  hydrateCodeBlocks(container);
}

export default function IslandHydrator({ targetRef }: { targetRef: React.RefObject<HTMLElement | null> }) {
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current || !targetRef.current) return;
    hydrated.current = true;
    hydrateIslands(targetRef.current);
  }, [targetRef]);

  return null;
}
