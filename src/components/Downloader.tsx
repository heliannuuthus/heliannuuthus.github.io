import { DownloadOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Card, Drawer, Space, Tooltip, notification } from "antd";
import { createStyles } from "antd-style";
import { saveAs } from "file-saver";
import jsZip from "jszip";
import { useEffect, useState } from "react";
import { isIPad13, isMobile, isTablet } from "react-device-detect";

import { useBaseUrlUtils } from "@docusaurus/useBaseUrl";

import { Paragraph, Text } from "@components/Typography";

import CodeBlock from "@theme/CodeBlock";

const useMobile = isMobile || isIPad13 || isTablet;

const useStyles = createStyles(({ css }) => ({
  downloaderPreview: css`
    code {
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }
  `
}));

interface BlobChunk {
  title: string;
  language: string;
  blob: Blob;
}

interface StringChunk {
  title: string;
  language: string;
  content: string;
}

interface DownloaderProps {
  path: string;
  title: string;
  language: string;
}

const TooltipPreview = ({ chunks }: { chunks: BlobChunk[] }) => {
  const { styles } = useStyles();
  const [contents, setContents] = useState<StringChunk[]>([]);
  useEffect(() => {
    chunks.forEach(async (chunk) => {
      try {
        const content = await chunk.blob.text();
        setContents((prev: StringChunk[]) => [
          ...prev,
          {
            title: chunk.title,
            language: chunk.language,
            content: content
          }
        ]);
      } catch (error) {
        console.error(error);
      }
    });
  }, [chunks]);

  return (
    <Tooltip
      trigger="click"
      styles={{
        root: {
          maxWidth: "520px"
        },
        body: {
          padding: 0
        }
      }}
      title={
        <Card
          style={{
            padding: 0
          }}
          styles={{
            header: {},
            body: {
              maxHeight: "32vh",
              overflow: "auto"
            }
          }}
          variant="outlined"
        >
          {contents.map((content) => (
            <CodeBlock
              key={content.title}
              title={content.title}
              language={content.language}
              showLineNumbers
              className={styles.downloaderPreview}
            >
              {content.content}
            </CodeBlock>
          ))}
        </Card>
      }
    >
      <Button icon={<EyeOutlined />} type="primary" />
    </Tooltip>
  );
};

const DrawPreview = ({ chunks }: { chunks: BlobChunk[] }) => {
  const { styles } = useStyles();
  const [open, setOpen] = useState(false);
  const [contents, setContents] = useState<StringChunk[]>([]);

  useEffect(() => {
    chunks.forEach(async (chunk) => {
      const content = await chunk.blob.text();
      setContents((prev: StringChunk[]) => [
        ...prev,
        { title: chunk.title, language: chunk.language, content }
      ]);
    });
  }, [chunks]);

  return (
    <>
      <Button
        icon={<EyeOutlined />}
        type="primary"
        onClick={() => setOpen(true)}
      />
      <Drawer
        placement="bottom"
        title={null}
        closeIcon={null}
        footer={null}
        open={open}
        onClose={() => setOpen(false)}
        styles={{
          body: {
            padding: 0
          }
        }}
      >
        {contents.map((content) => (
          <CodeBlock
            key={content.title}
            title={content.title}
            language={content.language}
            showLineNumbers
            className={styles.downloaderPreview}
          >
            {content.content}
          </CodeBlock>
        ))}
      </Drawer>
    </>
  );
};

const Downloader = ({ files }: { files: DownloaderProps[] }) => {
  const [chunks, setChunks] = useState<BlobChunk[]>([]);
  const [notify, contextHolder] = notification.useNotification();
  const { withBaseUrl } = useBaseUrlUtils();
  const [loading, setLoading] = useState(false);

  const fetchFile = async (path: string) => {
    const res = await fetch(withBaseUrl(`files/${path}`));
    return res.blob();
  };

  useEffect(() => {
    files.forEach(async ({ path, title, language }) => {
      await fetchFile(path).then(async (blob) =>
        setChunks((prev: BlobChunk[]) => [
          ...prev,
          {
            blob: blob,
            title: title,
            language: language
          }
        ])
      );
    });
  }, [files]);

  const handleSingleFile = async () => {
    setLoading(true);
    try {
      saveAs(chunks[0].blob, chunks[0].title);
      notify.success({
        message: `${chunks[0].title.split("/").pop()} 下载成功`,
        description: "文件已下载到本地"
      });
    } catch (error) {
      notify.error({
        message: `${chunks[0].title.split("/").pop()} 下载失败`,
        description: error.message
      });
    }
    setLoading(false);
  };

  const handleMultipleFile = async () => {
    setLoading(true);
    const zip = new jsZip();
    const titles = [];
    chunks.forEach(async (chunk: BlobChunk) => {
      try {
        titles.push(chunk.title);
        zip.file(chunk.title, chunk.blob);
      } catch (error) {
        notify.error({
          message: `压缩 ${chunk.title} 失败`,
          description: error.message
        });
      }
    });
    saveAs(await zip.generateAsync({ type: "blob" }), `bundle.zip`);
    notify.success({
      message: "压缩包下载成功",
      description: (
        <Text
          style={{ width: "100%" }}
          ellipsis={{ suffix: `...等 ${titles.length - 1} 个文件` }}
        >
          {titles.join(", ")}
        </Text>
      ),
      placement: "bottomRight",
      duration: 3,
      showProgress: true
    });
    setLoading(false);
  };

  return (
    <>
      {contextHolder}
      <Space.Compact block>
        <Button
          icon={<DownloadOutlined />}
          type="primary"
          onClick={files.length === 1 ? handleSingleFile : handleMultipleFile}
          loading={loading}
        >
          download{" "}
          {files.length === 1 ? files[0].title.split("/").pop() : "bundle.zip"}
        </Button>
        {useMobile ? (
          <DrawPreview chunks={chunks} />
        ) : (
          <TooltipPreview chunks={chunks} />
        )}
      </Space.Compact>
    </>
  );
};

export default Downloader;
