"use client";

import { useEffect, useRef, useState } from "react";

interface MermaidProps {
  value?: string;
}

export default function Mermaid({ value }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!value) return;

    let cancelled = false;

    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "neutral",
          securityLevel: "loose"
        });
        const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
        const { svg: rendered } = await mermaid.render(id, value);
        if (!cancelled) setSvg(rendered);
      } catch (e: any) {
        if (!cancelled) setError(e.message || "Failed to render diagram");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [value]);

  if (error) {
    return (
      <div className="glass rounded-2xl p-4 my-4 text-sm text-red-500">
        <p className="font-medium mb-1">Mermaid Error</p>
        <pre className="text-xs overflow-auto">{error}</pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="glass rounded-2xl p-8 my-4 flex items-center justify-center text-default-400 text-sm">
        Loading diagram...
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="glass rounded-2xl p-4 my-4 overflow-x-auto [&>svg]:mx-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
