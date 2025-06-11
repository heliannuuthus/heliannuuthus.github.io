import { Collapse as AntdCollapse, CollapseProps } from "antd";
import { Title } from "@site/src/components/Typography";

const Collapse: React.FC<{
  label: React.ReactNode;
  children: React.ReactNode;
}> = ({ label, children }) => (
  <AntdCollapse
    bordered={false}
    defaultActiveKey={[""]}
    items={[
      {
        key: "1",
        label: label,
        children: children,
      },
    ]}
  />
);

const Collapses: React.FC<{ items: CollapseProps["items"] }> = ({ items }) => (
  <AntdCollapse
    bordered={false}
    defaultActiveKey={[""]}
    items={items?.map((item, idx) => ({ ...item, key: idx.toString() }))}
  />
);

export { Collapse, Collapses };
