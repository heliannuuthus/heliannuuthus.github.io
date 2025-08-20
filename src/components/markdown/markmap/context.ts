import * as d3 from "d3";
import { INode } from "markmap-common";
import { ITransformResult } from "markmap-lib";
import { IMarkmapOptions, Markmap as MarkmapClass } from "markmap-view";
import * as markmap from "markmap-view";
import { RefObject, createContext, useContext } from "react";

export class Markmap extends MarkmapClass {
  constructor(svg: SVGSVGElement, options: Partial<IMarkmapOptions>) {
    super(svg, options);
  }

  static create(svg: SVGSVGElement, options: Partial<IMarkmapOptions>) {
    return new Markmap(svg, options);
  }

  async toggleNode(data: INode, recursive?: boolean): Promise<void> {
    await super.toggleNode(data, recursive).then(() => {
      buildStyle(this.svg.node());
    });
  }
  async fit(maxScale?: number): Promise<void> {
    await super.fit(maxScale).then(() => {
      buildStyle(this.svg.node());
    });
  }
}

export type MarkmapContextType = {
  transformed: ITransformResult | null;
};

export const MarkmapContext = createContext<MarkmapContextType>({
  transformed: null
});

export const useMarkmap = () => {
  const transformed = useContext(MarkmapContext);
  if (!transformed) {
    throw new Error("Markmap not found");
  }
  return transformed;
};

export const buildStyle = (svg: SVGElement) => {
  let styleContent = `
    .markmap-node line {
      display: none;
    }
    .markmap-node[data-depth='2'] circle {
      r: 5;
    }
    .markmap-node[data-depth='1'] circle {
      r: 6;
    }
    .markmap-node circle {
      r: 4;
    }
  `;
  svg.querySelectorAll(".markmap-node").forEach((g: SVGGElement) => {
    const dataPath = g.getAttribute("data-path");
    const circle = g.querySelector("circle");
    if (circle && dataPath) {
      const cy = Number(circle.getAttribute("cy")) / 2;
      styleContent += `
    .markmap-node[data-path="${dataPath}"] circle {
      cy: ${cy};
    }
    `;
    }
  });

  let style = svg.querySelector("style.heliannuuthus-markmap-style");
  if (!style) {
    style = document.createElement("style");
    style.setAttribute("class", "heliannuuthus-markmap-style");
    style.textContent = styleContent;
    svg.appendChild(style);
  } else {
    style.textContent = styleContent;
  }
};

export const updateStyledD = (path: SVGPathElement) => {
  const dataPath = path.getAttribute("data-path");
  if (!dataPath) return;
  const parentPath = dataPath.split(".").slice(0, -1).join(".");
  const parent = d3.select(`[data-path="${parentPath}"] circle`);
  const current = d3.select(`[data-path="${dataPath}"] circle`);
  let parentCy = 0;
  let currentCy = 0;
  if (parent.empty()) {
    parentCy = 0;
  } else {
    parentCy = Number(parent.attr("cy")) / 2;
  }
  if (current.empty()) {
    currentCy = parentCy;
  } else {
    currentCy = Number(current.attr("cy")) / 2;
  }
  const parsed = path.getPathData();

  if (
    parsed &&
    parsed.length >= 2 &&
    parsed[0].type === "M" &&
    parsed[1].type === "C"
  ) {
    parsed[0].values[1] -= parentCy;
    parsed[1].values[5] -= currentCy;

    const offset = currentCy - parentCy;
    const c1 = 1 / 3;
    const c2 = 2 / 3;

    parsed[1].values[1] -= parentCy + offset * c1;
    parsed[1].values[3] -= parentCy + offset * c2;

    const result = parsed
      .map((seg) => seg.type + seg.values.join(","))
      .join("");
    path.setAttribute("style", `d: path("${result}")`);
  }
};

export const createGObserver = (
  g: d3.Selection<SVGGElement, unknown, HTMLElement, any>
) => {
  return new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target != null && mutation.target instanceof SVGGElement) {
        if (mutation.type === "childList") {
          reinitializePathObserver(g);
        }
      }
    });
  });
};

export const reinitializePathObserver = (
  g: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  pathObserverRef?: MutationObserver
) => {
  if (pathObserverRef) {
    pathObserverRef.disconnect();
  }

  // 创建新的path监听器
  const pathObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.attributeName === "d" &&
        mutation.target instanceof SVGPathElement
      ) {
        updateStyledD(mutation.target);
      }
    });
  });

  // 获取当前所有path元素
  g.selectAll("path").each(function () {
    const path = this as SVGPathElement;
    pathObserver.observe(path, { attributes: true, attributeFilter: ["d"] });
  });

  return pathObserver;
};

const defaultOptions: Partial<IMarkmapOptions> = {
  ...markmap.defaultOptions,
  autoFit: true
};

export const createMarkmap = (
  svg: SVGSVGElement,
  options: Partial<IMarkmapOptions>
) => {
  return Markmap.create(svg, {
    ...defaultOptions,
    ...options
  });
};
