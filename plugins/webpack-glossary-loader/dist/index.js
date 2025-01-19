// src/index.ts
import { parse } from "heliannuuthus-parse-md";
import { store } from "heliannuuthus-terminology-store";
import path from "path";
function loader(source) {
  const importStatement = `
import Glossary from "${this.query.glossaryComponentPath}";
  
`;
  this.cacheable(false);
  this.addDependency(
    path.posix.join(
      this.query.glossaryDir,
      "glossary.json"
    )
  );
  this.emitFile(
    path.posix.join(
      this.query.glossaryDir,
      "glossary.json"
    ),
    JSON.stringify(store.terms)
  );
  const { content } = parse(source)[0];
  source = source.replace(content, importStatement + content);
  source += `
  
<Glossary />
`;
  return source;
}
export {
  loader as default
};
//# sourceMappingURL=index.js.map