import { LoadingOutlined } from "@ant-design/icons";
import {
  Button as AntdButton,
  Result as AntdResult,
  Skeleton as AntdSkeleton,
  Spin as AntdSpin,
  ResultProps,
  SkeletonProps,
  SpinProps
} from "antd";

const PageFetching = ({ ...props }: SkeletonProps) => {
  return <AntdSkeleton round active paragraph={{ rows: 3 }} {...props} />;
};

const PageLoading = ({ ...props }: SpinProps) => {
  return (
    <AntdSpin
      style={{
        height: "100%",
        minHeight: "72px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
      {...props}
      indicator={<LoadingOutlined spin />}
    />
  );
};

const PageFetchError = ({ url, ...props }: { url: string } & ResultProps) => {
  return (
    <AntdResult
      style={{
        backgroundColor: "inherit"
      }}
      {...props}
      status="error"
      title="页面加载失败了"
      subTitle="可能由于网络原因，请稍后再试"
      extra={
        <AntdButton type="link" onClick={() => window.open(url)}>
          不管了，直接访问
        </AntdButton>
      }
    />
  );
};

export { PageFetching, PageFetchError, PageLoading };
