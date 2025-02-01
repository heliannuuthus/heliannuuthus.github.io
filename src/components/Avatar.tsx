import {
  Avatar as AntdAvatar,
  Card as AntdCard,
  Popover as AntdPopover,
  Drawer as AntdDrawer,
  CardProps,
} from "antd";
import { AuthorAttributes } from "@docusaurus/plugin-content-blog";
import { Link } from "./Typography";
import { useEffect, useState } from "react";
import { PageFetchError, PageLoading } from "./Result";

const Avatar = ({
  author,
  ...props
}: { author: AuthorAttributes } & CardProps) => {
  const [loading, setLoading] = useState(true);
  const [iframe, setIframe] = useState<React.ReactNode>(null);

  useEffect(() => {
    setLoading(true);
    fetch(author.url, {
      signal: AbortSignal.timeout(5000),
    })
      .then((res) => {
        if (res.status === 200) {
          setIframe(<iframe src={author.url} style={{ height: "300px" }} />);
        }
      })
      .catch(() => {
        setIframe(<PageFetchError url={author.url} />);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <AntdCard
      style={{
        minWidth: 300,
      }}
      {...props}
      bordered={false}
      styles={{
        cover: {
          minHeight: "72px",
        },
        body: {
          maxWidth: "478px",
          maxHeight: "100px",
          overflow: "auto",
        },
      }}
      cover={loading ? <PageLoading /> : iframe}
      children={
        <div
          style={{
            cursor: "pointer",
          }}
          onClick={() => window.open(author.url, "_blank")}
        >
          <AntdCard.Meta
            title={<Link href={author.url}>{author.name}</Link>}
            description={author.title}
            avatar={<AntdAvatar src={author.image_url as string} />}
          />
        </div>
      }
    />
  );
};

const DrawerAvatar = ({ author }: { author: AuthorAttributes }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <AntdDrawer
        key={author.name}
        title={null}
        closeIcon={null}
        closable={false}
        height={428}
        styles={{
          body: {
            padding: 0,
          },
        }}
        placement="bottom"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Avatar author={author} style={{ width: "100%", height: "100%" }} />
      </AntdDrawer>
      <AntdAvatar
        src={author.image_url as string}
        onClick={() => setOpen(true)}
        style={{ cursor: "pointer" }}
      />
    </>
  );
};

const DrawerAvatars = ({
  authors,
}: {
  authors: Record<string, AuthorAttributes>;
}) => {
  return (
    <AntdAvatar.Group>
      {Object.entries(authors).map(([author, authorAttributes]) => (
        <DrawerAvatar key={author} author={authorAttributes} />
      ))}
    </AntdAvatar.Group>
  );
};

const PopoverAvatars = ({
  authors,
}: {
  authors: Record<string, AuthorAttributes>;
}) => {
  return (
    <AntdAvatar.Group>
      {Object.entries(authors).map(([author, authorAttributes]) => (
        <AntdPopover
          key={author}
          trigger={"click"}
          styles={{
            body: {
              padding: 0,
            },
          }}
          content={<Avatar author={authorAttributes} />}
        >
          <AntdAvatar
            src={authorAttributes.image_url as string}
            style={{ cursor: "pointer" }}
          />
        </AntdPopover>
      ))}
    </AntdAvatar.Group>
  );
};

export { PopoverAvatars, DrawerAvatars };
