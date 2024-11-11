import { Steps as AntdSteps, StepsProps } from "antd";
import { useState } from "react";
const Steps = ({ items, ...props }: StepsProps) => {
  const [current, setCurrent] = useState(0);
  const [showDescription, setShowDescription] = useState(false);
  const onChange = (value: number) => {
    setCurrent(value);
  };

  const stepsWithDescription: StepsProps["items"] = items?.map(
    (item, index) => ({
      ...item,
      description: index === current ? item.description : undefined,
    }),
  );

  return (
    <AntdSteps
      items={stepsWithDescription}
      {...props}
      current={current}
      onChange={onChange}
    />
  );
};

export default Steps;
