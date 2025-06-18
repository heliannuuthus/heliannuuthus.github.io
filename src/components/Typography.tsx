import { List, Typography } from "antd";
import { createStyles } from "antd-style";
import React from "react";

const { Title, Paragraph, Text, Link } = Typography;

const useStyles = createStyles(({ css, isDarkMode }) => {
  return {
    container: css`
      cursor: pointer;
      transition: box-shadow 0.3s;
      display: inline-block;
      border-radius: 6px;
      color: ${isDarkMode ? "#48abfa" : "#1971c2"};

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
    `
  };
});

const Comment = React.forwardRef((props, ref) => {
  const { styles } = useStyles();

  return <Text ref={ref} {...props} underline className={styles.container} />;
});
export { Title, Paragraph, Text, Link, List, Comment };
