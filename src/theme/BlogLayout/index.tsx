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
          colorLink:
            colorMode === "dark" ? "rgb(37, 194, 160)" : "rgb(46, 133, 85)",
          colorText:
            colorMode === "dark" ? "rgb(128, 128, 128)" : "rgb(100, 102, 104)",
          colorTextLightSolid:
            colorMode === "dark" ? "rgb(178, 178, 178)" : "rgb(100, 102, 104)",
          colorPrimary:
            colorMode === "dark" ? "rgb(37, 194, 160)" : "rgb(46, 133, 85)",
          colorPrimaryHover:
            colorMode === "dark" ? "rgb(33, 175, 144)" : "rgb(41, 120, 76)",
          colorPrimaryActive:
            colorMode === "dark" ? "rgb(31, 165, 136)" : "rgb(39, 113, 72)",
          colorTextDescription:
            colorMode === "dark" ? "rgb(128, 128, 128)" : "rgb(100, 102, 104)",
          colorBgLayout:
            colorMode === "dark" ? "rgb(25, 25, 25)" : "rgb(240, 240, 240)",
          colorBgContainer:
            colorMode === "dark" ? "rgb(30, 30, 30)" : "rgb(255, 255, 255)",
          colorBgElevated:
            colorMode === "dark" ? "rgb(35, 35, 35)" : "rgb(248, 248, 248)",
          colorBgSpotlight:
            colorMode === "dark" ? "rgb(35, 35, 35)" : "rgb(248, 248, 248)",
          fontSize: 14,
          fontSizeHeading1: 38,
          fontSizeHeading2: 30,
          fontSizeHeading3: 24,
          fontSizeHeading4: 20,
          fontSizeHeading5: 16,
        },
        components: {
          Steps: {},
          Table: {},
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
