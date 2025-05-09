import React, { useEffect } from "react";
import { FeedbackButton } from "pushfeedback-react";
import { defineCustomElements } from "pushfeedback/loader";
import "pushfeedback/dist/pushfeedback/pushfeedback.css";
import LikeSvg from "@site/static/img/like.svg";
import { Button as AntdButton, Flex, Space, Typography } from "antd";
import Icon from "@ant-design/icons";
import { createStyles } from "antd-style";

const { Text } = Typography;

const projectId = "kdmrkryn2r";

const useStyles = createStyles(({ token }) => ({
  container: {
    marginTop: token.margin,
  },
}));

const Button = ({ like }: { like: boolean }) => {
  return (
    <FeedbackButton
      project={projectId}
      rating={like ? 1 : 0}
      custom-font="True"
      button-style="default"
      modal-position="center"
      submit
    >
      <AntdButton
        type="text"
        icon={
          <Icon
            style={{
              fontSize: 16,
              transform: like
                ? "rotate(0deg) translateY(2.5px)"
                : "rotate(180deg) translateY(-3.5px)",
            }}
            component={LikeSvg}
          />
        }
        children={like ? "包有的啊" : "啥也不是"}
      />
    </FeedbackButton>
  );
};

export default function FeedbackWidget() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      defineCustomElements(window);
    }
  }, []);

  const { styles } = useStyles();

  return (
    <Flex
      className={styles.container}
      justify="center"
      align="flex-end"
      vertical
    >
      <Flex align="flex-end" justify="center" vertical>
        <span>
          <strong>该文章对你有帮助吗？</strong>
        </span>
        <Space.Compact>
          <Button like />
          <Button like={false} />
        </Space.Compact>
      </Flex>
    </Flex>
  );
}
