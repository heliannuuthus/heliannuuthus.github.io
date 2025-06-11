import { createStyles } from "antd-style";
import Icon, { CaretRightOutlined } from "@ant-design/icons";
import React from "react";
import { Collapse as AntdCollapse } from "antd";
import Heading, { HeadingType } from "@theme/Heading";

// 图标动画样式
const useIconStyles = createStyles(({ css }) => ({
  expandIcon: css`
    transition: transform 0.2s ease-in-out;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &.expanded {
      transform: rotate(90deg);
    }

    &.collapsed {
      transform: rotate(0deg);
    }
  `,
}));

// 可复用的展开/收起图标组件
const ExpandIcon: React.FC<{ isActive?: boolean }> = ({ isActive }) => {
  const { styles } = useIconStyles();

  return (
    <span
      className={`${styles.expandIcon} ${isActive ? "expanded" : "collapsed"}`}
    >
      <Icon component={CaretRightOutlined} />
    </span>
  );
};

const useStyles = createStyles(({ css }) => ({
  header: css`
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin-bottom: 0;
    }
    &:hover {
      .anchor-link {
        opacity: 1;
        visibility: visible;
      }
    }
  `,
}));

const CollapseHeading: React.FC<{
  title: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  collapsed?: boolean;
  children: React.ReactNode | string;
}> = ({ title, level, children, collapsed = false }) => {
  const { styles } = useStyles();

  return (
    <AntdCollapse
      bordered={false}
      ghost
      expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}
      collapsible="icon"
      defaultActiveKey={collapsed ? [] : ["1"]}
      items={[
        {
          key: "1",
          label: (
            <Heading
              id={title.toLowerCase().replace(/\s+/g, "-")}
              as={`h${level}` as HeadingType}
            >
              <span>{title}</span>
            </Heading>
          ),
          children: children,
          forceRender: true,
          classNames: {
            header: styles.header,
          },
          styles: {
            header: {
              padding: 0,
              margin: `var(--ifm-heading-margin-top) 0 var(--ifm-heading-margin-bottom) 0`,
              display: "flex",
              alignItems: "center",
            },
          },
        },
      ]}
    />
  );
};

export default CollapseHeading;
