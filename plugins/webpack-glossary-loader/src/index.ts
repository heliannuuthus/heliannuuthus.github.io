import { parse } from "heliannuuthus-parse-md";
import { store, TermMetadata } from "heliannuuthus-terminology-store";
import path from "path";
import type { LoaderContext } from "webpack";

interface WebpackGlossaryLoaderOptions {
  glossaryComponentPath: string;
  glossaryDir: string;
}

interface WebpackGlossaryLoaderContext extends LoaderContext<WebpackGlossaryLoaderOptions> {
  query: WebpackGlossaryLoaderOptions;
}

export default function loader(
  this: WebpackGlossaryLoaderContext,
  source: string
) {
  const importStatement = `
import Glossary from "${
    (this.query as WebpackGlossaryLoaderOptions).glossaryComponentPath
  }";
  
`;

  this.cacheable(false);
  this.addDependency(
    path.posix.join(
      (this.query as WebpackGlossaryLoaderOptions).glossaryDir,
      "glossary.json"
    )
  );
  this.emitFile(
    path.posix.join(
      (this.query as WebpackGlossaryLoaderOptions).glossaryDir,
      "glossary.json"
    ),
    JSON.stringify(store.terms)
  );

  const { content } = parse<TermMetadata>(source)[0];
  source = source.replace(content, importStatement + content);
  source += `
  
<Glossary />
`;
  return source;
}
