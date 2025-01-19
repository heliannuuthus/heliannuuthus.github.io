interface MarkdownBlock<T> {
  metadata: T;
  content: string;
}
declare const parse: <T>(content: string) => MarkdownBlock<T>[];

export { type MarkdownBlock, parse };
