import { useLocation } from "@docusaurus/router";
import { Result, Button, Typography } from "antd";
import { QuestionCircleFilled } from "@ant-design/icons";
const { Paragraph, Text } = Typography;

export default function ExternalLinkPage() {
  const location = useLocation();
  const href = location.search.split("=")[1];
  return (
    <Result
      status="warning"
      icon={<QuestionCircleFilled />}
      title="即将跳转至外部链接"
      subTitle={
        <div
          style={{
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <pre>
            <Paragraph>链接安全性未知，是否继续？</Paragraph>
            <Paragraph>
              <Text
                
                ellipsis={{
                  
                }}
              >
                {href}
              </Text>
            </Paragraph>
          </pre>
        </div>
      }
      extra={
        <Button type="primary" onClick={() => (window.location.href = href)}>
          不管了，直接访问
        </Button>
      }
    />
  );
}
