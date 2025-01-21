var __require = /* @__PURE__ */ ((x) =>
  typeof require !== "undefined"
    ? require
    : typeof Proxy !== "undefined"
      ? new Proxy(x, {
          get: (a, b) => (typeof require !== "undefined" ? require : a)[b],
        })
      : x)(function (x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// src/index.ts
import fs from "fs";
async function DocusaurusTerminologyPlugin(context, options) {
  try {
    fs.rm("node_modules/.cache", { recursive: true }, (err) => {
      if (err) {
        console.error(err);
      }
    });
  } catch (err) {}
  return {
    name: "terminology-docusaurus-plugin",
    configureWebpack(config, isServer, utils) {
      options.baseUrl = config.output?.publicPath;
      if (!options.resolved) {
        for (const term in options.glossaryTerms) {
          options.glossaryTerms[`${config.output?.publicPath}${term}`] =
            options.glossaryTerms[term];
          delete options.glossaryTerms[term];
        }
      }
      options.resolved = true;
      let rule = (config.module?.rules).find((rule2) => {
        return (
          rule2.use &&
          Array.isArray(rule2.use) &&
          rule2.use.some(
            (kider) =>
              typeof kider === "object" &&
              typeof kider.loader === "string" &&
              kider.loader.includes("plugin-content-docs"),
          )
        );
      });
      if (!rule) {
        rule = (config.module?.rules).find((rule2) => {
          return (
            rule2.use &&
            Array.isArray(rule2.use) &&
            rule2.use.some(
              (kider) =>
                typeof kider === "object" &&
                typeof kider.loader === "string" &&
                kider.loader.includes("mdx-loader"),
            )
          );
        });
      }
      if (!rule) {
        rule = (config.module?.rules).find((rule2) => {
          if (!rule2.test) return false;
          const ruleRegExp = new RegExp(rule2.test);
          return ruleRegExp.test("test.md") && ruleRegExp.test("test.mdx");
        });
      }
      if (rule && Array.isArray(rule.use)) {
        rule.use.push(
          {
            loader: __require.resolve("heliannuuthus-webpack-terms-loader"),
            options,
          },
          {
            loader: __require.resolve(
              "heliannuuthus-webpack-terms-replace-loader",
            ),
            options,
          },
        );
      }
      return {
        mergeStrategy: { module: "replace" },
        module: config.module,
      };
    },
  };
}
export { DocusaurusTerminologyPlugin as default };
//# sourceMappingURL=index.js.map
