import { ExpandIcon } from "@components/collapse";
import { InlineMDXRender } from "@components/markdown/MDXRender";
import { Collapse as AntdCollapse, CollapseProps } from "antd";
import { createStyles } from "antd-style";

const useStyles = createStyles(({ css }) => ({
  header: css`
    .ant-collapse-header-text {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `,
  body: css`
    overflow-x: auto;
  `
}));

const Collapse: React.FC<{
  label: React.ReactNode;
  children: React.ReactNode;
}> = ({ label, children }) => {
  const { styles } = useStyles();
  return (
    <AntdCollapse
      bordered={false}
      expandIconPosition="end"
      expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}
      defaultActiveKey={[""]}
      items={[
        {
          key: "1",
          label:
            typeof label === "string" ? (
              <InlineMDXRender content={label} />
            ) : (
              label
            ),
          children:
            typeof children === "string" ? (
              <InlineMDXRender content={children} />
            ) : (
              children
            ),
          classNames: {
            header: styles.header,
            body: styles.body
          }
        }
      ]}
    />
  );
};

const Collapses: React.FC<{ items: CollapseProps["items"] }> = ({ items }) => (
  <AntdCollapse
    bordered={false}
    defaultActiveKey={[""]}
    items={items?.map((item, idx) => ({
      ...item,
      label:
        typeof item.label === "string" ? (
          <InlineMDXRender content={item.label} />
        ) : (
          item.label
        ),
      key: idx.toString()
    }))}
  />
);

export { Collapse, Collapses };
