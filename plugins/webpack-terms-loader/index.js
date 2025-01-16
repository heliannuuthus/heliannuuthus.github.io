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
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}.*?)\.(md|mdx)`
  );
  const winRegex = new RegExp(
    `(${this.query.termsDir
      .replace(/\//g, "\\")
      .replace(/\./, "")
      .replace(/[*+?^${}()|[\]\\]/g, "\\$&")}.*?)\.(md|mdx)`
  );
  const unixResourcePath = this.resourcePath;
  const winResourcePath = this.resourcePath.replace(/\\/, "\\\\");

  const termMatch =
    process.platform === "win32"
      ? winResourcePath.match(winRegex)
      : unixResourcePath.match(unixRegex);

  if (termMatch) {
    const data = parseMD(source);
    const resourcePath = termMatch[1].replace(/\d+-/, "");
    data.map(async (element) => {
      element.metadata.hoverText = element.metadata.hoverText
        ? String(
            unified()
              .use(remarkParse)
              .use(remarkRehype)
              .use(rehypeSanitize)
              .use(rehypeStringify)
              .processSync(element.metadata.hoverText)
          )
        : "";
      const termPath = resourcePath + `/${element.metadata.id}`;
      store.addTerm(termPath, element);
      this.emitFile(termPath + ".json", JSON.stringify(element));
    });
  }
  return source;
}
