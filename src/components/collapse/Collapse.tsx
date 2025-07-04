import { Collapse as AntdCollapse, CollapseProps } from "antd";

import { InlineMDXRender } from "@site/src/components/MDXRender";
import { ExpandIcon } from "@site/src/components/collapse";

const Collapse: React.FC<{
  label: React.ReactNode;
  children: React.ReactNode;
}> = ({ label, children }) => (
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
        children: children
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
