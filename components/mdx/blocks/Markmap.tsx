"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  LocateFixed,
  Copy,
  Download,
  Code,
  Eye,
  X,
} from "lucide-react";

interface MarkmapProps {
  markdown?: string;
}

type ViewTab = "map" | "code";

interface PathCmd {
  type: string;
  params: number[];
}

function parsePathD(d: string): PathCmd[] {
  const cmds: PathCmd[] = [];
  const norm = d.trim().replace(/,/g, " ").replace(/\s+/g, " ");
  const tokens: string[] = [];
  let num = "";

  for (const ch of norm) {
    if (/^[MmLlHhVvCcSsQqTtAaZz]$/.test(ch)) {
      if (num) { tokens.push(num); num = ""; }
      tokens.push(ch);
    } else if (/[\d.\-]/.test(ch)) {
      num += ch;
    } else if (ch === " " && num) {
      tokens.push(num); num = "";
    }
  }
  if (num) tokens.push(num);

  for (const tok of tokens) {
    if (/^[MmLlHhVvCcSsQqTtAaZz]$/.test(tok)) {
      cmds.push({ type: tok, params: [] });
    } else if (cmds.length > 0) {
      const n = parseFloat(tok);
      if (!isNaN(n)) cmds[cmds.length - 1].params.push(n);
    }
  }
  return cmds;
}

function adjustPath(svgEl: SVGSVGElement, pathEl: SVGPathElement) {
  const dataPath = pathEl.getAttribute("data-path");
  if (!dataPath) return;

  const parentDataPath = dataPath.split(".").slice(0, -1).join(".");
  const parentFO = svgEl.querySelector(
    `.markmap-node[data-path="${parentDataPath}"] foreignObject`
  );
  const currentFO = svgEl.querySelector(
    `.markmap-node[data-path="${dataPath}"] foreignObject`
  );

  const parentCy = parentFO
    ? Number(parentFO.getAttribute("height")) / 2
    : 0;
  const currentCy = currentFO
    ? Number(currentFO.getAttribute("height")) / 2
    : parentCy;

  const d = pathEl.getAttribute("d");
  if (!d) return;

  const parsed = parsePathD(d);
  if (
    parsed.length >= 2 &&
    parsed[0].type === "M" &&
    parsed[1].type === "C"
  ) {
    parsed[0].params[1] -= parentCy;
    parsed[1].params[5] -= currentCy;

    const delta = currentCy - parentCy;
    parsed[1].params[1] -= parentCy + delta / 3;
    parsed[1].params[3] -= parentCy + (delta * 2) / 3;

    const result = parsed
      .map((c) => c.type + c.params.join(","))
      .join("");
    pathEl.style.setProperty("d", `path("${result}")`);
  }
}

function customizeMarkmap(svgEl: SVGSVGElement) {
  let styleEl = svgEl.querySelector("style.markmap-center");
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.setAttribute("class", "markmap-center");
    svgEl.insertBefore(styleEl, svgEl.firstChild);
  }
  styleEl.textContent = ".markmap-node line { display: none; }";

  svgEl.querySelectorAll(".markmap-node").forEach((node) => {
    const fo = node.querySelector("foreignObject");
    const circle = node.querySelector("circle");
    if (fo && circle) {
      const cy = Number(fo.getAttribute("height")) / 2;
      (circle as SVGCircleElement).style.setProperty("cy", `${cy}px`);
    }
  });

  svgEl.querySelectorAll<SVGPathElement>("path[data-path]").forEach((p) => {
    adjustPath(svgEl, p);
  });
}

function observeMarkmap(
  svgEl: SVGSVGElement,
  g: Element
): { disconnect: () => void } {
  const observer = new MutationObserver((mutations) => {
    let needsFullCustomize = false;

    for (const m of mutations) {
      if (m.type === "childList") {
        needsFullCustomize = true;
        break;
      }
      if (
        m.type === "attributes" &&
        m.attributeName === "height" &&
        m.target instanceof SVGForeignObjectElement
      ) {
        needsFullCustomize = true;
        break;
      }
    }

    if (needsFullCustomize) {
      customizeMarkmap(svgEl);
      return;
    }

    for (const m of mutations) {
      if (
        m.type === "attributes" &&
        m.attributeName === "d" &&
        m.target instanceof SVGPathElement
      ) {
        adjustPath(svgEl, m.target);
      }
    }
  });

  observer.observe(g, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["d", "height"],
  });

  return { disconnect: () => observer.disconnect() };
}

function ToolbarButton({
  onClick,
  title,
  children,
  active,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
        active
          ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
          : "text-default-500 hover:text-default-700 dark:hover:text-default-300 hover:bg-default-100 dark:hover:bg-default-100/10"
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({
  tab,
  onTabChange,
  onZoomIn,
  onZoomOut,
  onFit,
  onCopy,
  onDownload,
  onFullscreen,
  isFullscreen,
}: {
  tab: ViewTab;
  onTabChange: (t: ViewTab) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onFullscreen: () => void;
  isFullscreen: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-3 py-1.5 border-b border-default-200 dark:border-default-100/10 bg-default-50/50 dark:bg-default-100/5 rounded-t-2xl">
      <div className="flex items-center gap-0.5">
        <ToolbarButton
          onClick={() => onTabChange("map")}
          title="思维导图"
          active={tab === "map"}
        >
          <Eye size={15} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => onTabChange("code")}
          title="源码"
          active={tab === "code"}
        >
          <Code size={15} />
        </ToolbarButton>
      </div>

      <div className="flex items-center gap-0.5">
        {tab === "map" && (
          <>
            <ToolbarButton onClick={onZoomIn} title="放大">
              <ZoomIn size={15} />
            </ToolbarButton>
            <ToolbarButton onClick={onZoomOut} title="缩小">
              <ZoomOut size={15} />
            </ToolbarButton>
            <ToolbarButton onClick={onFit} title="适应">
              <LocateFixed size={15} />
            </ToolbarButton>
            <div className="w-px h-4 bg-default-200 dark:bg-default-100/10 mx-1" />
            <ToolbarButton onClick={onDownload} title="下载图片">
              <Download size={15} />
            </ToolbarButton>
          </>
        )}
        <ToolbarButton onClick={onCopy} title={tab === "map" ? "复制图片" : "复制源码"}>
          <Copy size={15} />
        </ToolbarButton>
        <div className="w-px h-4 bg-default-200 dark:bg-default-100/10 mx-1" />
        <ToolbarButton onClick={onFullscreen} title={isFullscreen ? "退出全屏" : "全屏"}>
          {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </ToolbarButton>
      </div>
    </div>
  );
}

function MarkmapSvg({
  markdown,
  svgRef,
  markmapRef,
  className,
  style,
}: {
  markdown: string;
  svgRef: React.RefObject<SVGSVGElement | null>;
  markmapRef: React.MutableRefObject<any>;
  className?: string;
  style?: React.CSSProperties;
}) {
  useEffect(() => {
    if (!svgRef.current || !markdown) return;

    let destroyed = false;
    let obs: { disconnect: () => void } | null = null;

    (async () => {
      const [{ Transformer }, { Markmap: MarkmapView, deriveOptions }, d3sc] =
        await Promise.all([
          import("markmap-lib"),
          import("markmap-view"),
          import("d3-scale-chromatic"),
        ]);

      if (destroyed || !svgRef.current) return;

      const transformer = new Transformer();
      const { root } = transformer.transform(markdown);

      if (markmapRef.current) {
        markmapRef.current.setData(root);
        markmapRef.current.fit();
      } else {
        const palette = [
          ...d3sc.schemeTableau10,
          ...d3sc.schemePaired,
          ...d3sc.schemeSet1,
          ...d3sc.schemeDark2,
          ...d3sc.schemeAccent,
        ];
        const options: Parameters<typeof MarkmapView.create>[1] = {
          ...deriveOptions({}),
          color: (node: { state?: { path?: string } }) => {
            const parentPath = (node.state?.path ?? "0")
              .split(".")
              .slice(0, -1)
              .join(".");
            let h = 5381;
            for (let i = 0; i < parentPath.length; i++)
              h = ((h << 5) + h + parentPath.charCodeAt(i)) | 0;
            return palette[Math.abs(h) % palette.length];
          },
        };
        markmapRef.current = MarkmapView.create(svgRef.current, options, root);
      }

      const svgEl = svgRef.current;
      customizeMarkmap(svgEl);

      const g = svgEl.querySelector("g");
      if (g) {
        obs = observeMarkmap(svgEl, g);
      }
    })();

    return () => {
      destroyed = true;
      obs?.disconnect();
    };
  }, [markdown, svgRef, markmapRef]);

  return <svg ref={svgRef} className={className} style={style} />;
}

function FullscreenOverlay({
  markdown,
  onClose,
}: {
  markdown: string;
  onClose: () => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const markmapRef = useRef<any>(null);

  const zoomDelta = useCallback((delta: number) => {
    markmapRef.current?.rescale(delta);
  }, []);

  const fit = useCallback(() => {
    markmapRef.current?.fit();
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(markdown);
    } catch { /* noop */ }
  }, [markdown]);

  const handleDownload = useCallback(async () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "markmap.svg";
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const [tab, setTab] = useState<ViewTab>("map");

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col">
      <Toolbar
        tab={tab}
        onTabChange={setTab}
        onZoomIn={() => zoomDelta(1.25)}
        onZoomOut={() => zoomDelta(0.8)}
        onFit={fit}
        onCopy={handleCopy}
        onDownload={handleDownload}
        onFullscreen={onClose}
        isFullscreen
      />
      <div className="flex-1 relative bg-white dark:bg-neutral-900">
        {tab === "map" ? (
          <MarkmapSvg
            markdown={markdown}
            svgRef={svgRef}
            markmapRef={markmapRef}
            className="w-full h-full"
          />
        ) : (
          <pre className="p-6 text-sm overflow-auto h-full whitespace-pre-wrap text-default-700 dark:text-default-300 font-mono">
            {markdown}
          </pre>
        )}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-default-100 dark:bg-default-100/10 text-default-600 hover:text-default-900 dark:hover:text-default-200 transition-colors cursor-pointer"
          title="关闭"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

export default function Markmap({ markdown }: MarkmapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const markmapRef = useRef<any>(null);
  const [tab, setTab] = useState<ViewTab>("map");
  const [fullscreen, setFullscreen] = useState(false);

  const zoomDelta = useCallback((delta: number) => {
    markmapRef.current?.rescale(delta);
  }, []);

  const fit = useCallback(() => {
    markmapRef.current?.fit();
  }, []);

  const handleCopy = useCallback(async () => {
    if (!markdown) return;
    if (tab === "code") {
      await navigator.clipboard.writeText(markdown);
      return;
    }
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    await navigator.clipboard.write([
      new ClipboardItem({ "image/svg+xml": blob }),
    ]);
  }, [markdown, tab]);

  const handleDownload = useCallback(() => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "markmap.svg";
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  if (!markdown) return null;

  return (
    <>
      <div className="glass rounded-2xl my-4 overflow-hidden">
        <Toolbar
          tab={tab}
          onTabChange={setTab}
          onZoomIn={() => zoomDelta(1.25)}
          onZoomOut={() => zoomDelta(0.8)}
          onFit={fit}
          onCopy={handleCopy}
          onDownload={handleDownload}
          onFullscreen={() => setFullscreen(true)}
          isFullscreen={false}
        />
        <div className="relative">
          {tab === "map" ? (
            <MarkmapSvg
              markdown={markdown}
              svgRef={svgRef}
              markmapRef={markmapRef}
              style={{ minHeight: 340, maxHeight: 340, width: "100%" }}
            />
          ) : (
            <pre className="p-4 text-sm overflow-auto whitespace-pre-wrap leading-relaxed text-default-600 dark:text-default-300 font-mono" style={{ minHeight: 340, maxHeight: 340 }}>
              {markdown}
            </pre>
          )}
        </div>
      </div>

      {fullscreen && (
        <FullscreenOverlay
          markdown={markdown}
          onClose={() => setFullscreen(false)}
        />
      )}
    </>
  );
}
