import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

const config: Config = {
  title: "heliannuuthus",
  tagline: "heliannuuthus",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://heliannuuthus.github.io/",
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
      const result = await params.defaultParseFrontMatter(params);

      // Process front matter description placeholders
      result.frontMatter.description =
        result.frontMatter.description?.replaceAll("{{MY_VAR}}", "MY_VALUE");

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
  presets: [
    [
      "classic",
      {
        docs: false,
        blog: {
          routeBasePath: "/",
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
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

  themeConfig: {
    navbar: {
      title: "heliannuuthus",
      logo: {
        alt: "heliannuuthus",
        src: "img/logo.svg",
      },
      items: [
        {
          href: "https://github.com/heliannuuthus",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
