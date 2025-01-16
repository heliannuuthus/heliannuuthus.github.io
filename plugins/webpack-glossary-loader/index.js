import { parseMD } from "heliannuuthus-parse-md";
import { store } from "heliannuuthus-terminology-store";
import path from "path";

export default function (source) {
  const importStatement = `

import Glossary from "${this.query.glossaryComponentPath}";

`;
  this.cacheable(false);
  this.addDependency(path.posix.join(this.query.docsDir, "glossary.json"));
  this.emitFile(
    path.posix.join(this.query.docsDir, "glossary.json"),
    JSON.stringify(store.terms),
  );
  const { content } = parseMD(source)[0];
  source = source.replace(content, importStatement + content);
  source += `
<Glossary />

`;
  return source;
}
