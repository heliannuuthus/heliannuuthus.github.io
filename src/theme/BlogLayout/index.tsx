import React from "react";
import BlogLayout from "@theme-original/BlogLayout";
import type BlogLayoutType from "@theme/BlogLayout";
import type { WrapperProps } from "@docusaurus/types";
import { ConfigProvider } from "antd";
import { useColorMode } from "@docusaurus/theme-common";

type Props = WrapperProps<typeof BlogLayoutType>;

const ConfigProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  const { colorMode } = useColorMode();
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: colorMode === "dark" ? "#25c2a0" : "#2e8555",
          colorPrimaryHover: colorMode === "dark" ? "#21af90" : "#29784c",
          colorPrimaryActive: colorMode === "dark" ? "#1fa588" : "#277148",
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default function BlogLayoutWrapper(props: Props): JSX.Element {
  return (
    <BlogLayout
      {...props}
      children={<ConfigProviderWrapper>{props.children}</ConfigProviderWrapper>}
    />
  );
}
