import { theme } from "antd";
import { useEffect, useState } from "react";

import { ThemeProvider as AntdStyledThemeProvider, ThemeProviderProps } from "antd-style";

// 自定义 Hook，用于监听 <html> 元素上 data-theme 属性的变化
function useHtmlTheme() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // 获取当前主题，若没有则默认 light
    const getHtmlTheme = () =>
      document.documentElement.getAttribute("data-theme") || "light";
    setTheme(getHtmlTheme());

    // 使用 MutationObserver 监听 <html> 属性的变化
    const observer = new MutationObserver(() => {
      setTheme(getHtmlTheme());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => {
      observer.disconnect();
    };
  }, []);

  return theme;
}

export default function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps<Record<string, string>, Record<string, string>>) {
  const colorMode = useHtmlTheme();

  const dark = colorMode !== "light";

  return (
    <AntdStyledThemeProvider
      appearance={colorMode}
      theme={{
        algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm,

        token: {
          colorLink: dark ? "rgb(37, 194, 160)" : "rgb(46, 133, 85)",
          colorText: dark ? "rgb(128, 128, 128)" : "rgb(100, 102, 104)",
          colorTextLightSolid: dark
            ? "rgb(178, 178, 178)"
            : "rgb(100, 102, 104)",
          colorPrimary: dark ? "rgb(37, 194, 160)" : "rgb(46, 133, 85)",
          colorPrimaryHover: dark ? "rgb(33, 175, 144)" : "rgb(41, 120, 76)",
          colorPrimaryActive: dark ? "rgb(31, 165, 136)" : "rgb(39, 113, 72)",
          colorTextDescription: dark
            ? "rgb(128, 128, 128)"
            : "rgb(100, 102, 104)",
          colorBgLayout: dark ? "rgb(25, 25, 25)" : "rgb(240, 240, 240)",
          colorBgContainer: dark ? "rgb(30, 30, 30)" : "rgb(255, 255, 255)",
          colorBgElevated: dark ? "rgb(35, 35, 35)" : "rgb(248, 248, 248)",
          colorBgSpotlight: dark ? "rgb(35, 35, 35)" : "rgb(248, 248, 248)",
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
    </AntdStyledThemeProvider>
  );
}
