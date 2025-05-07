import fs from "fs";
import path from "path";
import type { Plugin } from "@docusaurus/types";
import type { RuleSetRule, RuleSetUseItem } from "webpack";
import yaml from "js-yaml";
import { SlowBuffer } from "buffer";
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
  path: string;
  glossaries: string;
  routeBasePath?: string;
  glossaryComponentPath?: string;
}

export interface Terminology {
  slug: string;
  name: string;
  description: string;
  authors: string[];
  path: string;
}

export default async function DocusaurusTerminologyPlugin(
  context: DocusaurusContext,
  options: TerminologyOptions
): Promise<Plugin<{ terminologies: Record<string, Terminology> }>> {
  try {
    fs.stat("node_modules/.cache", (err, stats) => {
      if (err) {
        console.error(err);
        return;
      } else if (stats.isDirectory()) {
        fs.rm("node_modules/.cache", { recursive: true }, (err) => {
          if (err) {
            console.error(err);
          }
        });
      }
    });
  } catch (err) {
    console.error(err);
  }
  return {
    name: "terminology-docusaurus-plugin",
    configureWebpack(config, isServer, utils, content) {
      const rules = config.module?.rules as WebpackRule[];
      let rule = rules.find((rule) => {
        if (!options.path) {
          return false;
        }
        const targetPath = path.resolve(process.cwd(), options.path);
        return (
          rule.include &&
          Array.isArray(rule.include) &&
          rule.include.some((include) =>
            include.toString().includes(targetPath)
          ) &&
          rule.use &&
          Array.isArray(rule.use) &&
          rule.use.some(
            (kider: RuleSetUseItem) =>
              typeof kider === "object" &&
              typeof kider.loader === "string" &&
              kider.loader.includes("mdx-loader")
          )
        );
      });

      if (
        rule &&
        Array.isArray(rule.use) &&
        !rules.find((r) => {
          return (
            r.use &&
            Array.isArray(r.use) &&
            r.use.some(
              (kider: RuleSetUseItem) =>
                typeof kider === "object" &&
                typeof kider.loader === "string" &&
                kider.loader.includes("heliannuuthus-webpack-terms-loader")
            )
          );
        })
      ) {
        rule.use.push({
          loader: require.resolve("heliannuuthus-webpack-terms-loader"),
          options,
        });
      }
      return {
        mergeStrategy: { module: "replace" },
        module: config.module,
      };
    },
    async loadContent() {
      const terminologiesPath = path.resolve(
        context.siteDir,
        options.glossaries
      );
      const terminologies = yaml.load(
        fs.readFileSync(terminologiesPath, "utf8")
      ) as Record<string, Terminology>;
      Object.entries(terminologies).forEach(([key, terminology]) => {
        terminology.path = path.join(
          options.path || "terminology",
          key.toLowerCase().replace(/ /g, "-")
        );
        terminology.slug = path.join(
          options.routeBasePath || "terms",
          key.toLowerCase().replace(/ /g, "-")
        );
      });
      return {
        terminologies,
      };
    },
    async contentLoaded({ content, actions }) {
      actions.setGlobalData({
        terminologies: (
          content as { terminologies: Record<string, Terminology> }
        ).terminologies,
      });
    },
  };
}
