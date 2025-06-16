import { createStyles } from "antd-style";
import Icon, { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
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
  `,
}));

// 可复用的展开/收起图标组件
const ExpandIcon: React.FC<{ isActive?: boolean }> = ({ isActive }) => {
  const { styles } = useIconStyles();

  return (
    <span className={styles.expandIcon}>
      <Icon component={isActive ? EyeOutlined : EyeInvisibleOutlined} />
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
  collapseWrapper: css`
    .ant-collapse-item {
      .ant-collapse-header {
        transition: all 0.2s ease-in-out;
        .ant-collapse-expand-icon {
          opacity: 0;
          transition: opacity 0.2s ease-in-out;
        }
        &:hover {
          .ant-collapse-expand-icon {
            opacity: 1;
          }
        }
      }
    }
  `,
}));

interface CollapseHeadingProps {
  title: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  collapsed?: boolean;
  children: React.ReactNode | string;
}

const CollapseHeading: React.FC<CollapseHeadingProps> = ({
  title,
  level,
  children,
  collapsed = false,
}: CollapseHeadingProps) => {
  const { styles } = useStyles();
  console.log(title, level, children, collapsed);
  return (
    <AntdCollapse
      bordered={false}
      ghost
      expandIconPosition="end"
      expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}
      collapsible="header"
      defaultActiveKey={collapsed ? [] : ["1"]}
      className={styles.collapseWrapper}
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
          showArrow: true,
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
