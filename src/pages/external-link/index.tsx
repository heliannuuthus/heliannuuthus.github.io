import { QuestionCircleFilled } from "@ant-design/icons";
import { Button, Result, Typography } from "antd";
import { createStyles } from "antd-style";
import { useEffect, useState } from "react";

import { useLocation } from "@docusaurus/router";

const { Paragraph, Text } = Typography;

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(
        .${prefixCls}-btn-dangerous
      ) {
      > span {
        position: relative;
      }

      &::before {
        content: "";
        background: linear-gradient(135deg, #68d39b, #2e8555);
        position: absolute;
        inset: -1px;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `
}));

export default function ExternalLinkPage() {
  const location = useLocation();
  const href = location.search.split("=")[1];
  const [duration, setDuration] = useState<number>(3);
  const { styles } = useStyle();

  useEffect(() => {
    const timer = setInterval(() => {
      setDuration((prev: number) => {
        if (prev === 0) {
          window.location.href = href;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Result
      status="warning"
      icon={<QuestionCircleFilled />}
      title={`即将跳转至外部链接${
        duration === 0 ? "..." : `，${duration}秒后自动跳转`
      }`}
      subTitle={
        <div
          style={{
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <pre>
            <Paragraph>链接安全性未知，是否继续？</Paragraph>
            <Paragraph>
              <Text ellipsis={{}}>{href}</Text>
            </Paragraph>
          </pre>
        </div>
      }
      extra={
        <Button
          className={styles.linearGradientButton}
          type="primary"
          onClick={() => (window.location.href = href)}
        >
          不管了，直接访问
        </Button>
      }
    />
  );
}
