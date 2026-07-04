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

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function makeFloating(): HTMLDivElement {
  const el = document.createElement("div");
  el.className = "fixed z-[9999]";
  el.style.cssText = "opacity:0;pointer-events:none;transform:scale(.96) translateY(-4px);transition:opacity 150ms ease,transform 150ms ease";
  document.body.append(el);
  return el;
}

function placeFloating(floating: HTMLElement, anchor: HTMLElement, preferBottom = true) {
  requestAnimationFrame(() => {
    const ar = anchor.getBoundingClientRect();
    const fr = floating.getBoundingClientRect();
    let top: number;
    if (preferBottom) {
      top = ar.bottom + 8;
      if (top + fr.height > window.innerHeight - 8) top = ar.top - fr.height - 8;
    } else {
      top = ar.top - fr.height - 8;
      if (top < 8) top = ar.bottom + 8;
    }
    let left = ar.left + ar.width / 2 - fr.width / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - fr.width - 8));
    floating.style.top = `${top}px`;
    floating.style.left = `${left}px`;
    floating.style.opacity = "1";
    floating.style.transform = "scale(1) translateY(0)";
  });
}

function dismissFloating(el: HTMLDivElement | null) {
  if (!el) return;
  el.style.opacity = "0";
  el.style.pointerEvents = "none";
  el.style.transform = "scale(.96) translateY(-4px)";
}

let tipEl: HTMLDivElement | null = null;

function showTip(anchor: HTMLElement, text: string) {
  if (!tipEl) tipEl = makeFloating();
  tipEl.innerHTML = `<div class="surface-overlay rounded-xl px-3 py-1.5 text-sm leading-relaxed max-w-60">${esc(text)}</div>`;
  placeFloating(tipEl, anchor, false);
}

function hideTip() { dismissFloating(tipEl); }

let popEl: HTMLDivElement | null = null;
let popTeardown: (() => void) | null = null;

function showPop(anchor: HTMLElement, html: string) {
  closePop();
  if (!popEl) popEl = makeFloating();
  popEl.innerHTML = html;
  popEl.style.pointerEvents = "auto";
  placeFloating(popEl, anchor, true);

  const dismiss = (e: MouseEvent) => {
    if (!popEl?.contains(e.target as Node) && !anchor.contains(e.target as Node)) closePop();
  };
  const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closePop(); };
  requestAnimationFrame(() => {
    document.addEventListener("mousedown", dismiss);
    document.addEventListener("keydown", onKey);
  });
  popTeardown = () => {
    document.removeEventListener("mousedown", dismiss);
    document.removeEventListener("keydown", onKey);
  };
}

function closePop() {
  dismissFloating(popEl);
  popTeardown?.();
  popTeardown = null;
}

let prevEl: HTMLDivElement | null = null;
let prevTimer = 0;

function showPrev(anchor: HTMLElement, html: string) {
  clearTimeout(prevTimer);
  if (!prevEl) {
    prevEl = makeFloating();
    prevEl.addEventListener("mouseenter", () => clearTimeout(prevTimer));
    prevEl.addEventListener("mouseleave", () => hidePrev(150));
  }
  prevEl.innerHTML = html;
  prevEl.style.pointerEvents = "auto";
  placeFloating(prevEl, anchor, true);
}

function hidePrev(delay = 0) {
  clearTimeout(prevTimer);
  const run = () => dismissFloating(prevEl);
  if (delay > 0) prevTimer = window.setTimeout(run, delay);
  else run();
}

function hydrateHints(container: HTMLElement) {
  container.querySelectorAll<HTMLElement>('[data-island="Hint"]').forEach((el) => {
    const tip = el.dataset.tip;
    if (!tip) return;
    el.addEventListener("mouseenter", () => showTip(el, tip));
    el.addEventListener("mouseleave", hideTip);
  });
}

const BOOK_ICON = '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>';
const EDIT_ICON = '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/></svg>';

function hydrateTermPreviews(container: HTMLElement) {
  container.querySelectorAll<HTMLElement>('[data-island="TermPreview"]').forEach((el) => {
    const slug = el.dataset.slug || "";
    const title = el.dataset.termTitle || "";
    const definition = el.dataset.definition || "";

    if (!title && !definition) {
      const link = document.createElement("a");
      link.href = `/terms#${slug}`;
      link.className = "inline";
      el.before(link);
      link.append(el);
      return;
    }

    el.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      showPop(el, `
        <div class="w-80 surface-overlay rounded-2xl overflow-hidden">
          <div class="px-5 pt-5 pb-4">
            <h4 class="text-[15px] font-bold tracking-tight text-zinc-900 dark:text-zinc-50">${esc(title || slug)}</h4>
            <p class="text-[10px] font-medium tracking-widest uppercase text-zinc-400 dark:text-zinc-500 mt-0.5">${esc(slug)}</p>
            ${definition ? `<p class="mt-3 text-[13px] leading-[1.6] text-zinc-600 dark:text-zinc-300">${esc(definition)}</p>` : ""}
          </div>
          <div class="flex items-center border-t border-zinc-200/60 dark:border-zinc-700/60">
            <a href="/terms#${encodeURIComponent(slug)}" class="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-[12px] font-medium text-emerald-600 dark:text-emerald-400 hover:bg-zinc-100/60 dark:hover:bg-zinc-700/40 transition-colors">${BOOK_ICON}在词典中查看</a>
            <span class="w-px h-5 bg-zinc-200/60 dark:bg-zinc-700/60"></span>
            <a href="https://github.com/heliannuuthus/heliannuuthus.github.io/edit/main/terminologies" target="_blank" rel="noopener noreferrer" class="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-[12px] font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100/60 dark:hover:bg-zinc-700/40 transition-colors">${EDIT_ICON}编辑词条</a>
          </div>
        </div>
      `);
    });
  });
}

const EXT_ICON = '<svg aria-hidden="true" class="inline-block w-[1em] h-[1em] ml-0.5 -mt-0.5 align-middle opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';
const GLOBE_SM = '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
const GLOBE_LG = GLOBE_SM.replace("w-4 h-4", "w-10 h-10");

function hydrateExternalLinks(container: HTMLElement) {
  container.querySelectorAll<HTMLAnchorElement>('[data-island="ExternalLink"]').forEach((el) => {
    el.insertAdjacentHTML("beforeend", EXT_ICON);

    const href = el.dataset.href || "";
    if (!href) return;

    el.href = `/go?target=${encodeURIComponent(href)}`;

    let domain: string;
    try { domain = new URL(href).hostname; } catch { return; }
    const displayUrl = href.length > 60 ? href.slice(0, 57) + "\u2026" : href;
    const favicon = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;
    const thumb = `https://image.thum.io/get/width/512/crop/288/${encodeURI(href)}`;

    el.addEventListener("mouseenter", () => {
      showPrev(el, `
        <div class="w-72 surface-overlay rounded-2xl overflow-hidden">
          <div class="relative h-36 bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div class="ext-ph absolute inset-0 animate-pulse bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800"></div>
            <img src="${esc(thumb)}" alt="" class="ext-img w-full h-full object-cover object-top transition-opacity duration-300 opacity-0" loading="lazy" />
          </div>
          <div class="px-4 py-3 flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <img src="${esc(favicon)}" alt="" width="16" height="16" class="ext-fav rounded-sm shrink-0" />
              <span class="text-[13px] font-semibold text-zinc-800 dark:text-zinc-100 truncate">${esc(domain)}</span>
            </div>
            <p class="text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-500 break-all" title="${esc(href)}">${esc(displayUrl)}</p>
          </div>
        </div>
      `);

      if (!prevEl) return;
      const img = prevEl.querySelector<HTMLImageElement>(".ext-img");
      const ph = prevEl.querySelector<HTMLElement>(".ext-ph");
      if (img) {
        img.onload = () => { img.style.opacity = "1"; ph?.remove(); };
        img.onerror = () => {
          img.remove();
          if (ph) {
            ph.classList.remove("animate-pulse");
            ph.innerHTML = `<div class="flex items-center justify-center h-full text-zinc-300 dark:text-zinc-600">${GLOBE_LG}</div>`;
          }
        };
      }
      const fav = prevEl.querySelector<HTMLImageElement>(".ext-fav");
      if (fav) {
        fav.onerror = () => { fav.outerHTML = `<span class="shrink-0 text-zinc-400">${GLOBE_SM}</span>`; };
      }
    });

    el.addEventListener("mouseleave", () => hidePrev(150));
  });
}

function hydrateIslands(container: HTMLElement) {
  container.querySelectorAll<HTMLElement>('[data-island="Tabs"]').forEach(hydrateTabs);
  container.querySelectorAll<HTMLElement>('[data-island="Steps"]').forEach(hydrateSteps);
  container.querySelectorAll<HTMLElement>('[data-island="Mermaid"]').forEach(hydrateMermaid);
  container.querySelectorAll<HTMLElement>('[data-island="Markmap"]').forEach(hydrateMarkmap);
  hydrateHints(container);
  hydrateTermPreviews(container);
  hydrateExternalLinks(container);
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
