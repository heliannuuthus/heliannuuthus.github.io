import { Collapse as AntdCollapse, CollapseProps } from "antd";

const Collapse: React.FC = ({
  label,
  children,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
}) => (
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

const Collapses: React.FC = ({ items }: { items: CollapseProps["items"] }) => (
  <AntdCollapse
    bordered={false}
    defaultActiveKey={[""]}
    items={items.map((item, idx) => ({ ...item, key: idx.toString() }))}
  />
);

export { Collapse, Collapses };
