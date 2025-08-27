import { MenuOutlined, SettingOutlined } from "@ant-design/icons";
import { EditOutlined } from "@ant-design/icons";
import { Button, Card, Col, Flex, Row } from "antd";
import { createStyles } from "antd-style";
import { Author } from "heliannuuthus-docusaurus-authors";
import { useEffect } from "react";
import { isIPad13, isMobile, isTablet } from "react-device-detect";

import { useHistory } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { usePluginData } from "@docusaurus/useGlobalData";

import { Terminology } from "@site/plugins/docusaurus-terminology/src";
import { DrawerAvatars, PopoverAvatars } from "@components/Avatar";
import { Paragraph } from "@components/Typography";

import Layout from "@theme/Layout";

const useMobile = isMobile || isIPad13 || isTablet;

const useStyles = createStyles(({ css }) => ({
  container: css`
    padding: 16px;
  `,
  terminology: css`
    cursor: pointer;
  `
}));

export default () => {
  const { terminologies } = usePluginData("terminology-docusaurus-plugin") as {
    terminologies: Record<string, Terminology>;
  };
  const { authors: globalAuthors } = usePluginData(
    "authors-docusaurus-plugin"
  ) as {
    authors: Record<string, Author>;
  };
  const { styles } = useStyles();
  useEffect(() => {}, []);

  const {
    siteConfig: { customFields }
  } = useDocusaurusContext();
  const history = useHistory();

  return (
    <Layout>
      <Flex vertical className={styles.container}>
        <Row
          gutter={[
            { xs: 8, sm: 16, md: 24, lg: 32 },
            { xs: 8, sm: 16, md: 24, lg: 32 }
          ]}
        >
          {Object.entries(terminologies).map(([key, terminology]) => {
            const authors = terminology.authors.reduce(
              (acc: Record<string, Author>, author: string) => {
                acc[author] = globalAuthors[author];
                return acc;
              },
              {} as Record<string, Author>
            );

            return (
              <Col span={useMobile ? 24 : 8} key={key}>
                <Card
                  hoverable
                  onClick={() => {
                    history.push(terminology.slug);
                  }}
                  className={styles.terminology}
                  title={terminology.name}
                  variant="borderless"
                  actions={[
                    <Button
                      type="link"
                      icon={<MenuOutlined key="menu" />}
                      onClick={(e) => {
                        e.stopPropagation();
                        history.push(terminology.slug);
                      }}
                      children={` 详情`}
                    />,
                    <Button
                      type="link"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(
                          `${customFields.editUrl}/${terminology.path}.mdx`,
                          "_blank"
                        );
                      }}
                      icon={<EditOutlined key="edit" />}
                      children={` 编辑`}
                    />
                  ]}
                >
                  <Card.Meta
                    avatar={
                      useMobile ? (
                        <DrawerAvatars authors={authors} />
                      ) : (
                        <PopoverAvatars authors={authors} />
                      )
                    }
                    title={terminology.name}
                    description={
                      <Paragraph ellipsis={{ rows: 1, tooltip: true }}>
                        {terminology.description}
                      </Paragraph>
                    }
                  />
                </Card>
              </Col>
            );
          })}
        </Row>
      </Flex>
    </Layout>
  );
};
