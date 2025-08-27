import Icon, { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { createStyles } from "antd-style";

import { Collapse, Collapses } from "@components/collapse/Collapse";
import CollapseHeading from "@components/collapse/CollapseHeading";

// 图标动画样式
const useIconStyles = createStyles(({ css }) => ({
  expandIcon: css`
    transition: transform 0.2s ease-in-out;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  `
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

export { ExpandIcon, Collapse, Collapses, CollapseHeading };
