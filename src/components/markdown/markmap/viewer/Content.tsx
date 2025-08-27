import { Paragraph } from "@components/Typography";
import {
  Markmap,
  MarkmapContext,
  createGObserver,
  createMarkmap,
  reinitializePathObserver
} from "@components/markdown/markmap";
import "animate.css";
import { Card, Tabs, TabsProps } from "antd";
import { createStyles } from "antd-style";
import * as d3 from "d3";
import { useContext, useEffect, useRef, useState } from "react";

import { FullscreenViewerHeader, ViewerHeader } from "./Header";

const useStyles = createStyles(({ css }) => ({
  blockSvgViewer: css`
    border-radius: 8px;
    border: 1px solid var(--ifm-color-border);
    .animate__animated.animate__slideInRight {
      --animate-duration: 300ms;
    }
    .animate__animated.animate__slideInLeft {
      --animate-duration: 300ms;
    }
    .animate__animated.animate__fadeOut {
      --animate-duration: 100ms;
    }
    margin-bottom: 16px;
  `,
  blockViewerDisplayer: css`
    overflow: hidden;
    max-height: 100%;
    min-height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  fullscreenViewer: css`
    .ant-card-body {
      height: 100%;
      width: 100%;
      padding: 0;
    }
    svg {
      width: 100%;
      height: 100%;
    }
  `,
  fullscreenViewerDisplayer: css`
    height: 100%;
    width: 100%;
    flex: 1 1;
  `
}));

const Displayer: React.FC<{
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
}> = ({ children, className, style }) => {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};

export const FullscreenViewer: React.FC<{
  onFullscreenChange: (fullscreen: boolean) => void;
}> = ({ onFullscreenChange }) => {
  const { styles } = useStyles();
  const { transformed } = useContext(MarkmapContext);
  const svgRef = useRef<SVGSVGElement>(null);
  const markmapRef = useRef<Markmap>(null);
  const pathObserverRef = useRef<MutationObserver | null>(null);
  const gObserverRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    markmapRef.current = createMarkmap(svgRef.current, {});
    markmapRef.current?.setData(transformed?.root).then(() => {
      markmapRef.current?.fit().then(() => {
        gObserverRef.current = createGObserver(markmapRef.current.g);
        gObserverRef.current.observe(markmapRef.current.g.node(), {
          childList: true,
          subtree: false
        });
      });
    });
    pathObserverRef.current = reinitializePathObserver(
      markmapRef.current.g,
      pathObserverRef.current
    );
    return () => {
      markmapRef.current?.destroy();
      pathObserverRef.current?.disconnect();
      gObserverRef.current?.disconnect();
    };
  }, []);
  return (
    <Card
      className={styles.fullscreenViewer}
      style={{
        height: "100%",
        width: "100%"
      }}
      styles={{
        body: {
          height: "100%",
          width: "100%"
        }
      }}
      children={
        <Displayer
          className={`${styles.fullscreenViewerDisplayer} animate__animated animate__slideInLeft`}
        >
          <svg ref={svgRef} />
        </Displayer>
      }
      title={
        <FullscreenViewerHeader
          svg={svgRef}
          onAction={(action) => {
            if (action.type === "zoomDelta") {
              if (markmapRef.current && action.data?.delta) {
                markmapRef.current?.rescale(Number(action.data?.delta));
              }
            } else if (action.type === "zoomReset") {
              if (markmapRef.current) {
                markmapRef.current?.fit();
              }
            } else if (action.type === "toggleFullscreen") {
              onFullscreenChange(false);
            }
          }}
        />
      }
    />
  );
};

export const BlockViewer: React.FC<{
  onFullscreenChange: (fullscreen: boolean) => void;
}> = ({ onFullscreenChange }) => {
  const { styles } = useStyles();

  const { transformed } = useContext(MarkmapContext);

  const [activeTab, setActiveTab] = useState<string>("svg");
  const [codeShow, setCodeShow] = useState<boolean>(false);
  const [svgShow, setSvgShow] = useState<boolean>(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const markmapRef = useRef<Markmap>(null);
  const gObserverRef = useRef<MutationObserver | null>(null);
  const pathObserverRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    markmapRef.current = createMarkmap(svgRef.current, {
      duration: 0
    });

    markmapRef.current?.setData(transformed?.root).then(() => {
      markmapRef.current?.fit().then(() => {
        gObserverRef.current = createGObserver(markmapRef.current.g);
        gObserverRef.current.observe(markmapRef.current.g.node(), {
          childList: true,
          subtree: false
        });
      });
    });

    pathObserverRef.current = reinitializePathObserver(
      markmapRef.current.g,
      pathObserverRef.current
    );

    return () => {
      markmapRef.current?.destroy();
      pathObserverRef.current?.disconnect();
      gObserverRef.current?.disconnect();
    };
  }, []);

  return (
    <Tabs
      className={styles.blockSvgViewer}
      items={
        [
          {
            key: "svg",
            label: "图片",
            forceRender: true,
            children: (
              <Displayer
                className={`${styles.blockViewerDisplayer} ${svgShow ? "animate__animated animate__slideInLeft" : ""}`}
              >
                <svg
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onFullscreenChange(true);
                  }}
                  ref={svgRef}
                  style={{
                    minHeight: "336px",
                    maxHeight: "336px",
                    width: "100%"
                  }}
                />
              </Displayer>
            )
          },
          {
            key: "code",
            label: "代码",
            forceRender: true,
            children: (
              <Displayer
                className={`${styles.blockViewerDisplayer} ${codeShow ? "animate__animated animate__slideInRight" : ""}`}
              >
                <Paragraph
                  style={{
                    width: "100%",
                    height: "100%",
                    maxHeight: "336px",
                    overflow: "auto",
                    marginBottom: 0,
                    scrollbarWidth: "thin",
                    scrollbarColor: "var(--ifm-color-primary) transparent"
                  }}
                >
                  <pre style={{ margin: 0, padding: 10 }}>
                    {transformed.content}
                  </pre>
                </Paragraph>
              </Displayer>
            )
          }
        ] as TabsProps["items"]
      }
      activeKey={activeTab}
      animated={false}
      renderTabBar={() => (
        <ViewerHeader
          svg={svgRef}
          onAction={(action) => {
            if (action.type === "zoomDelta") {
              if (markmapRef.current && action.data?.delta) {
                markmapRef.current?.rescale(Number(action.data?.delta));
              }
            } else if (action.type === "zoomReset") {
              if (markmapRef.current) {
                markmapRef.current?.fit();
              }
            } else if (action.type === "toggleFullscreen") {
              onFullscreenChange(true);
            }
            if (action.type === "tabChange") {
              const tab = action.data?.tab as "svg" | "code";
              setActiveTab(tab);
              setCodeShow(false);
              setSvgShow(false);
              if (tab === "svg") {
                setSvgShow(true);
                setTimeout(() => setSvgShow(false), 300);
              } else {
                setCodeShow(true);
                setTimeout(() => setCodeShow(false), 300);
              }
            }
          }}
        />
      )}
    />
  );
};
