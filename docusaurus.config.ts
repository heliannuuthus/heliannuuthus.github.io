import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";
import rehypeKatex from "rehype-katex";
import remarkBreaks from "remark-breaks";
import remarkCodeImport from "remark-code-import";
import remarkMath from "remark-math";
import remarkCommentTooltip from "heliannuuthus-remark-comment-tooltip";
import remarkExternalLink from "heliannuuthus-remark-external-link";
import remarkDirective from "remark-directive";
import remarkAdmonition from "heliannuuthus-remark-admomition";
import remarkTerminology from "heliannuuthus-remark-terminology";
import path from "path";

const config: Config = {
  title: "heliannuuthus",
  tagline: "heliannuuthus",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://site.heliannuuthus.com/",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "heliannuuthus", // Usually your GitHub org/user name.
  projectName: "heliannuuthus.github.io", // Usually your repo name.
  trailingSlash: false,

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  markdown: {
    mermaid: true,
    parseFrontMatter: async (params) => {
      // Reuse the default parser
      if (params.filePath.includes("/terms/")) {
        return {
          frontMatter: {
            slug: path.relative(
              "blog",
              params.filePath.replace(/^blog/, "").replace(/\.mdx?$/, ""),
            ),
            title: `${path.basename(
              params.filePath,
              path.extname(params.filePath),
            )}-terminology`,
            authors: ["robot"],
            description: `This is a glossary generated by code logic.`,
            unlisted: true,
          },
          content:
            "This is a glossary generated by code logic. \n <!--truncate--> \n" +
            params.fileContent,
        };
      }
      const result = await params.defaultParseFrontMatter(params);

      if (
        [`/_contents/`, `/_partials/`].some((path) =>
          params.filePath.includes(path),
        )
      ) {
        result.frontMatter = {};
        return result;
      }

      // Create your own front matter shortcut
      if (result.frontMatter.i_do_not_want_docs_pagination) {
        result.frontMatter.pagination_prev = null;
        result.frontMatter.pagination_next = null;
      }

      // Rename an unsupported front matter coming from another system
      if (result.frontMatter.cms_seo_summary) {
        result.frontMatter.description = result.frontMatter.cms_seo_summary;
        delete result.frontMatter.cms_seo_summary;
      }
      return result;
    },
  },
  themes: ["@docusaurus/theme-mermaid"],
  presets: [
    [
      "classic",
      {
        docs: false,
        blog: {
          remarkPlugins: [
            remarkDirective,
            remarkTerminology,
            remarkCommentTooltip,
            [
              remarkAdmonition,
              {
                admonition: "TermAdmonition",
              },
            ],
            remarkCodeImport,
            remarkBreaks,
            remarkMath,
          ],
          rehypePlugins: [
            rehypeKatex,
            [
              remarkExternalLink,
              {
                href: "/external-link",
                target: "_blank",
                rel: ["noopener", "noreferrer"],
                test: (node: any) => node.url.startsWith("http"),
              },
            ],
          ],
          blogSidebarTitle: "最近的发布",
          routeBasePath: "blog",
          showReadingTime: true,
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/heliannuuthus/heliannuuthus.github.io/tree/master/",
          // Useful options to enforce blogging best practices
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],
  plugins: [
    [
      require.resolve("heliannuuthus-docusaurus-terminology"),
      {
        termsDir: "blog/terms",
        docsDir: "blog",
        termPreviewComponentPath: "@site/src/components/terms/TermPreview.tsx",
        glossaryComponentPath: "@site/src/components/terms/Terminology.tsx",
      },
    ],
    [
      require.resolve("heliannuuthus-docusaurus-authors"),
      { path: "./blog/authors.yml" },
    ],
  ],
  themeConfig: {
    algolia: {
      apiKey: "25a6aa2d5c42b85c82ea37489d116162",
      indexName: "heliannuuthusio",
      appId: "VB0X62ZNK3",
      contextualSearch: true,
    },
    mermaid: {
      theme: { light: "neutral", dark: "forest" },
      options: {
        layout: "elk",
        look: "handDrawn",
        themeVariables: {
          fontFamily: "Noto Sans SC",
        },
        xyChart: {
          titleFontSize: "14px",
          width: 500,
          height: 350,
          xAxis: {
            titleFontSize: "12px",
          },
          yAxis: {
            titleFontSize: "12px",
          },
        },
      },
    },
    navbar: {
      title: "heliannuuthus",
      logo: {
        alt: "heliannuuthus",
        src: "img/logo.svg",
      },
      items: [
        { to: "blog/", label: "Blog", position: "left" },
        {
          type: "dropdown",
          label: "OpenSource",
          position: "left",
          items: [
            {
              to: "https://github.com/heliannuuthus/captcha",
              label: "Captcha",
              description:
                "Captcha is a node service for generating captcha images.",
            },
          ],
        },
        {
          type: "search",
          position: "right",
        },
        {
          href: "https://github.com/heliannuuthus",
          position: "right",
          className: "header-github-link",
          "aria-label": "GitHub repository",
        },
      ],
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 5,
    },
    prism: {
      additionalLanguages: [
        "java",
        "javadoc",
        "rust",
        "go",
        "bash",
        "python",
        "http",
        "sql",
      ],
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      magicComments: [
        {
          className: "theme-code-block-highlighted-line",
          line: "highlight-next-line",
          block: { start: "highlight-start", end: "highlight-end" },
        },
        {
          className: "code-block-important",
          line: "important line",
        },
      ],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
