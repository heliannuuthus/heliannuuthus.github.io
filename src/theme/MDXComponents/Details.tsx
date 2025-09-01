import { Collapse } from "@components/collapse";
import { createStyles } from "antd-style";
import React, {
  type ComponentProps,
  type ReactElement,
  type ReactNode
} from "react";

import type { Props } from "@theme/MDXComponents/Details";

const useStyles = createStyles(({ css }) => ({
  header: css`
    .ant-collapse-header-text {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `
}));

export default function MDXDetails(props: Props): ReactNode {
  const { styles } = useStyles();
  const items = React.Children.toArray(props.children);
  const title = items.find(
    (item): item is ReactElement<ComponentProps<"title">> =>
      React.isValidElement(item) && item.type === "title"
  );
  const children = <>{items.filter((item) => item !== title)}</>;
  return (
    <Collapse
      {...props}
      label={<span>{title?.props.children}</span>}
      children={children}
      classNames={{
        header: styles.header
      }}
    />
  );
}
