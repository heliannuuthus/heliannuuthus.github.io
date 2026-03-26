"use client";

import React, { Children, isValidElement } from "react";
import { Tabs as HeroTabs } from "@heroui/react/tabs";

interface TabsProps {
  children?: React.ReactNode;
}

interface TabProps {
  label?: string;
  value?: string;
  children?: React.ReactNode;
}

export function Tabs({ children }: TabsProps) {
  const tabs = Children.toArray(children).filter(
    (child) => isValidElement(child) && (child as any).type === Tab
  ) as React.ReactElement<TabProps>[];

  if (tabs.length === 0) return <>{children}</>;

  return (
    <HeroTabs className="glass rounded-2xl my-4 overflow-hidden">
      <HeroTabs.List className="border-b border-default-200/50">
        {tabs.map((tab, i) => (
          <HeroTabs.Tab key={i} id={String(i)}>
            {tab.props.label || tab.props.value || `Tab ${i + 1}`}
          </HeroTabs.Tab>
        ))}
      </HeroTabs.List>
      {tabs.map((tab, i) => (
        <HeroTabs.Panel
          key={i}
          id={String(i)}
          className="p-4 text-sm leading-relaxed [&>p:first-child]:mt-0 [&>p:last-child]:mb-0"
        >
          {tab.props.children}
        </HeroTabs.Panel>
      ))}
    </HeroTabs>
  );
}

export function Tab({ children }: TabProps) {
  return <>{children}</>;
}
