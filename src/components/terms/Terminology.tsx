import { List } from "antd";
import { Author } from "heliannuuthus-docusaurus-authors";
import { TermData } from "heliannuuthus-terminology-store";
import React, { useEffect, useState } from "react";

import { useLocation } from "@docusaurus/router";
import { useBaseUrlUtils } from "@docusaurus/useBaseUrl";
import { usePluginData } from "@docusaurus/useGlobalData";

import TermItem from "@site/src/components/terms/TermItem";

const Terminology = () => {
  const { withBaseUrl } = useBaseUrlUtils();
  const location = useLocation();
  const { authors } = usePluginData("authors-docusaurus-plugin") as {
    authors: Record<string, Author>;
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
