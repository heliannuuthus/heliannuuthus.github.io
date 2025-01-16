import BrowserOnly from "@docusaurus/BrowserOnly";
import { useEffect, useState } from "react";
import { useBaseUrlUtils } from "@docusaurus/useBaseUrl";
import { List, Skeleton, Avatar, Typography, Tooltip } from "antd";
import { TermData } from "./TermPreview";
import { usePluginData } from "@docusaurus/useGlobalData";
import { AuthorAttributes } from "@docusaurus/plugin-content-blog";

declare global {
  interface Window {
    _cachedGlossary: any;
  }
}

const Glossary = () => {
  const { withBaseUrl } = useBaseUrlUtils();

  const [glossaries, setGlossaries] = useState<Record<string, TermData>>({});

  const { authors } = usePluginData("docusaurus-plugin-authors-list") as {
    authors: Record<string, AuthorAttributes>;
  };

  console.log("authors", authors);
  useEffect(() => {
    if (typeof window !== "undefined" && glossaries) {
      if (!window._cachedGlossary) {
        fetch(withBaseUrl("/blog/glossary.json"))
          .then((res) => res.json())
          .catch((err) => {
            console.error(err);
          })
          .then((data) => {
            console.log("data", data);
            window._cachedGlossary = data;
            setGlossaries(data);
          });
      } else {
        setGlossaries(window._cachedGlossary);
      }
    }
  }, [glossaries]);

  return (
    <BrowserOnly fallback={<div>网络似乎出现了问题</div>}>
      {() => {
        return (
          <List
            className="demo-loadmore-list"
            itemLayout="horizontal"
            dataSource={Object.entries(glossaries)}
            renderItem={([key, value]: [string, TermData]) => (
              <List.Item
                actions={[
                  <a key="list-loadmore-edit">edit</a>,
                  <a key="list-loadmore-more">more</a>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar.Group>
                      {value.metadata.authors.map((author) => (
                        <Tooltip title={authors[author].name} key={author}>
                          <Avatar src={authors[author].image_url as string} />
                        </Tooltip>
                      ))}
                    </Avatar.Group>
                  }
                  title={value.metadata.title}
                  description={
                    <div
                      dangerouslySetInnerHTML={{
                        __html: value.metadata.hoverText,
                      }}
                    />
                  }
                />
                <div 
                  dangerouslySetInnerHTML={{
                    __html: value.content,
                  }}
                />
              </List.Item>
            )}
          />
        );
      }}
    </BrowserOnly>
  );
};

export default Glossary;
