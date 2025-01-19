import { parse } from "heliannuuthus-parse-md";
import { store, TermMetadata, TermData } from "heliannuuthus-terminology-store";
import { unified } from "unified";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import type { LoaderContext } from "webpack";

interface WebpackTermsLoaderOptions {
  termsDir: string;
}

interface WebpackTermsLoaderContext
  extends LoaderContext<WebpackTermsLoaderOptions> {
  query: WebpackTermsLoaderOptions;
}

export default function loader(
  this: WebpackTermsLoaderContext,
  source: string,
) {
  const unixRegex = new RegExp(
    `(${this.query.termsDir
      .replace(/^\.\//, "")
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}.*?)\.(md|mdx)`,
  );

  const winRegex = new RegExp(
    `(${this.query.termsDir
      .replace(/\//g, "\\")
      .replace(/\./, "")
      .replace(/[*+?^${}()|[\]\\]/g, "\\$&")}.*?)\.(md|mdx)`,
  );

  const unixResourcePath = this.resourcePath;
  const winResourcePath = this.resourcePath.replace(/\\/, "\\\\");

  const termMatch =
    process.platform === "win32"
      ? winResourcePath.match(winRegex)
      : unixResourcePath.match(unixRegex);

  if (termMatch) {
    const terms = parse<TermMetadata>(source);
    const resourcePath = termMatch[1].replace(/\d+-/, "");
    const termMap = terms.reduce(
      (acc, term) => {
        acc[term.metadata.slug] = {
          ...term,
          metadata: {
            ...term.metadata,
            description: unified()
              .use(remarkParse)
              .use(remarkRehype)
              .use(rehypeSanitize)
              .use(rehypeStringify)
              .processSync(term.metadata.description)
              .toString("utf-8"),
            authors: term.metadata.authors || ["robot"],
          },
          content: unified()
            .use(remarkParse)
            .use(remarkRehype)
            .use(rehypeSanitize)
            .use(rehypeStringify)
            .processSync(term.content)
            .toString("utf-8"),
        };

        return acc;
      },
      {} as Record<string, TermData>,
    );

    store.addTerm(resourcePath, termMap);
    this.emitFile(resourcePath + ".json", JSON.stringify(termMap));

    return `
    
import Terminology from "@site/src/components/Terminology";

<Terminology />
`;
  }
  return source;
}
