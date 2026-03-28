"use client";

import { Tooltip } from "@heroui/react/tooltip";

interface HintProps {
  title?: string;
  children?: React.ReactNode;
}

export default function Hint({ title, children }: HintProps) {
  const trigger = (
    <span className="text-sky-500 dark:text-sky-400 border-b border-dashed border-sky-400/40 dark:border-sky-400/40 cursor-help">
      {children}
    </span>
  );

  if (!title) return trigger;

  return (
    <Tooltip>
      <Tooltip.Trigger className="!inline">{trigger}</Tooltip.Trigger>
      <Tooltip.Content className="max-w-60 text-sm leading-relaxed">
        {title}
      </Tooltip.Content>
    </Tooltip>
  );
}
