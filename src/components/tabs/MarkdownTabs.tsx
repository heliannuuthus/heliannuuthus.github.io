import { Tabs, TabsProps } from "antd";
import { Children, isValidElement } from "react";

const MarkdownTabs = (props: TabsProps) => {
  const { children, ...rest } = props;

  const tabs = Children.toArray(children).map((item) => {
    if (isValidElement(item) && item.type === "tab") {
      return {
        label: "title" in (item.props as object) && item?.props?.["title"],
        key: item?.key,
        forceRender: true,
        children:
          "children" in (item.props as object) && item?.props?.["children"]
      };
    }
  });

  return <Tabs {...rest} centered items={tabs} />;
};

export default MarkdownTabs;
