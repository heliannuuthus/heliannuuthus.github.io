import { Tooltip as AntdTooltip, TooltipProps } from "antd";

const Tooltip = (props: TooltipProps) => {
  return <AntdTooltip {...props} />;
};

const NowrapTooltip = (props: TooltipProps) => {
  return (
    <AntdTooltip
      {...props}
      styles={{
        root: {
          maxWidth: "100%"
        },
        body: {
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden"
        }
      }}
    />
  );
};

export { NowrapTooltip };

export default Tooltip;
