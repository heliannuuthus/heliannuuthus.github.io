import MDXComponents from "@theme-original/MDXComponents";
import Tooltip from "@site/src/components/Tooltip";
import { Text } from "@site/src/components/Typography";
import React from "react";
import { createStyles } from "antd-style";
import { useColorMode } from "@docusaurus/theme-common";

const useStyles = createStyles(({ css }) => {
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";

  return {
    container: css`
      cursor: pointer;
      transition: box-shadow 0.3s;
      display: inline-block;
      padding: 2px 6px;
      border-radius: 6px;

      &:hover {
        box-shadow: ${isDarkMode
          ? `
            0 2px 4px -2px rgba(255, 255, 255, 0.2),
            0 4px 8px 0 rgba(255, 255, 255, 0.15),
            0 8px 16px 8px rgba(255, 255, 255, 0.1)
          `
          : `
            0 2px 4px -2px rgba(0, 0, 0, 0.16),
            0 4px 8px 0 rgba(0, 0, 0, 0.12),
            0 8px 16px 8px rgba(0, 0, 0, 0.09)
          `};
      }
    `,
  };
});

const Comment = React.forwardRef((props, ref) => {
  const { styles } = useStyles();

  return <Text ref={ref} {...props} underline className={styles.container} />;
});

export default {
  ...MDXComponents,
  Tooltip,
  Comment,
};
