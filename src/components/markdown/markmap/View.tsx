import { Modal } from "antd";
import { Transformer } from "markmap-lib";
import * as markmap from "markmap-view";
import React, { useEffect, useMemo, useState } from "react";

import { MarkmapContext } from "./context";
import { BlockViewer, FullscreenViewer } from "./viewer";

const { loadCSS, loadJS } = markmap;
const transformer = new Transformer();

let assetsLoaded = false;

const ensureAssetsLoaded = () => {
  if (assetsLoaded) return;
  if (typeof window === "undefined") return;
  const { scripts, styles } = transformer.getAssets();
  loadCSS(styles);
  loadJS(scripts, { getMarkmap: () => markmap });
  assetsLoaded = true;
};

export type MarkmapProps = {
  markdown: string;
};

const View = ({ markdown }: MarkmapProps) => {
  const [isFullscreen, setFullscreen] = useState<boolean>(false);

  const transformed = useMemo(
    () => transformer.transform(markdown),
    [markdown]
  );

  useEffect(() => {
    ensureAssetsLoaded();
  }, []);

  return (
    <MarkmapContext.Provider value={{ transformed }}>
      <Modal
        style={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
          margin: 0,
          padding: 0,
          position: "fixed",
          zIndex: 1000
        }}
        styles={{
          mask: {
            margin: 0
          },
          wrapper: {
            padding: 0,
            margin: 0
          },
          content: {
            height: "100vh",
            width: "100vw",
            padding: 0,
            margin: 0,
            borderRadius: 0,
            border: "none"
          },
          body: {
            height: "100vh",
            width: "100vw",
            margin: 0,
            padding: 0
          }
        }}
        width={"100vw"}
        height={"100vh"}
        destroyOnHidden={true}
        closable={false}
        footer={null}
        open={isFullscreen}
        onCancel={() => setFullscreen(false)}
      >
        <FullscreenViewer onFullscreenChange={setFullscreen} />
      </Modal>
      <BlockViewer onFullscreenChange={setFullscreen} />
    </MarkmapContext.Provider>
  );
};

export default View;
