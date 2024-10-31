import { Segmented, Tabs as AntdTabs } from "antd";
import type { TabsProps } from "antd";

export const Tabs = ({ items, ...props }: TabsProps) => {
  return <AntdTabs items={items} {...props} centered />;
};
