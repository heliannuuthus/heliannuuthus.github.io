import { Tooltip as AntdTooltip, TooltipProps } from "antd";

const Tooltip = (props: TooltipProps) => {
  return (
    <AntdTooltip placement="top" arrow={{ pointAtCenter: true }} {...props} />
  );
};

export default Tooltip;
