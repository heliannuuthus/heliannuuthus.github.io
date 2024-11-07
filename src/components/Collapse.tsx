import { Collapse as AntdCollapse } from "antd";

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

export default Collapse;
