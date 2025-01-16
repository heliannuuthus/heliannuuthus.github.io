import { Avatar, Collapse, Typography, Tooltip } from "antd";
import { TermData } from "@site/src/components/TermPreview";
import { useBaseUrlUtils } from "@docusaurus/useBaseUrl";
import { useEffect, useState } from "react";
import { useLocation } from "@docusaurus/router";
import { CaretRightOutlined } from "@ant-design/icons";

import { usePluginData } from "@docusaurus/useGlobalData";
import { AuthorAttributes } from "@docusaurus/plugin-content-blog";

const { Text, Paragraph, Link } = Typography;

const Terminology = () => {
  const { withBaseUrl } = useBaseUrlUtils();
  const location = useLocation();

  const { authors } = usePluginData("docusaurus-plugin-authors-list") as {
    authors: Record<string, AuthorAttributes>;
  };

  const [termData, setTermData] = useState<Record<string, TermData>>({});
  const [activeKey, setActiveKey] = useState<string[]>([]);
  useEffect(() => {
    fetch(withBaseUrl(`/blog${location.pathname.replace(/\/$/, "")}.json`))
      .then((res) => res.json())
      .then((data) => {
        setTermData(data);
      });

    setActiveKey([location.hash.substring(1)]);
  }, []);

  return (
    <Collapse
      ghost
      collapsible="icon"
      defaultActiveKey={activeKey}
      activeKey={activeKey}
      onChange={(key) => {
        setActiveKey(key);
      }}
      expandIcon={({ isActive }) => (
        <CaretRightOutlined rotate={isActive ? 90 : 0} />
      )}
      items={Object.entries(termData).map(
        ([anchor, term]: [string, TermData]) => {
          return {
            key: anchor,
            label: <div id={anchor}>{term.metadata.title}</div>,
            children: (
              <span dangerouslySetInnerHTML={{ __html: term.content }} />
            ),
            styles: {
              header: {
                padding: 0,
                margin: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              },
            },
            extra: (
              <Paragraph
                style={{
                  height: 72,
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <Avatar.Group>
                  {term.metadata.authors.map((author) => (
                    <Tooltip
                      title={
                        <Link href={authors[author].url}>
                          {authors[author].name}
                        </Link>
                      }
                      key={author}
                    >
                      <Avatar
                        src={authors[author].image_url as string}
                        onClick={() => {
                          window.open(authors[author].url, "_blank");
                        }}
                      />
                    </Tooltip>
                  ))}
                </Avatar.Group>
                <Text style={{ marginLeft: 8 }}>贡献</Text>
              </Paragraph>
            ),
          };
        },
      )}
    />
  );
};

export default Terminology;
