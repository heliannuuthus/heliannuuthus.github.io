import * as webpack from 'webpack';
import { RuleSetRule, RuleSetUseItem, Configuration } from 'webpack';

interface DocusaurusContext {
    baseUrl: string;
    siteDir: string;
    generatedFilesDir: string;
    i18n: {
        currentLocale: string;
    };
}
interface WebpackRule extends RuleSetRule {
    oneOf?: RuleSetRule[];
    use?: RuleSetUseItem[] | RuleSetUseItem;
}
interface ConfigureWebpackUtils {
    getStyleLoaders: (...args: any[]) => any[];
    getCacheLoader: (...args: any[]) => any;
    getBabelLoader: (...args: any[]) => any;
}
interface TerminologyOptions {
    termsDir: string;
    glossaryFilepath: string;
    baseUrl?: string;
    resolved?: boolean;
    glossaryTerms?: Record<string, any>;
    termPreviewComponentPath?: string;
    glossaryComponentPath?: string;
    glossaryDir?: string;
}
declare function DocusaurusTerminologyPlugin(context: DocusaurusContext, options: TerminologyOptions): Promise<{
    name: string;
    configureWebpack(config: Configuration, isServer: boolean, utils: ConfigureWebpackUtils): {
        mergeStrategy: {
            module: string;
        };
        module: webpack.ModuleOptions | undefined;
    };
}>;

export { type ConfigureWebpackUtils, type DocusaurusContext, type TerminologyOptions, type WebpackRule, DocusaurusTerminologyPlugin as default };
