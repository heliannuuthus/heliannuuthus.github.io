import { ExpandIcon } from "@components/collapse";
import { InlineMDXRender } from "@components/markdown/MDXRender";
import { Collapse as AntdCollapse, CollapseProps } from "antd";

const Collapse: React.FC<{
  label: React.ReactNode;
  children: React.ReactNode;
  styles?: CollapseProps["items"][number]["styles"];
  classNames?: CollapseProps["items"][number]["classNames"];
}> = ({ label, children, styles, classNames }) => (
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
        styles: styles,
        classNames: classNames
      }
    ]}
  />
);

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
