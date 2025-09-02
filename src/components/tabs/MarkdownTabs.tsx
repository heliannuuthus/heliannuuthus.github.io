import { Tabs, TabsProps } from "antd";
import { createStyles } from "antd-style";
import { Children, isValidElement } from "react";

const useStyles = createStyles(({ css }) => ({
  tabs: css`
    padding: 0;
    margin: 0 0 var(--ifm-spacing-vertical);
  `
}));

const MarkdownTabs = (props: TabsProps) => {
  const { children, ...rest } = props;
  const { styles } = useStyles();
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

  return <Tabs {...rest} centered items={tabs} className={styles.tabs} />;
};

export default MarkdownTabs;
