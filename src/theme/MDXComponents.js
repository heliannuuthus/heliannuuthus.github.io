import MDXComponents from "@theme-original/MDXComponents";
import Tooltip from "@site/src/components/Tooltip";
import { Text } from "@site/src/components/Typography";
import React from "react";
import { createStyles } from "antd-style";

const useStyles = createStyles(({ css }) => ({
  container: css`
    cursor: pointer;
    transition: box-shadow 0.3s;
    display: inline-block;
    padding: 0px 4px;
    border-radius: 2px;

    &:hover {
      box-shadow:
        0 1px 2px -2px rgba(0, 0, 0, 0.16),
        0 3px 6px 0 rgba(0, 0, 0, 0.12),
        0 5px 12px 4px rgba(0, 0, 0, 0.09);
    }
  `,
}));

const Comment = React.forwardRef((props, ref) => {
  const { styles } = useStyles();

  return <Text ref={ref} {...props} underline className={styles.container} />;
});

export default {
  ...MDXComponents,
  Tooltip,
  Comment,
};
