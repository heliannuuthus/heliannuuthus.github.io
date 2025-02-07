import { Row, Col, Grid, Card } from "antd";
import { Title, Text, Paragraph } from "@site/src/components/Typography";
const { useBreakpoint } = Grid;

const data = [
  {
    title: "What is heliannuuthus?",
    content: (
      <Paragraph>
        It is the <Text strong>Latin nameof the sunflower</Text>, pronounced as{" "}
        <Text italic strong>
          /hɪˈlaɪənˌnuːθəsəs/
        </Text>
        .
      </Paragraph>
    ),
  },
  {
    title: "What can i do?",
    content: (
      <Paragraph>
        This is my personal website. I can write some technical articles, and
        share some of my thoughts.
      </Paragraph>
    ),
  },
  {
    title: "About Me",
    content: (
      <Paragraph>
        I am a software engineer. <Text code>Java</Text>,<Text code>Rust</Text>,{" "}
        <Text code>Golang</Text>,<Text code>Python</Text>,{" "}
        <Text code>React</Text> All of them are my favorite.
      </Paragraph>
    ),
  },
];

const Declaration = () => {
  const screen = useBreakpoint();
  return (
    <Row style={{ width: "100%", marginTop: 20 }}>
      {data.map((item, index) => {
        if (index < 1) {
          return (
            <Col
              key={item.title}
              xs={24}
              sm={16}
              md={12}
              lg={8}
              xl={4}
              offset={screen.xl ? 4 : screen.lg ? 8 : screen.md ? 6 : 0}
            >
              <Card
                hoverable
                key={item.title}
                title={item.title}
                bordered={false}
              >
                {item.content}
              </Card>
            </Col>
          );
        }
        if (index === 2) {
          return (
            <Col
              key={item.title}
              xs={24}
              sm={16}
              md={12}
              lg={8}
              xl={4}
              offset={screen.xl ? 2 : screen.lg ? 8 : screen.md ? 6 : 0}
            >
              <Card
                hoverable
                key={item.title}
                title={item.title}
                bordered={false}
              >
                {item.content}
              </Card>
            </Col>
          );
        }
        return (
          <Col
            key={item.title}
            xs={24}
            sm={16}
            md={12}
            lg={8}
            xl={4}
            offset={screen.xl ? 2 : screen.lg ? 8 : screen.md ? 6 : 0}
          >
            <Card
              hoverable
              key={item.title}
              title={item.title}
              bordered={false}
            >
              {item.content}
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default Declaration;
