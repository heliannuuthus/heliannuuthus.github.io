import { Tooltip, Avatar, Typography } from "antd";
import { forwardRef, useState, useEffect } from "react";
import { usePluginData } from "@docusaurus/useGlobalData";
import { AuthorAttributes } from "@docusaurus/plugin-content-blog";
import BrowserOnly from "@docusaurus/BrowserOnly";

const { Text, Link, Title } = Typography;

declare global {
  interface Window {
    _cachedTerms: Record<string, any>;
  }
}

type TermMetadata = {
  id: string;
  title: string;
  hoverText: string;
  authors: string[];
};

type TermData = {
  content: string;
  metadata: TermMetadata;
};

type TermContent = {
  title: string;
  content: string;
  authors: Record<string, AuthorAttributes>;
};

const Content = forwardRef(({ title, authors, content }: TermContent, ref) => {
  return (
    <Typography>
      <Title level={5}>{title}</Title>
      <div dangerouslySetInnerHTML={{ __html: content }} />
      {Object.entries(authors).map(([author, authorAttributes]) => (
        <div key={author}>
          <Avatar
            src={authorAttributes.image_url as string}
            style={{ marginRight: 8 }}
          />
          <Link href={authorAttributes.url}>{author}</Link>
          <Text> 贡献</Text>
        </div>
      ))}
    </Typography>
  );
});

const TermPreview = ({
  children,
  pathName,
}: {
  children: React.ReactNode;
  pathName: string;
}) => {
  const { authors } = usePluginData("docusaurus-plugin-authors-list") as {
    authors: Record<string, AuthorAttributes>;
  };
  const [content, setContent] = useState<TermContent | null>(null);

  const fetchContent = async (
    url: string,
    authors: Record<string, AuthorAttributes>
  ) => {
    try {
      // 如果缓存存在且有数据，直接使用缓存
      if (typeof window !== "undefined" && window._cachedTerms?.[url]) {
        setContent({
          title: window._cachedTerms[url].metadata.title,
          content: window._cachedTerms[url].metadata.hoverText,
          authors: {
            [window._cachedTerms[url].metadata.author]:
              authors[window._cachedTerms[url].metadata.author],
          },
        });
        return;
      }

      // 否则从服务器获取
      const response = await fetch(url);
      const data = (await response.json()) as TermData;
      console.log(data);

      // 更新状态和缓存
      setContent({
        title: data.metadata.title,
        content: data.metadata.hoverText,
        authors: data.metadata.authors.reduce((acc, author) => {
          acc[author] = authors[author];
          return acc;
        }, {} as Record<string, AuthorAttributes>),
      });
      if (typeof window !== "undefined") {
        window._cachedTerms = window._cachedTerms || {};
        window._cachedTerms[url] = data;
      }
    } catch (error) {
      console.error("Failed to fetch content:", error);
    }
  };

  useEffect(() => {
    fetchContent(`${pathName.replace(/\/$/, "")}.json`, authors);
  }, [pathName]);

  return (
    <BrowserOnly
      fallback={
        <Tooltip title={"网络好像出现了一些问题..."}>{children}</Tooltip>
      }
    >
      {() => (
        <Tooltip
          title={
            <Content
              title={content?.title}
              content={content?.content}
              authors={content?.authors}
            />
          }
        >
          <a
            style={{
              textDecoration: "underline dashed",
              textUnderlineOffset: "4px",
            }}
            href={pathName.replace(/^\/blog/, "")}
          >
            {children}
          </a>
        </Tooltip>
      )}
    </BrowserOnly>
  );
};

export default TermPreview;
