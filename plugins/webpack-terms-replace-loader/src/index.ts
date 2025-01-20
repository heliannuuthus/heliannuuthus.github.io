import { parse } from "heliannuuthus-parse-md";
import { TermMetadata } from "heliannuuthus-terminology-store";
import path from "path";
import { packageUpSync } from "package-up";
import type { LoaderContext } from "webpack";

interface WebpackTermsReplaceLoaderOptions {
  termPreviewComponentPath: string;
  termsDir: string;
  baseUrl: string;
}

interface WebpackTermsReplaceLoaderContext
  extends LoaderContext<WebpackTermsReplaceLoaderOptions> {
  query: WebpackTermsReplaceLoaderOptions;
}

const pkg = packageUpSync({ cwd: process.cwd() }) as string;
const root =
  process.platform === "win32" ? path.win32.dirname(pkg) : path.dirname(pkg);

export default function loader(
  this: WebpackTermsReplaceLoaderContext,
  source: string,
) {
  const urlsRegex = /(?<!!)\[\[[^\]]+\]\]\([^)]+\)/g;
  const urlRegex = /\[\[\s*(.*?)\s*\]\]\((.*?)\)/s;
  const urls = source.match(urlsRegex) || [];
  const importStatement = `

import Term from "${this.query.termPreviewComponentPath}";

`;
  if (urls.length > 0) {
    const { content } = parse<TermMetadata>(source)[0];
    source = source.replace(content, importStatement + content);

    for (const url of urls) {
      const matches = url.match(urlRegex);
      if (!matches) continue;

      const [mdUrl, title, urlPath] = matches;
      const newLineCount = (title.match(/\n/g) || []).length;
      if (newLineCount <= 1) {
        const rel_path =
          process.platform === "win32"
            ? path.win32.relative(root, this.resourcePath)
            : path.relative(root, this.resourcePath);
        const url = new URL(urlPath, `http://heliannuuthus.com/${rel_path}`);

        const termKey =
          this.query.baseUrl.replace(/\/$/, "") +
          url.pathname.replace(/\.(md|mdx)$/, "");
        source = source.replace(
          mdUrl,
          `<Term path="${termKey.replace(/\d+-/, "")}" anchor="${
            url.hash
          }">${title}</Term>`,
        );
      }
    }
  }

  return source;
}
