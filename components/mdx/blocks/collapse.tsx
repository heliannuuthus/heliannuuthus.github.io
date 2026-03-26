"use client";

import { Disclosure } from "@heroui/react/disclosure";

interface CollapseProps {
  title?: string;
  children?: React.ReactNode;
}

export default function Collapse({ title = "Details", children }: CollapseProps) {
  return (
    <Disclosure className="glass rounded-2xl my-4 overflow-hidden">
      <Disclosure.Trigger className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-default-100/50 transition-colors text-left">
        {title}
        <Disclosure.Indicator>
          <svg
            className="w-4 h-4 transition-transform duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </Disclosure.Indicator>
      </Disclosure.Trigger>
      <Disclosure.Content>
        <Disclosure.Body className="px-4 pb-4 text-sm leading-relaxed [&>p:first-child]:mt-0">
          {children}
        </Disclosure.Body>
      </Disclosure.Content>
    </Disclosure>
  );
}
