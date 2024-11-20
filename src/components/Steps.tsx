import { Steps as AntdSteps, StepsProps } from "antd";
import { createStyles } from "antd-style";

import { useState } from "react";

const useStyles = createStyles(({ token, css }) => ({
  container: css`
    .ant-steps-item-wait {
      .ant-steps-item-icon > .ant-steps-icon {
        color: ${token.colorText
          .replace("rgb", "rgba")
          .replace(")", ", 0.45)")};
      }
      .ant-steps-item-container
        > .ant-steps-item-content
        > .ant-steps-item-title {
        color: ${token.colorText
          .replace("rgb", "rgba")
          .replace(")", ", 0.45)")};
      }
    }
  `,
}));

const Steps = ({ items, ...props }: StepsProps) => {
  const [current, setCurrent] = useState(0);
  const [showDescription, setShowDescription] = useState(false);
  const onChange = (value: number) => {
    setCurrent(value);
  };

  const { styles } = useStyles();

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
      className={styles.container}
    />
  );
};

export default Steps;
