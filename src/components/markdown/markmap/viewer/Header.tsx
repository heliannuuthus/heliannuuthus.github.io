import Icon from "@ant-design/icons";
import {
  AimOutlined,
  CloseOutlined,
  CopyOutlined,
  DownOutlined,
  DownloadOutlined,
  FullscreenOutlined,
  ZoomInOutlined,
  ZoomOutOutlined
} from "@ant-design/icons";
import { Button, Divider, Dropdown, Flex, Segmented, Space } from "antd";
import { createStyles } from "antd-style";
import useMessage from "antd/es/message/useMessage";
import { saveAs } from "file-saver";
import { toBlob } from "html-to-image";
import type { Options } from "html-to-image/lib/types";
import { useCallback, useContext } from "react";

import { MarkmapContext } from "@site/src/components/markdown/markmap";

const globalOptions: Options = { skipFonts: true };

export type ViewerHeaderActionType =
  | "tabChange"
  | "zoomDelta"
  | "zoomReset"
  | "toggleFullscreen";
export type ViewerHeaderTab = "svg" | "code";
export type ViewerHeaderActionProps = {
  type: ViewerHeaderActionType;
  data?: Record<string, any>;
};

type ViewerHeaderProps = {
  svg: React.RefObject<SVGSVGElement>;
  onAction?: (action: ViewerHeaderActionProps) => void;
};

const useStyles = createStyles(({ css }) => ({
  svgViewerHeader: css`
    position: relative;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    background-color: var(--ifm-color-bg-quaternary) !important;
    height: 48px;
    width: 100%;
    padding: 0 16px;
  `
}));

const useViewerActions = ({ svg, onAction }: Partial<ViewerHeaderProps>) => {
  const { transformed } = useContext(MarkmapContext);

  const [message, contextHolder] = useMessage({
    maxCount: 3,
    top: 64,
    duration: 2
  });

  const getCurrentSvgElement = useCallback((): SVGSVGElement | null => {
    return svg.current || null;
  }, [svg]);

  const handleDownload = useCallback(async () => {
    const svgEl = getCurrentSvgElement();
    if (!svgEl) return message.warning("未找到可下载的图片");
    try {
      const blob = await toBlob(svgEl as unknown as HTMLElement, globalOptions);
      saveAs(blob, "svg-viewer.png");
      message.success("图片已开始下载");
    } catch (e) {
      console.error(e);
      message.error("下载失败");
    }
  }, [getCurrentSvgElement, message]);

  const handleCopyImage = useCallback(async () => {
    const svgEl = getCurrentSvgElement();
    if (!svgEl) return message.warning("未找到可复制的图片");
    try {
      const blob = await toBlob(svgEl as unknown as HTMLElement, globalOptions);
      if (navigator.clipboard && (navigator.clipboard as any).write) {
        await navigator.clipboard.write([
          new window.ClipboardItem({ "image/png": blob })
        ]);
        message.success("图片已复制到剪贴板");
      } else {
        message.warning("当前环境不支持复制图片");
      }
    } catch (e) {
      console.error(e);
      message.error("复制失败");
    }
  }, [getCurrentSvgElement, message]);

  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(transformed.content);
      message.success("内容已复制");
    } catch (e) {
      console.error(e);
      message.error("复制失败");
    }
  }, [transformed, message]);

  const zoomInHandler = useCallback(() => {
    onAction?.({ type: "zoomDelta", data: { delta: 1.2 } });
  }, [onAction]);

  const zoomOutHandler = useCallback(() => {
    onAction?.({ type: "zoomDelta", data: { delta: 0.8 } });
  }, [onAction]);

  const resetZoomHandler = useCallback(() => {
    onAction?.({ type: "zoomReset" });
  }, [onAction]);

  const toggleFullscreen = useCallback(
    (fullscreen: boolean) => {
      onAction?.({
        type: "toggleFullscreen",
        data: { isFullscreen: fullscreen }
      });
    },
    [onAction]
  );

  return {
    messageContext: contextHolder,
    handleDownload,
    handleCopyImage,
    handleCopyCode,
    zoomInHandler,
    zoomOutHandler,
    resetZoomHandler,
    toggleFullscreen
  };
};

export const ViewerHeader = ({ svg, onAction }: ViewerHeaderProps) => {
  const { styles } = useStyles();
  const {
    messageContext,
    handleDownload,
    handleCopyImage,
    handleCopyCode,
    zoomInHandler,
    zoomOutHandler,
    resetZoomHandler,
    toggleFullscreen
  } = useViewerActions({ svg, onAction });

  return (
    <Flex
      className={styles.svgViewerHeader}
      justify="space-between"
      align="center"
    >
      {messageContext}
      <Flex gap="small" align="center">
        <Segmented
          shape="round"
          options={[
            { label: "图片", value: "svg" },
            { label: "代码", value: "code" }
          ]}
          onChange={(value) => {
            onAction?.({
              type: "tabChange",
              data: { tab: value as ViewerHeaderTab }
            });
          }}
        />
      </Flex>
      <Space size="small" align="center">
        <Dropdown
          placement="bottom"
          menu={{
            style: { marginTop: 14 },
            onClick: ({ key }) => {
              if (key === "download") handleDownload();
              if (key === "copyImage") handleCopyImage();
              if (key === "copy") handleCopyCode();
            },
            items: [
              { key: "download", label: "下载图片" },
              { key: "copyImage", label: "复制图片" },
              { key: "copy", label: "复制代码" }
            ]
          }}
        >
          <Space.Compact size="small">
            <Button
              type="text"
              iconPosition="end"
              icon={<Icon style={{ fontSize: 8 }} component={DownOutlined} />}
            >
              <Icon component={DownloadOutlined} />
            </Button>
          </Space.Compact>
        </Dropdown>
        <Divider type="vertical" />
        <Button type="text" icon={<ZoomInOutlined />} onClick={zoomInHandler} />
        <Button
          type="text"
          icon={<ZoomOutOutlined />}
          onClick={zoomOutHandler}
        />
        <Button type="text" onClick={resetZoomHandler} icon={<AimOutlined />} />
        <Button
          type="text"
          icon={<FullscreenOutlined />}
          onClick={() => toggleFullscreen(true)}
        />
      </Space>
    </Flex>
  );
};

export const FullscreenViewerHeader = ({
  svg,
  onAction
}: ViewerHeaderProps) => {
  const { styles } = useStyles();
  const {
    messageContext,
    handleDownload,
    handleCopyImage,
    handleCopyCode,
    zoomInHandler,
    zoomOutHandler,
    resetZoomHandler,
    toggleFullscreen
  } = useViewerActions({ svg, onAction });

  return (
    <Flex className={styles.svgViewerHeader} justify="center" align="center">
      {messageContext}
      <Space>
        <Button
          type="text"
          children="下载图片"
          icon={<DownloadOutlined />}
          onClick={handleDownload}
        />
        <Button
          type="text"
          children="复制图片"
          icon={<CopyOutlined />}
          onClick={handleCopyImage}
        />
        <Button
          type="text"
          children="复制代码"
          icon={<CopyOutlined />}
          onClick={handleCopyCode}
        />
      </Space>
      <Space
        size="small"
        align="center"
        style={{ position: "absolute", right: 16, top: "13.3%" }}
      >
        <Button type="text" icon={<ZoomInOutlined />} onClick={zoomInHandler} />
        <Button
          type="text"
          icon={<ZoomOutOutlined />}
          onClick={zoomOutHandler}
        />
        <Button type="text" icon={<AimOutlined />} onClick={resetZoomHandler} />
        <Divider type="vertical" />
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={() => toggleFullscreen(false)}
        />
      </Space>
    </Flex>
  );
};

export default { ViewerHeader, FullscreenViewerHeader };
