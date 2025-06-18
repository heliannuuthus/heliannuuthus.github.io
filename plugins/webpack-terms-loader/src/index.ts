import { createHash } from "crypto";
import { parse } from "heliannuuthus-parse-md";
import { TermData, TermMetadata, store } from "heliannuuthus-terminology-store";
import type { LoaderContext } from "webpack";

interface WebpackTermsLoaderOptions {
  path: string;
  routeBasePath: string;
  glossaryComponentPath: string;
}

interface WebpackTermsLoaderContext
  extends LoaderContext<WebpackTermsLoaderOptions> {
  query: WebpackTermsLoaderOptions;
}

export default async function loader(
  this: WebpackTermsLoaderContext,
  source: string
) {
  this.cacheable(false);
  const unixRegex = new RegExp(
    `(${this.query.path
      .replace(/^\.\//, "")
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}.*?)\.(md|mdx)`
  );
  const winRegex = new RegExp(
    `(${this.query.path
      .replace(/\//g, "\\")
      .replace(/\./, "")
      .replace(/[*+?^${}()|[\]\\]/g, "\\$&")}.*?)\.(md|mdx)`
  );

  const unixResourcePath = this.resourcePath;
  const winResourcePath = this.resourcePath.replace(/\\/, "\\\\");
  const matchs =
    process.platform === "win32"
      ? winResourcePath.match(winRegex)
      : unixResourcePath.match(unixRegex);
  if (matchs) {
    const terms = parse<TermMetadata>(source);
    const resourcePath = matchs[1].replace(/\d+-/, "");
    const termMap = terms.reduce(
      (acc, term) => {
        acc[term.metadata.slug] = {
          ...term,
          metadata: {
            ...term.metadata,
            description: term.metadata.description,
            authors: term.metadata.authors || ["robot"]
          },
          content: term.content
        };
        return acc;
      },
      {} as Record<string, TermData>
    );
    store.addTerm(resourcePath.replace(this.query.path, ""), termMap);
    this.emitFile(
      resourcePath.replace(this.query.path, this.query.routeBasePath) + ".json",
      JSON.stringify(termMap)
    );
    return `

import Terminology from "${this.query.glossaryComponentPath}";

<Terminology />
`;
  }
  return source;
}
