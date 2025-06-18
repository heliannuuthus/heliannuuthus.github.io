import { Typography, Drawer, Button, Card, Divider, Space } from "antd";
import { useState, useEffect } from "react";
import { usePluginData } from "@docusaurus/useGlobalData";
import { useBaseUrlUtils } from "@docusaurus/useBaseUrl";
import { AuthorAttributes } from "@docusaurus/plugin-content-blog";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { TermData } from "heliannuuthus-terminology-store";
import { isMobile, isIPad13, isTablet } from "react-device-detect";
import MDXRender from "@site/src/components/MDXRender";
import { BookFilled, EditOutlined } from "@ant-design/icons";
import { PopoverAvatars, DrawerAvatars } from "@site/src/components/Avatar";
import Tooltip from "@site/src/components/Tooltip";
const { Text, Link, Title } = Typography;
import { Author } from "heliannuuthus-docusaurus-authors";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { Terminology } from "heliannuuthus-docusaurus-terminology";

declare global {
  interface Window {
    _cachedTerms: Record<string, any>;
  }
}

const useMobile = isMobile || isIPad13 || isTablet;

type TermContent = {
  title: string;
  description: string;
  content: string;
  authors: Record<string, Author>;
};

const TooltipsPreview = ({
  path,
  anchor,
  editPath,
  glossary,
  children,
  content,
}: {
  path: string;
  anchor: string;
  editPath: string;
  glossary: Terminology;
  children: React.ReactNode;
  content: TermContent;
}) => {
  return (
    <Tooltip
      arrow={false}
      trigger={"click"}
      styles={{
        root: {
          maxWidth: "520px",
        },
        body: {
          padding: 0,
        },
      }}
      title={
        <Card
          style={{
            padding: 0,
          }}
          title={content.title}
          styles={{
            header: {},
            body: {
              maxHeight: "32vh",
              overflow: "auto",
            },
          }}
          variant="outlined"
          actions={[
            <Tooltip
              title={
                <Text>
                  更多内容请前往 <Text strong>{glossary.name}</Text> 词典
                </Text>
              }
            >
              <Button
                type="link"
                href={`${path}${anchor}`}
                icon={<BookFilled />}
                children={`词典`}
              />
            </Tooltip>,
            <Tooltip title={`内容描述有问题？提交 PR 修改`}>
              <Button
                type="link"
                href={editPath}
                icon={<EditOutlined key="edit" />}
                children={`编辑`}
              />
            </Tooltip>,
          ]}
        >
          <Title level={1} children={content.title} />
          <Typography.Paragraph
            style={{ marginBottom: 16, display: "flex", alignItems: "center" }}
          >
            <PopoverAvatars authors={content.authors} />
            <Text> 贡献</Text>
          </Typography.Paragraph>
          <MDXRender content={content.content} />
        </Card>
      }
      children={
        <Link
          style={{
            textDecoration: "underline dashed",
            textUnderlineOffset: "4px",
          }}
          children={children}
        />
      }
    />
  );
};

const DrawerPreview = ({
  path,
  anchor,
  editPath,
  glossary,
  children,
  content,
}: {
  path: string;
  editPath: string;
  anchor: string;
  glossary: Terminology;
  children: React.ReactNode;
  content: TermContent;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Link
        style={{
          textDecoration: "underline dashed",
          textUnderlineOffset: "4px",
        }}
        href={`${path}${anchor}`}
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
        children={children}
      />
      <Drawer
        placement="bottom"
        title={content.title}
        open={open}
        onClose={() => setOpen(false)}
        closable={false}
        footer={
          <Space
            style={{ width: "100%", justifyContent: "space-around" }}
            align="center"
            split={<Divider type="vertical" />}
          >
            <Button
              href={`${path}${anchor}`}
              type="link"
              icon={<BookFilled />}
              target="_blank"
              children={`${glossary.name} 词典`}
            />
            <Button
              type="link"
              href={editPath}
              target="_blank"
              icon={<EditOutlined key="edit" />}
              children={`编辑`}
            />
          </Space>
        }
      >
        <Typography.Paragraph
          style={{
            marginBottom: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          <DrawerAvatars authors={content.authors} />
          <Text> 贡献</Text>
        </Typography.Paragraph>
        <MDXRender content={content.content} />
      </Drawer>
    </>
  );
};

const TermPreview = ({
  children,
  path,
  anchor,
}: {
  children: React.ReactNode;
  path: string;
  anchor: string;
}) => {
  const [content, setContent] = useState<TermContent | null>(null);
  const { withBaseUrl } = useBaseUrlUtils();
  const { authors } = usePluginData("authors-docusaurus-plugin") as {
    authors: Record<string, AuthorAttributes>;
  };
  const { terminologies } = usePluginData("terminology-docusaurus-plugin") as {
    terminologies: Record<string, Terminology>;
  };

  const { siteConfig } = useDocusaurusContext();

  const editPathPrefix = siteConfig.customFields.editUrl;

  const options = siteConfig.plugins.filter((plugin) => {
    if (plugin[0] === "@docusaurus/plugin-content-pages") {
      return plugin[1] && plugin[1].id === "terminologies";
    }
    return false;
  })[0][1];

  const editPath = `${editPathPrefix}/${path
    .replace(/\/$/, "")
    .replace(options.routeBasePath, options.path)}.mdx`;

  const glossary = terminologies[path.split("/").filter(Boolean)[1]];

  const fetchContent = async (
    url: string,
    authors: Record<string, AuthorAttributes>,
  ) => {
    try {
      // 如果缓存存在且有数据，直接使用缓存
      if (
        typeof window !== "undefined" &&
        window._cachedTerms?.[`${url}-${anchor}`]
      ) {
        setContent({
          title: window._cachedTerms[`${url}-${anchor}`].metadata.title,
          description:
            window._cachedTerms[`${url}-${anchor}`].metadata.description,
          authors: window._cachedTerms[`${url}-${anchor}`].metadata.authors,
          content: window._cachedTerms[`${url}-${anchor}`].content,
        });
        return;
      }
      // 否则从服务器获取
      anchor = anchor.substring(1);
      const response = await fetch(withBaseUrl(`${path}.json`));
      const data = (await response.json()) as Record<string, TermData>;
      const term = data[anchor];
      // 更新状态和缓存
      setContent({
        title: term.metadata.title,
        description: term.metadata.description,
        authors: term.metadata.authors.reduce(
          (acc: Record<string, AuthorAttributes>, author: string) => {
            acc[author] = authors[author];
            return acc;
          },
          {} as Record<string, AuthorAttributes>,
        ),
        content: term.content,
      });
      if (typeof window !== "undefined") {
        window._cachedTerms = window._cachedTerms || {};
        window._cachedTerms[`${url}-${anchor}`] = term;
      }
    } catch (error) {
      console.error("Failed to fetch content:", error);
    }
  };

  useEffect(() => {
    fetchContent(`${path.replace(/\/$/, "")}.json`, authors);
  }, [path, anchor]);

  return (
    <BrowserOnly
      fallback={
        <Tooltip title={<div>词条加载失败...</div>}>{children}</Tooltip>
      }
    >
      {() =>
        content ? (
          useMobile ? (
            <DrawerPreview
              path={path}
              editPath={editPath}
              anchor={anchor}
              glossary={glossary}
              content={content}
              children={children}
            />
          ) : (
            <TooltipsPreview
              path={path}
              editPath={editPath}
              anchor={anchor}
              glossary={glossary}
              content={content}
              children={children}
            />
          )
        ) : (
          "loading..."
        )
      }
    </BrowserOnly>
  );
};

export default TermPreview;
