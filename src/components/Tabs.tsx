import { Tabs as AntdTabs } from "antd";
import type { TabsProps } from "antd";

const Tabs = ({ items, ...props }: TabsProps) => {
  return <AntdTabs items={items} {...props} centered />;
};

export default Tabs;
