import fs from "fs";
import path from "path";
import type { Configuration, RuleSetRule, RuleSetUseItem } from "webpack";

export interface DocusaurusContext {
  baseUrl: string;
  siteDir: string;
  generatedFilesDir: string;
  i18n: {
    currentLocale: string;
  };
}

export interface WebpackRule extends RuleSetRule {
  oneOf?: RuleSetRule[];
  use?: RuleSetUseItem[] | RuleSetUseItem;
}

export interface ConfigureWebpackUtils {
  getStyleLoaders: (...args: any[]) => any[];
  getCacheLoader: (...args: any[]) => any;
  getBabelLoader: (...args: any[]) => any;
}

export interface TerminologyOptions {
  termsDir: string;
  glossaryFilepath: string;
  baseUrl?: string;
  resolved?: boolean;
  glossaryTerms?: Record<string, any>;
  termPreviewComponentPath?: string;
  glossaryComponentPath?: string;
  glossaryDir?: string;
}

export default async function DocusaurusTerminologyPlugin(
  context: DocusaurusContext,
  options: TerminologyOptions,
) {
  const unixFormattedTermsPath = options.termsDir
    .replace(/^\.\//, "")
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const winFormattedTermsPath = options.termsDir
    .replace(/\//g, "\\")
    .replace(/\./, "")
    .replace(/[*+?^${}()|[\]\\]/g, "\\$&");

  const termsPath =
    process.platform === "win32"
      ? winFormattedTermsPath
      : unixFormattedTermsPath;

  const termsRegex = new RegExp(`${termsPath}.*?\.mdx?$`);

  const unixFormattedGlossaryPath = options.glossaryFilepath
    .replace(/^\.\//, "")
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const winFormattedGlossaryPath = options.glossaryFilepath
    .replace(/\//g, "\\")
    .replace(/\./, "")
    .replace(/[*+?^${}()|[\]\\]/g, "\\$&");

  const glossaryPath =
    process.platform === "win32"
      ? winFormattedGlossaryPath
      : unixFormattedGlossaryPath;

  const glossaryRegex = new RegExp(`${glossaryPath}`);

  try {
    fs.rm("node_modules/.cache", { recursive: true }, (err) => {
      if (err) {
        console.error(err);
      }
    });
  } catch (err) {}

  return {
    name: "terminology-docusaurus-plugin",
    configureWebpack(
      config: Configuration,
      isServer: boolean,
      utils: ConfigureWebpackUtils,
    ) {
      options.baseUrl = config.output?.publicPath as string;

      if (!options.resolved) {
        for (const term in options.glossaryTerms) {
          options.glossaryTerms[`${config.output?.publicPath}${term}`] =
            options.glossaryTerms[term];
          delete options.glossaryTerms[term];
        }
      }
      options.resolved = true;

      let rule = (config.module?.rules as WebpackRule[]).find((rule) => {
        return (
          rule.use &&
          Array.isArray(rule.use) &&
          rule.use.some(
            (kider: RuleSetUseItem) =>
              typeof kider === "object" &&
              typeof kider.loader === "string" &&
              kider.loader.includes("plugin-content-docs"),
          )
        );
      });

      if (!rule) {
        rule = (config.module?.rules as WebpackRule[]).find((rule) => {
          return (
            rule.use &&
            Array.isArray(rule.use) &&
            rule.use.some(
              (kider: RuleSetUseItem) =>
                typeof kider === "object" &&
                typeof kider.loader === "string" &&
                kider.loader.includes("mdx-loader"),
            )
          );
        });
      }

      if (!rule) {
        rule = (config.module?.rules as WebpackRule[]).find((rule) => {
          if (!rule.test) return false;
          const ruleRegExp = new RegExp(rule.test as string);
          return ruleRegExp.test("test.md") && ruleRegExp.test("test.mdx");
        });
      }

      if (rule && Array.isArray(rule.use)) {
        rule.oneOf = [
          {
            test: termsRegex,
            enforce: "pre",
            use: [
              {
                loader: require.resolve("heliannuuthus-webpack-terms-loader"),
                options,
              },
            ],
          },
          {
            test: glossaryRegex,
            enforce: "pre",
            use: [
              {
                loader: require.resolve(
                  "heliannuuthus-webpack-glossary-loader",
                ),
                options,
              },
            ],
          },
        ];

        rule.use.push({
          loader: require.resolve("heliannuuthus-webpack-terms-replace-loader"),
          options,
        });
      }

      return {
        mergeStrategy: { module: "replace" },
        module: config.module,
      };
    },
  };
}
