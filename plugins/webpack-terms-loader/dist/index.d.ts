import { LoaderContext } from "webpack";

interface WebpackTermsLoaderOptions {
  termsDir: string;
}
interface WebpackTermsLoaderContext
  extends LoaderContext<WebpackTermsLoaderOptions> {
  query: WebpackTermsLoaderOptions;
}
declare function loader(
  this: WebpackTermsLoaderContext,
  source: string,
): string;

export { loader as default };
