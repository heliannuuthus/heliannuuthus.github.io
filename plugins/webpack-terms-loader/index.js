import { parseMD } from "heliannuuthus-parse-md";
import { store } from "heliannuuthus-terminology-store";
import { unified } from "unified";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";

export default function (source) {
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
    const terms = parseMD(source);
    const resourcePath = termMatch[1].replace(/\d+-/, "");
    const termData = terms.reduce((acc, term) => {
      acc[term.metadata.id] = {
        ...term,
        metadata: {
          ...term.metadata,
          hoverText: term.metadata.hoverText
            ? String(
                unified()
                  .use(remarkParse)
                  .use(remarkRehype)
                  .use(rehypeSanitize)
                  .use(rehypeStringify)
                  .processSync(term.metadata.hoverText),
              )
            : "",
        },
      };
      return acc;
    }, {});

    store.addTerm(resourcePath, termData);
    this.emitFile(resourcePath + ".json", JSON.stringify(termData));

    return `

import Terminology from "@site/src/components/Terminology";

<Terminology />

`;
  }
  return source;
}
