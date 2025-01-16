import { Tooltip as AntdTooltip } from "antd";

const Tooltip = ({
  children,
  pathName,
}: {
  children: React.ReactNode;
  pathName: string;
}) => {
  fetch(`${pathName.replace(/\/$/, "")}.json`)
    .then((res) => res.json())
    .then((data) => {
      console.log("data", data);
    });
  return <AntdTooltip title={pathName}>{children}</AntdTooltip>;
};

export default Tooltip;
