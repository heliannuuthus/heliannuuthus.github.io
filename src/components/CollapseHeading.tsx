import { createStyles } from "antd-style";
import Icon, {
  CaretDownOutlined,
  CaretRightOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import React from "react";
import { Collapse as AntdCollapse } from "antd";
import { useHistory } from "@docusaurus/router";

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

// 锚点标题样式
const useAnchorStyles = createStyles(({ css }) => ({
  anchorHeader: css`
    display: inline-flex;
    align-items: center;
    cursor: pointer;
  `,
  anchorLink: css`
    margin-left: 8px;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease-in-out;
    color: var(--ifm-color-primary, #0066cc);
    text-decoration: none;
    font-size: 0.8em;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &:hover {
      color: var(--ifm-color-primary-dark, #004499);
    }
  `,
}));

// 锚点标题组件
const AnchorHeading: React.FC<{
  title: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}> = ({ title, level }) => {
  const { styles } = useAnchorStyles();
  const HeadingTag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  const history = useHistory();
  // 生成锚点ID，通常是标题的小写加连字符格式
  const anchorId: string = title.toLowerCase().replace(/\s+/g, "-");

  const handleAnchorClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    history.replace(`#${anchorId}`);
  };

  return (
    <HeadingTag id={anchorId}>
      <span>{title}</span>
      <a
        className={`anchor-link ${styles.anchorLink}`}
        onClick={handleAnchorClick}
        aria-label={`${title} 的锚点链接`}
      >
        #
      </a>
    </HeadingTag>
  );
};

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
  children: React.ReactNode | string;
}> = ({ title, level, children }) => {
  const { styles } = useStyles();

  return (
    <AntdCollapse
      bordered={false}
      ghost
      expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}
      collapsible="icon"
      defaultActiveKey={["1"]}
      items={[
        {
          key: "1",
          label: <AnchorHeading title={title} level={level} />,
          children: children,
          forceRender: true,
          classNames: {
            header: styles.header,
          },
          styles: {
            header: {
              cursor: "pointer",
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
