import * as d3 from "d3";
import { INode } from "markmap-common";
import { ITransformResult } from "markmap-lib";
import { IMarkmapOptions, Markmap as MarkmapClass } from "markmap-view";
import * as markmap from "markmap-view";
import { createContext } from "react";

import { getPathData } from "@site/src/utils";

export class Markmap extends MarkmapClass {
  constructor(svg: SVGSVGElement, options: Partial<IMarkmapOptions>) {
    super(svg, options);
  }

  static create(svg: SVGSVGElement, options: Partial<IMarkmapOptions>) {
    return new Markmap(svg, options);
  }

  async toggleNode(data: INode, recursive?: boolean): Promise<void> {
    await super.toggleNode(data, recursive).then(() => {
      customizeStyle(this.svg);
    });
  }
  async fit(maxScale?: number): Promise<void> {
    await super.fit(maxScale).then(() => {
      customizeStyle(this.svg);
    });
  }
}

export type MarkmapContextType = {
  transformed: ITransformResult | null;
};

export const MarkmapContext = createContext<MarkmapContextType>({
  transformed: null
});

const customizeStyle = (
  svg: d3.Selection<SVGElement, INode, HTMLElement, INode>
) => {
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
  svg.selectAll(".markmap-node").each(function () {
    const g = this as SVGGElement;
    const dataPath = g.getAttribute("data-path");
    const foreignObject = g.querySelector("foreignObject");
    if (foreignObject && dataPath) {
      const cy = Number(foreignObject.getAttribute("height")) / 2;
      styleContent += `
    .markmap-node[data-path="${dataPath}"] circle {
      cy: ${cy};
    }
    `;
    }
  });

  let style = svg.select("style.heliannuuthus-markmap-style");
  if (!style || style.empty()) {
    const svgNode = svg.node();
    if (svgNode) {
      const style = document.createElement("style");
      style.setAttribute("class", "heliannuuthus-markmap-style");
      style.textContent = styleContent;
      svgNode.insertBefore(style, svgNode.firstChild);
    }
  } else {
    style.text(styleContent);
  }
};

const updateStyledD = (path: SVGPathElement) => {
  const dataPath = path.getAttribute("data-path");
  if (!dataPath) return;
  const parentPath = dataPath.split(".").slice(0, -1).join(".");
  const parent = d3.select(`[data-path="${parentPath}"] circle`);
  const current = d3.select(`[data-path="${dataPath}"] foreignObject`);
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
    currentCy = Number(current.attr("height")) / 2;
  }
  const parsed = getPathData(path);

  if (
    parsed &&
    parsed.length >= 2 &&
    parsed[0].type === "M" &&
    parsed[1].type === "C"
  ) {
    parsed[0].params[1] -= parentCy;
    parsed[1].params[5] -= currentCy;

    const offset = currentCy - parentCy;
    const c1 = 1 / 3;
    const c2 = 2 / 3;

    parsed[1].params[1] -= parentCy + offset * c1;
    parsed[1].params[3] -= parentCy + offset * c2;

    const result = parsed
      .map((seg) => seg.type + seg.params.join(","))
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
