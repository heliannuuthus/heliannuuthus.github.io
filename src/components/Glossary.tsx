import BrowserOnly from "@docusaurus/BrowserOnly";
import { useEffect, useState } from "react";
import { useBaseUrlUtils } from "@docusaurus/useBaseUrl";
import { List, Skeleton, Avatar, Typography, Tooltip } from "antd";
import { usePluginData } from "@docusaurus/useGlobalData";
import { AuthorAttributes } from "@docusaurus/plugin-content-blog";
import { TermData } from "heliannuuthus-terminology-store";
declare global {
  interface Window {
    _cachedGlossary: any;
  }
}

const { Link } = Typography;
const Glossary = () => {
  const { withBaseUrl } = useBaseUrlUtils();

  const [glossaries, setGlossaries] = useState<Record<string, TermData>>({});

  const { authors } = usePluginData("docusaurus-plugin-authors-list") as {
    authors: Record<string, AuthorAttributes>;
  };

  useEffect(() => {
    if (typeof window !== "undefined" && glossaries) {
      if (!window._cachedGlossary) {
        fetch(withBaseUrl("/blog/glossary.json"))
          .then((res) => res.json())
          .catch((err) => {
            console.error(err);
          })
          .then((data) => {
            console.log(data);
            window._cachedGlossary = data;
            setGlossaries(data);
          });
      } else {
        setGlossaries(window._cachedGlossary);
      }
    }
  }, [glossaries]);

  return (
    <BrowserOnly fallback={<div>网络好像出现了一些问题...</div>}>
      {() => {
        return (
          <List
            dataSource={Object.entries(glossaries)}
            renderItem={([filePath, value]: [
              string,
              Record<string, TermData>,
            ]) =>
              Object.entries(value).map(([key, value]) => (
                <List.Item
                  key={key}
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
                    title={
                      <Link href={`${filePath.replace(/^blog/, "")}#${key}`}>
                        {value.metadata.title}
                      </Link>
                    }
                    description={
                      <div
                        dangerouslySetInnerHTML={{
                          __html: value.metadata.description,
                        }}
                      />
                    }
                  />
                </List.Item>
              ))
            }
          />
        );
      }}
    </BrowserOnly>
  );
};

export default Glossary;
