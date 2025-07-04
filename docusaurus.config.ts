import remarkAdmonition, { origins } from "heliannuuthus-remark-admomition";
import remarkBreaks from "heliannuuthus-remark-breaks";
import {
  plugin as remarkCollapseHeading,
  preprocessorPlugin as remarkCollapseHeadingPreprocessor
} from "heliannuuthus-remark-collapse-heading";
import remarkCommentTooltip from "heliannuuthus-remark-comment-tooltip";
import remarkExternalLink from "heliannuuthus-remark-external-link";
import remarkTerminology from "heliannuuthus-remark-terminology";
import path from "path";
import { themes as prismThemes } from "prism-react-renderer";
import rehypeKatex from "rehype-katex";
import remarkCodeImport from "remark-code-import";
import remarkDirective from "remark-directive";
import remarkMath from "remark-math";

import type { Options as BlogPluginOptions } from "@docusaurus/plugin-content-blog";
import type { Options as PagePluginOptions } from "@docusaurus/plugin-content-pages";
import type { Options as SVGRPluginOptions } from "@docusaurus/plugin-svgr";
import type { Config, ThemeConfig } from "@docusaurus/types";

const beforeDefaultRemarkPlugins = [remarkCollapseHeadingPreprocessor];

const remarkPlugins = [
  remarkDirective,
  remarkTerminology,
  [
    remarkExternalLink,
    {
      href: "/external-link",
      target: "_blank",
      rel: ["noopener", "noreferrer"],
      test: (node: any) => node.url.startsWith("http")
    }
  ],
  remarkCommentTooltip,
  [remarkAdmonition, { admonition: "TermAdmonition" }],
  remarkCodeImport,
  remarkBreaks,
  remarkMath,
  remarkCollapseHeading
];

const rehypePlugins = [rehypeKatex];

const blogConfig = {
  beforeDefaultRemarkPlugins,
  remarkPlugins,
  rehypePlugins,
  admonitions: {
    keywords: [...origins, "thinking", "nerd"],
    extendDefaults: true
  },
  blogSidebarTitle: "最近的发布",
  showReadingTime: true,
  showLastUpdateAuthor: true,
  showLastUpdateTime: true,
  feedOptions: {
    type: ["rss", "atom"],
    xslt: true
  },
  authorsMapPath: "../static/authors.yml",
  tags: "../static/tags.yml",
  // Please change this to your repo.
  // Remove this to remove the "edit this page" links.
  editUrl:
    "https://github.com/heliannuuthus/heliannuuthus.github.io/tree/master/",
  // Useful options to enforce blogging best practices
  onInlineTags: "warn",
  onInlineAuthors: "warn",
  onUntruncatedBlogPosts: "warn"
} as BlogPluginOptions;

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
    locales: ["en"]
  },
  customFields: {
    editUrl:
      "https://github.com/heliannuuthus/heliannuuthus.github.io/edit/master"
  },
  markdown: {
    mermaid: true,
    parseFrontMatter: async (params) => {
      // Reuse the default parser
      if (params.filePath.includes("/terminologies/")) {
        return {
          frontMatter: {
            slug: path.relative(
              "terminologies",
              params.filePath
                .replace(/^terminologies/, "")
                .replace(/\.mdx?$/, "")
            ),
            title: `${path.basename(
              params.filePath,
              path.extname(params.filePath)
            )}-terminology`,
            authors: ["robot"],
            description: `This is a glossary generated by code logic.`,
            unlisted: true
          },
          content:
            "This is a glossary generated by code logic. \n <!--truncate--> \n" +
            params.fileContent
        };
      }
      const result = await params.defaultParseFrontMatter(params);

      if (
        [`/_contents/`, `/_partials/`].some((path) =>
          params.filePath.includes(path)
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
    }
  },
  themes: [
    [
      "@docusaurus/theme-classic",
      {
        customCss: "./src/css/custom.css"
      }
    ],
    "@docusaurus/theme-mermaid",
    "@docusaurus/theme-search-algolia"
  ],
  plugins: [
    [
      "@docusaurus/plugin-content-pages",
      {
        id: "pages",
        path: "src/pages",
        routeBasePath: "/"
      } satisfies PagePluginOptions
    ],
    [
      "@docusaurus/plugin-content-pages",
      {
        id: "terminologies",
        path: "terminologies",
        routeBasePath: "/terms",
        include: ["**/*.mdx"]
      } satisfies PagePluginOptions
    ],
    [
      "@docusaurus/plugin-content-blog",
      {
        ...blogConfig,
        id: "blog",
        routeBasePath: "blog",
        path: "blog"
      } satisfies BlogPluginOptions
    ],
    [
      "@docusaurus/plugin-content-blog",
      {
        ...blogConfig,
        id: "essay",
        routeBasePath: "essay",
        path: "essay"
      } satisfies BlogPluginOptions
    ],
    [
      "@docusaurus/plugin-svgr",
      {
        svgrConfig: {}
      } satisfies SVGRPluginOptions
    ],

    [
      require.resolve("heliannuuthus-docusaurus-terminology"),
      {
        path: "terminologies",
        routeBasePath: "terms",
        glossaries: "./static/terminologies.yml",
        glossaryComponentPath: "@site/src/components/terminology/Terminology"
      }
    ],
    [
      require.resolve("heliannuuthus-docusaurus-authors"),
      { path: "./static/authors.yml" }
    ]
  ],
  themeConfig: {
    algolia: {
      apiKey: "25a6aa2d5c42b85c82ea37489d116162",
      indexName: "heliannuuthusio",
      appId: "VB0X62ZNK3",
      contextualSearch: true
    },
    mermaid: {
      theme: { light: "neutral", dark: "forest" },
      options: {
        layout: "elk",
        look: "handDrawn",
        themeVariables: {
          fontFamily: "Noto Sans SC"
        },
        xyChart: {
          titleFontSize: "14px",
          width: 500,
          height: 350,
          xAxis: {
            titleFontSize: "12px"
          },
          yAxis: {
            titleFontSize: "12px"
          }
        }
      }
    },
    navbar: {
      title: "heliannuuthus",
      logo: {
        alt: "heliannuuthus",
        src: "img/logo.svg"
      },
      items: [
        { to: "blog/", label: "Blog", position: "left" },
        { to: "essay/", label: "Essay", position: "left" },
        { to: "terms/", label: "Terminology", position: "left" },
        {
          to: "/learning-route",
          label: "Learning Route",
          position: "right"
        },
        {
          type: "dropdown",
          label: "OpenSource",
          position: "right",
          items: [
            {
              to: "https://github.com/heliannuuthus/captcha",
              label: "Captcha",
              description:
                "Captcha is a node service for generating captcha images."
            }
          ]
        },
        {
          type: "search",
          position: "right"
        },
        {
          href: "https://github.com/heliannuuthus",
          position: "right",
          className: "header-github-link",
          "aria-label": "GitHub repository"
        }
      ]
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 5
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
        "sql"
      ],
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      magicComments: [
        {
          className: "theme-code-block-highlighted-line",
          line: "highlight-next-line",
          block: { start: "highlight-start", end: "highlight-end" }
        },
        {
          className: "code-block-important",
          line: "important line"
        }
      ]
    }
  } satisfies ThemeConfig
};

export default config;
