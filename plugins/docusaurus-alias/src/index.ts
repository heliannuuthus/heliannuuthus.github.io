import path from "path";

import type { LoadContext, Plugin } from "@docusaurus/types";

interface Alias {
  alias: string;
  path: string;
  sub?: Alias[];
}

interface AliasPluginOptions {
  aliases?: Alias[];
}

const dfs = (
  context: LoadContext,
  parent: string,
  aliases: Alias[],
  allAliases: Record<string, string>
) => {
  aliases.forEach((alias) => {
    if (allAliases[alias.alias]) {
      console.warn(`Alias ${alias.alias} already exists, skipping...`);
      return;
    }
    const fullPath = path.join(parent, alias.path);
    allAliases[alias.alias] = fullPath;
    if (alias.sub && alias.sub.length > 0)
      dfs(context, fullPath, alias.sub, allAliases);
  });
};

export default function aliasPlugin(
  context: LoadContext,
  options: AliasPluginOptions = {}
): Plugin<void> {
  const { aliases = [] } = options;
  const allAliases: Record<string, string> = {};

  dfs(context, context.siteDir, aliases, allAliases);
  console.log("loaded path aliases", allAliases);
  return {
    name: "alias-docusaurus-plugin",

    configureWebpack(_, __, ___) {
      return {
        resolve: {
          alias: allAliases
        }
      };
    },

    configurePostCss(postCssOptions) {
      return {
        ...postCssOptions,
        plugins: [...(postCssOptions.plugins || [])]
      };
    }
  };
}
