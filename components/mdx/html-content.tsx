"use client";

import { useRef } from "react";
import IslandHydrator from "./island-hydrator";

export default function HtmlContent({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <>
      <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
      <IslandHydrator targetRef={ref} />
    </>
  );
}
