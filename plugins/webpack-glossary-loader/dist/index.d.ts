import { LoaderContext } from "webpack";

interface WebpackGlossaryLoaderOptions {
  glossaryComponentPath: string;
  glossaryDir: string;
}
interface WebpackGlossaryLoaderContext
  extends LoaderContext<WebpackGlossaryLoaderOptions> {
  query: WebpackGlossaryLoaderOptions;
}
declare function loader(
  this: WebpackGlossaryLoaderContext,
  source: string,
): string;

export { loader as default };
