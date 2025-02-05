import { Tooltip, Typography, Drawer, Button } from "antd";
import { useState, useEffect } from "react";
import { usePluginData } from "@docusaurus/useGlobalData";
import { useBaseUrlUtils } from "@docusaurus/useBaseUrl";
import { AuthorAttributes } from "@docusaurus/plugin-content-blog";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { TermData } from "heliannuuthus-terminology-store";
import { isMobile, isIPad13, isTablet } from "react-device-detect";
import MDXRender from "./MDXRender";
import { BookFilled } from "@ant-design/icons";
import { useHistory } from "@docusaurus/router";
import { PopoverAvatars, DrawerAvatars } from "./Avatar";
const { Text, Link, Title } = Typography;

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
  authors: Record<string, AuthorAttributes>;
};

const TooltipsPreview = ({
  path,
  anchor,
  children,
  content,
}: {
  path: string;
  anchor: string;
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
          maxHeight: "32vh",
          overflow: "auto",
        },
      }}
      title={
        <>
          <Title level={1} children={content.title} />
          <Typography.Paragraph
            style={{ marginBottom: 16, display: "flex", alignItems: "center" }}
          >
            <PopoverAvatars authors={content.authors} />
            <Text> 贡献</Text>
          </Typography.Paragraph>
          <MDXRender
            content={content.content}
            components={() => ({ Term: TermPreview })}
          />
        </>
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
  children,
  content,
}: {
  path: string;
  anchor: string;
  children: React.ReactNode;
  content: TermContent;
}) => {
  const [open, setOpen] = useState(false);
  const history = useHistory();
  return (
    <>
      <Link
        style={{
          textDecoration: "underline dashed",
          textUnderlineOffset: "4px",
        }}
        href={`${path.replace(/^\/blog/, "")}${anchor}`}
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
          <Button
            href={`${path.replace(/^\/blog/, "")}${anchor}`}
            type="link"
            icon={<BookFilled />}
            onClick={() => {
              history.push(`${path.replace(/^\/blog/, "")}${anchor}`);
            }}
          >
            词典
          </Button>
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
        <MDXRender
          content={content.content}
          components={() => ({ Term: TermPreview })}
        />
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
  const { authors } = usePluginData("docusaurus-plugin-authors-list") as {
    authors: Record<string, AuthorAttributes>;
  };

  const fetchContent = async (
    url: string,
    authors: Record<string, AuthorAttributes>
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
      const response = await fetch(withBaseUrl(`/blog/${path}.json`));
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
          {} as Record<string, AuthorAttributes>
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
        <Tooltip title={<div>网络好像出现了一些问题...</div>}>
          {children}
        </Tooltip>
      }
    >
      {() =>
        content ? (
          useMobile ? (
            <DrawerPreview
              path={path}
              anchor={anchor}
              content={content}
              children={children}
            />
          ) : (
            <TooltipsPreview
              path={path}
              anchor={anchor}
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
