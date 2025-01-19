import { LoaderContext } from 'webpack';

interface WebpackTermsReplaceLoaderOptions {
    termPreviewComponentPath: string;
    termsDir: string;
    baseUrl: string;
}
interface WebpackTermsReplaceLoaderContext extends LoaderContext<WebpackTermsReplaceLoaderOptions> {
    query: WebpackTermsReplaceLoaderOptions;
}
declare function loader(this: WebpackTermsReplaceLoaderContext, source: string): string;

export { loader as default };
