"use client";

import { Disclosure } from "@heroui/react/disclosure";

interface CollapseProps {
  title?: string;
  children?: React.ReactNode;
}

export default function Collapse({
  title = "Details",
  children,
}: CollapseProps) {
  return (
    <div className="my-6">
      <Disclosure>
        <Disclosure.Heading>
          <Disclosure.Trigger>
            <Disclosure.Indicator />
            {title}
          </Disclosure.Trigger>
        </Disclosure.Heading>
        <Disclosure.Content>
          <Disclosure.Body>{children}</Disclosure.Body>
        </Disclosure.Content>
      </Disclosure>
    </div>
  );
}
