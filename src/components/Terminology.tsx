import React, { useEffect, useState } from "react";
import { List, Button } from "antd";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import { useBaseUrlUtils } from "@docusaurus/useBaseUrl";
import { useLocation } from "@docusaurus/router";
import { usePluginData } from "@docusaurus/useGlobalData";
import { AuthorAttributes } from "@docusaurus/plugin-content-blog";
import { TermData } from "heliannuuthus-terminology-store";
import MDXRenderer from "@site/src/components/MDXRender";
import TermPreview from "@site/src/components/TermPreview";
import Tooltip from "@site/src/components/Tooltip";
import { Comment } from "@site/src/components/Typography";
import { createStyles } from "antd-style";
import { PopoverAvatars, DrawerAvatars } from "@site/src/components/Avatar";
import { isMobile, isIPad13, isTablet } from "react-device-detect";

const useMobile = isMobile || isIPad13 || isTablet;

// 将单个术语项封装成一个组件
interface TermItemProps {
  slug: string;
  term: TermData;
  authors: Record<string, AuthorAttributes>;
  expanded?: boolean;
}

const useStyles = createStyles(({ css, cx, token, appearance }) => ({
  container: css`
    position: relative;
  `,
  contentWrapper: css`
    overflow: hidden;
    transition: max-height 0.3s ease-in-out;
    position: relative;
  `,
  // 渐变阴影层，内部采用 flex 居中放置按钮
  shadowLayer: css`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
    background: ${appearance === "dark"
      ? "radial-gradient(ellipse at top center,rgba(27, 27, 29, 0) 30%, #1b1b1d 100%) "
      : "radial-gradient(ellipse at top center,rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 1) 100%) "};
  `,
  // 按钮样式，重写 pointer-events，保证按钮可点击
  toggleButton: css`
    pointer-events: auto; /* 允许按钮响应点击 */
    background: transparent;
    border: none;
    color: ${token.colorPrimary};
  `,
  // 收起按钮的容器，当内容展开时显示
  collapseWrapper: css`
    display: flex;
    justify-content: center;
    margin-top: 8px;
  `,
}));

const TermItemContent = ({
  slug,
  content,
}: {
  slug: string;
  content: string;
}) => {
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    const hash = location.hash.substring(1);
    if (hash == slug) {
      setExpanded(true);
    }
  }, [location.hash]);

  const { styles, cx } = useStyles();

  return (
    <div>
      <div className={styles.container}>
        <div
          className={styles.contentWrapper}
          style={{
            maxHeight: expanded ? "none" : "100px",
          }}
        >
          <MDXRenderer
            content={content}
            components={() => ({
              Term: TermPreview,
              Comment: Comment,
              Tooltip: Tooltip,
            })}
          />
        </div>
        {!expanded && (
          <div className={cx(styles.shadowLayer)}>
            <Button
              icon={<DownOutlined />}
              className={cx(styles.toggleButton)}
              type="link"
              onClick={() => setExpanded(true)}
            >
              点击查看更多
            </Button>
          </div>
        )}
      </div>
      {expanded && (
        <div className={cx(styles.collapseWrapper)}>
          <Button
            icon={<UpOutlined />}
            className={cx(styles.toggleButton)}
            type="link"
            onClick={() => setExpanded(false)}
          >
            点击收起
          </Button>
        </div>
      )}
    </div>
  );
};

const TermItem = ({ slug, term, authors }: TermItemProps) => {
  return (
    <List.Item key={slug} id={slug}>
      <List.Item.Meta
        avatar={
          useMobile ? (
            <DrawerAvatars authors={authors} />
          ) : (
            <PopoverAvatars authors={authors} />
          )
        }
        title={term.metadata.title}
        description={
          <MDXRenderer
            components={() => ({
              Term: TermPreview,
              Comment: Comment,
              Tooltip: Tooltip,
            })}
            content={term.metadata.description}
          />
        }
      />
      <TermItemContent slug={slug} content={term.content} />
    </List.Item>
  );
};

const Terminology = () => {
  const { withBaseUrl } = useBaseUrlUtils();
  const location = useLocation();
  const { authors } = usePluginData("docusaurus-plugin-authors-list") as {
    authors: Record<string, AuthorAttributes>;
  };

  const [termData, setTermData] = useState<Record<string, TermData>>({});

  useEffect(() => {
    // 根据当前路由，加载对应的 JSON 数据
    fetch(withBaseUrl(`${location.pathname.replace(/\/$/, "")}.json`))
      .then((res) => res.json())
      .then((data) => {
        setTermData(data);
      });
  }, [location.pathname, withBaseUrl]);

  return (
    <List
      itemLayout="vertical"
      dataSource={Object.entries(termData)}
      renderItem={([slug, term]: [string, TermData]) => (
        <TermItem slug={slug} term={term} authors={authors} />
      )}
    />
  );
};

export default Terminology;
