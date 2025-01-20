import { Tooltip, Avatar, Typography } from "antd";
import { forwardRef, useState, useEffect } from "react";
import { usePluginData } from "@docusaurus/useGlobalData";
import { useBaseUrlUtils } from "@docusaurus/useBaseUrl";
import { AuthorAttributes } from "@docusaurus/plugin-content-blog";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { TermData } from "heliannuuthus-terminology-store";
const { Text, Link, Title } = Typography;

declare global {
  interface Window {
    _cachedTerms: Record<string, any>;
  }
}

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
  path,
  anchor,
}: {
  children: React.ReactNode;
  path: string;
  anchor: string;
}) => {
  const [content, setContent] = useState<TermContent | null>(null);
  const { withBaseUrl } = useBaseUrlUtils();
  const { authors } = usePluginData("docusaurus-plugin-authors-list") as {
    authors: Record<string, AuthorAttributes>;
  };

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
          content: window._cachedTerms[`${url}-${anchor}`].metadata.hoverText,
          authors: window._cachedTerms[`${url}-${anchor}`].metadata.authors,
        });
        return;
      }
      // 否则从服务器获取
      anchor = anchor.substring(1);
      const response = await fetch(withBaseUrl(`/blog/${path}.json`));
      const data = (await response.json()) as Record<string, TermData>;
      const term = data[anchor];
      // 更新状态和缓存
      setContent({
        title: term.metadata.title,
        content: term.metadata.description,
        authors: term.metadata.authors.reduce(
          (acc: Record<string, AuthorAttributes>, author: string) => {
            acc[author] = authors[author];
            return acc;
          },
          {} as Record<string, AuthorAttributes>,
        ),
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
        <Tooltip title={<div>网络好像出现了一些问题...</div>}>
          {children}
        </Tooltip>
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
            href={`${path.replace(/^\/blog/, "")}${anchor}`}
          >
            {children}
          </a>
        </Tooltip>
      )}
    </BrowserOnly>
  );
};

export default TermPreview;
