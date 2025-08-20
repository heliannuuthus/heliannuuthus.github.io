import { Tooltip as AntdTooltip, TooltipProps } from "antd";
import { createStyles } from "antd-style";

import { useHtmlTheme } from "@site/src/components/ThemeProvider";
import MDXRender from "@site/src/components/markdown/MDXRender";

import MDXComponents from "@theme/MDXComponents";

const useStyles = createStyles(({ css }) => ({
  titleContainer: css`
    p {
      margin: 0;
    }
  `
}));

const CommentTooltip = ({ title, ...props }: TooltipProps) => {
  const { styles } = useStyles();

  const colorMode = useHtmlTheme();

  return (
    <AntdTooltip
      {...props}
      title={
        typeof title === "string" ? (
          <div className={styles.titleContainer}>
            <MDXRender content={title} components={MDXComponents} />
          </div>
        ) : (
          title
        )
      }
      styles={{
        root: {
          maxWidth: "100%"
        },
        body: {
          backgroundColor:
            colorMode === "dark"
              ? "var(--ifm-color-black)"
              : "var(--ifm-color-white)",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden"
        }
      }}
    />
  );
};

export default CommentTooltip;
