import { parseMD } from "heliannuuthus-parse-md";
import { store } from "heliannuuthus-terminology-store";
import path from "path";
import { pkgUpSync } from "pkg-up";
const pkg = pkgUpSync({ cwd: process.cwd() });
const root =
  process.platform === "win32" ? path.win32.dirname(pkg) : path.dirname(pkg);

export default function (source) {
  const urlsRegex = /(?<!!)\[[^\]]+\]\([^)]+\)/g;
  const urlRegex = /\[\s*(.*?)\s*\]\((.*?)\)/s;
  const urls = source.match(urlsRegex) || [];
  const importStatement = `
import Term from "${this.query.termPreviewComponentPath}";

  `;
  if (urls.length > 0) {
    const { content } = parseMD(source)[0];
    source = source.replace(content, importStatement + content);
    for (const url of urls) {
      const [mdUrl, title, urlPath] = url.match(urlRegex);
      const newLineRegex = /\n/g;
      const newLineCount = (title.match(newLineRegex) || []).length;
      if (newLineCount <= 1) {
        const rel_path =
          process.platform === "win32"
            ? path.win32.relative(root, this.resourcePath)
            : path.relative(root, this.resourcePath);
        const pathName = new URL(
          urlPath,
          `http://heliannuuthus.com/${rel_path}`
        ).pathname;
        if (pathName.includes(this.query.termsDir.replace(/\./, ""))) {
          const termKey =
            this.query.baseUrl.replace(/\/$/, "") +
            pathName.replace(/\.(md|mdx)$/, "");
          source = source.replace(
            mdUrl,
            `<Term path="${termKey.replace(/\d+-/, "")}">${title}</Term>`
          );
        }
      }
    }
  }

  return source;
}
