import { load } from "js-yaml";

export interface MarkdownBlock<T> {
  metadata: T;
  content: string;
}

const chunks = <T>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

export const parse = <T>(content: string): MarkdownBlock<T>[] => {
  if (!content || typeof content !== "string") {
    return [{ metadata: {} as T, content: content || "" }];
  }

  try {
    const blocks = content
      .split(/^---$/m)
      .map((block) => block.trim())
      .filter(Boolean);

    if (blocks.length === 1) {
      return [{ metadata: {} as T, content: blocks[0] }];
    }

    return chunks(blocks, 2).map(([metaBlock, contentBlock = ""]) => {
      let metadata = {} as T;

      try {
        metadata = (metaBlock ? (load(metaBlock) as T) : {}) as T;
      } catch (metaError) {
        console.warn("Failed to parse metadata block:", metaError);
      }

      return { metadata, content: contentBlock };
    });
  } catch (error) {
    console.error("Failed to parse markdown:", error);
    return [{ metadata: {} as T, content: content }];
  }
};
