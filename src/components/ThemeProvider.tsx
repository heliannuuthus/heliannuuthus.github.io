import { theme } from "antd";
import {
  ThemeProvider as AntdStyledThemeProvider,
  ThemeProviderProps
} from "antd-style";
import { useEffect, useState } from "react";

// 自定义 Hook，用于监听 <html> 元素上 data-theme 属性的变化
export const useHtmlTheme = () => {
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
      attributeFilter: ["data-theme"]
    });
    return () => {
      observer.disconnect();
    };
  }, []);

  return theme;
};

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
          colorLink: dark ? "#29784c" : "#2e8555",
          colorText: dark ? "rgb(128, 128, 128)" : "rgb(100, 102, 104)",
          colorTextLightSolid: dark
            ? "rgb(178, 178, 178)"
            : "rgb(100, 102, 104)",
          colorPrimary: dark ? "#29784c" : "#33925d",
          colorPrimaryHover: dark ? "#277148" : "#359962",
          colorPrimaryActive: dark ? "#205d3b" : "#3cad6e",
          colorTextDescription: dark
            ? "rgb(128, 128, 128)"
            : "rgb(100, 102, 104)",
          colorBgLayout: dark ? "rgb(25, 25, 25)" : "rgb(240, 240, 240)",
          colorBgContainer: dark ? "rgb(30, 30, 30)" : "rgb(255, 255, 255)",
          colorBgElevated: dark ? "rgb(35, 35, 35)" : "rgb(248, 248, 248)",
          colorBgSpotlight: dark ? "rgb(35, 35, 35)" : "rgb(248, 248, 248)",
          fontSize: 15,
          fontSizeHeading1: 38,
          fontSizeHeading2: 30,
          fontSizeHeading3: 24,
          fontSizeHeading4: 20,
          fontSizeHeading5: 16,
          fontFamily: "var(--ifm-font-family-base)"
        },
        components: {
          Message: {
            contentBg: dark ? "rgb(30, 30, 30)" : "rgb(240, 240, 240)"
          },
          Steps: {},
          Table: {},
          Layout: {
            headerBg: dark ? "rgb(30, 30, 30)" : "rgb(240, 240, 240)"
          }
        }
      }}
    >
      {children}
    </AntdStyledThemeProvider>
  );
}
